import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import GithubPortfolioBuild from '../models/GithubPortfolioBuild.model.js';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { extractGithubToken } from '../middleware/githubKey.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import {
  buildGithubPortfolioSchema,
  validateTokenSchema,
} from '../schemas/portfolioGithub.schema.js';
import {
  enrichWithGitHubData,
  fetchGithubProfile,
  listUserRepos,
} from '../services/githubEnricherService.js';
import {
  aggregateRepoData,
  generateGithubPortfolio,
} from '../services/ai/githubPortfolioBuilder.js';

const router = express.Router();

// ---------- helpers ----------

function resolveToken(req, bodyToken) {
  // Precedence: explicit body token (PAT) > header token (already in req) > oauth/env/public
  return bodyToken || req.githubToken || null;
}

function pickTopRepos(repos, max = 6) {
  return [...repos]
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return new Date(b.pushedAt || b.updatedAt).getTime() - new Date(a.pushedAt || a.updatedAt).getTime();
    })
    .slice(0, max);
}

// ---------- routes ----------

// POST /api/portfolio/github/repos — list a user's repos (auth-aware)
router.post(
  '/repos',
  verifyToken,
  extractGithubToken,
  asyncHandler(async (req, res) => {
    const { username, token } = req.body || {};
    if (!username || typeof username !== 'string') {
      throw new ApiError(400, 'username is required');
    }
    if (username.length > 39) {
      throw new ApiError(400, 'Invalid GitHub username');
    }

    const effectiveToken = resolveToken(req, token);
    const result = await listUserRepos(username, { token: effectiveToken, perPage: 30 });

    res.json({
      success: true,
      data: {
        ...result,
        authMode: req.githubAuthMode,
        rateLimit: req.githubAuthMode === 'public' ? 'low' : 'high',
      },
    });
  })
);

// POST /api/portfolio/github/validate-token — check a PAT's scopes + validity
router.post(
  '/validate-token',
  verifyToken,
  validate(validateTokenSchema),
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Career-Pilot-Backend',
      Authorization: `token ${token}`,
    };
    const response = await fetch('https://api.github.com/user', { headers });

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: 'Token is invalid or expired',
      });
    }
    const user = await response.json();
    const scopesHeader = response.headers.get('x-oauth-scopes') || '';
    const scopes = scopesHeader
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    res.json({
      success: true,
      data: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        htmlUrl: user.html_url,
        scopes,
        hasRepoScope: scopes.includes('repo'),
      },
    });
  })
);

// POST /api/portfolio/github/build — full portfolio generation
router.post(
  '/build',
  verifyToken,
  extractAIProvider,
  extractGithubToken,
  aiRateLimiter,
  validate(buildGithubPortfolioSchema),
  asyncHandler(async (req, res) => {
    const { username, token, selectedRepos, templateSlug, isPublic } = req.body;
    const userId = req.user.uid;

    const effectiveToken = resolveToken(req, token);

    // 1. Fetch profile (skip if it errors on public — fall back to repos-only)
    let profile;
    try {
      const profileResult = await fetchGithubProfile(username, effectiveToken);
      if (profileResult.rateLimited) {
        return res.status(429).json({
          success: false,
          error: 'GitHub rate limit reached. Add a token in Settings to continue.',
        });
      }
      profile = profileResult.profile;
    } catch (err) {
      console.warn('[portfolio-github] profile fetch failed:', err.message);
    }

    // 2. List repos
    let reposResult;
    try {
      reposResult = await listUserRepos(username, { token: effectiveToken, perPage: 50 });
    } catch (err) {
      throw new ApiError(400, `Failed to list GitHub repos: ${err.message}`);
    }
    if (reposResult.rateLimited) {
      return res.status(429).json({
        success: false,
        error: 'GitHub rate limit reached. Add a token in Settings to continue.',
      });
    }

    // 3. Pick repos
    let chosen = pickTopRepos(reposResult.repos, 6);
    if (Array.isArray(selectedRepos) && selectedRepos.length > 0) {
      const wanted = new Set(selectedRepos.map((s) => s.toLowerCase()));
      chosen = reposResult.repos.filter((r) => wanted.has(r.fullName.toLowerCase()));
      if (chosen.length === 0) {
        chosen = pickTopRepos(reposResult.repos, 6);
      }
    }

    // 4. Enrich each chosen repo (parallel, capped concurrency)
    const enriched = [];
    const concurrency = 3;
    for (let i = 0; i < chosen.length; i += concurrency) {
      const slice = chosen.slice(i, i + concurrency);
      const results = await Promise.all(
        slice.map(async (repo) => {
          const [owner, name] = repo.fullName.split('/');
          try {
            const data = await enrichWithGitHubData(owner, name, effectiveToken);
            return { repo, data };
          } catch (err) {
            console.warn(`[portfolio-github] enrich failed for ${repo.fullName}:`, err.message);
            return { repo, data: { metadata: repo, error: err.message } };
          }
        })
      );
      enriched.push(...results);
    }

    // 5. Aggregate stats
    const enrichedRepos = enriched.map((e) => e.data);
    const aggregate = aggregateRepoData(enrichedRepos);

    // 6. Generate sections via AI
    let sections;
    let providerName = '';
    try {
      const aiResult = await generateGithubPortfolio({
        profile,
        repos: enrichedRepos.map((e) => ({
          ...e.metadata,
          readme: e.readme,
          topics: e.metadata?.topics || [],
        })),
        languages: aggregate.topLanguages.reduce((acc, l) => {
          acc[l.name] = l.value;
          return acc;
        }, {}),
        aggregateStats: aggregate,
        aiProvider: req.aiProvider,
      });
      sections = aiResult.sections;
      providerName = aiResult.provider;
    } catch (err) {
      console.error('[portfolio-github] AI generation failed:', err.message);
      // Fall back to a structured draft so the user still has *something* to edit
      sections = {
        hero: {
          headline: profile?.name || username,
          subheadline: profile?.bio || 'Software engineer',
          location: profile?.location || '',
          availableFor: 'Open to interesting work',
        },
        about: profile?.bio || '',
        projects: enrichedRepos.slice(0, 6).map((r) => ({
          name: r.metadata?.name,
          title: r.metadata?.name,
          summary: r.metadata?.description || '',
          highlights: [],
          tech: r.metadata?.topics || [],
          url: `https://github.com/${username}/${r.metadata?.name}`,
          stars: r.metadata?.stars || 0,
          forks: r.metadata?.forks || 0,
        })),
        skills: {
          languages: aggregate.topLanguages.slice(0, 6).map((l) => ({ name: l.name, level: 3 })),
          tools: [],
          domains: aggregate.domains,
        },
        callToAction: 'Get in touch to collaborate.',
      };
      providerName = 'fallback';
    }

    // 7. Persist
    const shareToken = uuidv4().slice(0, 12);
    const saved = await GithubPortfolioBuild.create({
      userId,
      username,
      repoCount: chosen.length,
      selectedRepos: chosen.map((r) => r.fullName),
      sections,
      templateSlug,
      profile: profile || {},
      languageStats: aggregate.topLanguages,
      aggregateStats: aggregate,
      authMode: req.githubAuthMode === 'env' ? 'public' : req.githubAuthMode || 'public',
      shareToken,
      isPublic: Boolean(isPublic),
      provider: providerName,
    });

    res.json({
      success: true,
      data: {
        id: saved._id,
        shareToken,
        username,
        sections,
        profile,
        languageStats: aggregate.topLanguages,
        aggregateStats: aggregate,
        selectedRepos: chosen.map((r) => r.fullName),
        templateSlug,
        authMode: saved.authMode,
        provider: providerName,
      },
    });
  })
);

// GET /api/portfolio/github/history — user's previous builds
router.get(
  '/history',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { uid: userId } = req.user;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const builds = await GithubPortfolioBuild.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v')
      .lean();
    res.json({ success: true, data: builds });
  })
);

// GET /api/portfolio/github/:id — fetch a single build
router.get(
  '/:id',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { uid: userId } = req.user;
    const build = await GithubPortfolioBuild.findOne({ _id: req.params.id, userId }).lean();
    if (!build) throw new ApiError(404, 'Build not found');
    res.json({ success: true, data: build });
  })
);

// DELETE /api/portfolio/github/:id — remove a build
router.delete(
  '/:id',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { uid: userId } = req.user;
    const result = await GithubPortfolioBuild.deleteOne({ _id: req.params.id, userId });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'Build not found');
    }
    res.json({ success: true });
  })
);

export default router;