import express from 'express';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import cacheHeaders from '../middleware/cacheHeaders.js';
import { validateToken as validateCloudflareToken } from '../services/deploy/cloudflareDeployer.js';
import { validateToken as validateGithubToken } from '../services/deploy/githubPagesDeployer.js';
import { validateToken as validateNetlifyToken } from '../services/deploy/netlifyDeployer.js';
import { validatePortfolioSlug, validatePortfolioContent } from '../middleware/portfolioValidator.js';
import Portfolio from '../models/Portfolio.model.js';
import { enhanceSection } from '../services/ai/portfolioContentEnhancer.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { generateRobotsTxt, generateSitemapXml } from '../utils/sitemapGenerator.js';
import { analyzeAccessibility } from '../services/accessibilityChecker.js';
import PortfolioVersion from '../models/PortfolioVersion.model.js';
import UserProfile from '../models/UserProfile.model.js';
import { getObjectDiff, applyDiff } from '../utils/diff.js';

const router = express.Router();

const VALID_SECTIONS = ['hero', 'projects', 'about', 'skills'];
const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/i;
const FREE_TIER_LIMIT_MB = 100;

const getPublicPortfolioBaseUrl = (req) => {
  const configuredBaseUrl = process.env.PORTFOLIO_BASE_URL || process.env.FRONTEND_URL;
  const fallbackBaseUrl = `${req.protocol}://${req.get('host')}`;
  return String(configuredBaseUrl || fallbackBaseUrl).replace(/\/$/, '');
};

const getApiBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`.replace(/\/$/, '');
};

const getPortfolioTemplatePath = (slug) => {
  return new URL(`../templates/portfolio/${slug}/index.html`, import.meta.url);
};

const assertValidPortfolioSlug = (slug) => {
  if (!VALID_SLUG_PATTERN.test(slug)) {
    throw new ApiError(400, 'Invalid portfolio slug.');
  }
};

// In-memory fallback for testing without a database
const inMemoryStore = new Map();

// Helper to reconstruct full state from versions
const reconstructVersion = async (portfolioId, targetVersionNumber, isConnected) => {
  if (isConnected) {
    const closestSnapshot = await PortfolioVersion.findOne({
      portfolioId,
      version: { $lte: targetVersionNumber },
      snapshot: { $ne: null }
    }).sort({ version: -1 });

    if (!closestSnapshot) return null;

    let content = closestSnapshot.snapshot;

    if (closestSnapshot.version < targetVersionNumber) {
      const intermediateDiffs = await PortfolioVersion.find({
        portfolioId,
        version: { $gt: closestSnapshot.version, $lte: targetVersionNumber }
      }).sort({ version: 1 });

      for (const v of intermediateDiffs) {
        if (v.changes) content = applyDiff(content, v.changes);
      }
    }
    return content;
  } else {
    const versions = inMemoryStore.get(portfolioId) || [];
    const targetVersions = versions.filter(v => v.version <= targetVersionNumber);
    if (targetVersions.length === 0) return null;

    let snapshotIdx = -1;
    for (let i = targetVersions.length - 1; i >= 0; i--) {
      if (targetVersions[i].snapshot) {
        snapshotIdx = i;
        break;
      }
    }

    if (snapshotIdx === -1) return null;

    let content = targetVersions[snapshotIdx].snapshot;
    for (let i = snapshotIdx + 1; i < targetVersions.length; i++) {
      if (targetVersions[i].changes) {
        content = applyDiff(content, targetVersions[i].changes);
      }
    }
    return content;
  }
};

/**
 * a. POST /enhance-portfolio-content
 */
router.post(
  '/enhance-portfolio-content',
  verifyToken,
  extractAIProvider,
  asyncHandler(async (req, res) => {
    const { sectionType, content } = req.body;

    if (!sectionType || !content) {
      throw new ApiError(400, 'sectionType and content are required.');
    }

    if (!VALID_SECTIONS.includes(sectionType)) {
      throw new ApiError(400, `Invalid sectionType. Allowed: ${VALID_SECTIONS.join(', ')}`);
    }

    if (content === null || Array.isArray(content) || typeof content !== 'object') {
      throw new ApiError(400, 'content must be a non-null object.');
    }

    const result = await enhanceSection(
      sectionType,
      content,
      req.aiProvider
    );

    res.status(200).json({
      success: true,
      message: 'Enhancement suggestion generated. Review before applying.',
      data: {
        sectionType: result.sectionType,
        before: result.original,
        after: result.enhanced,
        improvements: result.improvements,
      },
    });
  })
);

/**
 * b. POST /api/portfolio/validate-token
 */
const TOKEN_VALIDATORS = {
  cloudflare: (token) => validateCloudflareToken(token),
  github: (token) => validateGithubToken(token),
  netlify: (token) => validateNetlifyToken(token),
};

router.post('/validate-token', verifyToken, asyncHandler(async (req, res) => {
  const { provider, token } = req.body ?? {};

  if (!provider || !TOKEN_VALIDATORS[provider]) {
    throw new ApiError(400, `provider must be one of: ${Object.keys(TOKEN_VALIDATORS).join(', ')}`);
  }

  const result = await TOKEN_VALIDATORS[provider](token);

  res.status(200).json({ success: true, provider, ...result });
}));

/**
 * c. GET /api/portfolio/public/:slug/sitemap.xml
 */
router.get(
  '/public/:slug/sitemap.xml',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    assertValidPortfolioSlug(slug);

    let templateStat;

    try {
      templateStat = await fs.stat(
        getPortfolioTemplatePath(slug)
      );
    } catch {
      throw new ApiError(
        404,
        'Portfolio template not found.'
      );
    }

    const sitemapXml = generateSitemapXml({
      baseUrl: getPublicPortfolioBaseUrl(req),
      slug,
      portfolioPath: '/portfolio/public',
      portfolioUpdatedAt: templateStat.mtime,
    });

    res
      .status(200)
      .type('application/xml')
      .send(sitemapXml);
  })
);

/**
 * d. GET /api/portfolio/public/:slug/robots.txt
 */
router.get(
  '/public/:slug/robots.txt',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    assertValidPortfolioSlug(slug);

    try {
      await fs.stat(getPortfolioTemplatePath(slug));
    } catch {
      throw new ApiError(404, 'Portfolio template not found.');
    }

    const sitemapUrl = `${getApiBaseUrl(req)}/api/portfolio/public/${encodeURIComponent(slug)}/sitemap.xml`;

    res
      .status(200)
      .type('text/plain')
      .send(generateRobotsTxt({ sitemapUrl }));
  })
);

/**
 * e. GET /api/portfolio/public/:slug/accessibility
 */
router.get(
  '/public/:slug/accessibility',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    assertValidPortfolioSlug(slug);
    const templatePath = getPortfolioTemplatePath(slug);

    let html;

    try {
      html = await fs.readFile(templatePath, 'utf-8');
    } catch {
      throw new ApiError(404, 'Portfolio template not found.');
    }

    const report = await analyzeAccessibility(html);

    res.status(200).json({
      success: true,
      slug,
      data: report,
    });
  })
);

/**
 * f. GET /api/portfolio
 */
router.get('/', asyncHandler(async (req, res) => {
  const templatesDir = new URL('../templates/portfolio', import.meta.url);

  let slugs = [];

  try {
    const entries = await fs.readdir(templatesDir);
    slugs = entries.filter((e) => !e.startsWith('.'));
  } catch {
    slugs = [];
  }

  const portfolios = slugs.map((slug) => ({
    slug,
    url: `/portfolio/public/${slug}`,
  }));

  res.status(200).json({
    success: true,
    portfolios,
    data: portfolios
  });
}));

/**
 * POST /api/portfolio
 */
router.post(
  '/',
  verifyToken,
  validatePortfolioSlug,
  validatePortfolioContent,
  asyncHandler(async (req, res) => {
    const { slug, sections } = req.body;
    const userId = req.user.uid;

    const existing = await Portfolio.findOne({ userId, slug });

    if (existing) {
      throw new ApiError(409, `A portfolio with slug "${slug}" already exists.`);
    }

    const portfolio = await Portfolio.create({
      userId,
      slug,
      sections
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio created successfully.',
      data: portfolio,
    });
  })
);

/**
 * PUT /api/portfolio/:slug
 */
router.put(
  '/:slug',
  verifyToken,
  validatePortfolioSlug,
  validatePortfolioContent,
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { sections } = req.body;
    const userId = req.user.uid;

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId, slug },
      { sections },
      { new: true }
    );

    if (!portfolio) {
      throw new ApiError(404, `Portfolio "${slug}" not found.`);
    }

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully.',
      data: portfolio,
    });
  })
);

export default router;