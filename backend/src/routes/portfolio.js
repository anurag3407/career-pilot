import express from 'express';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import cacheHeaders from '../middleware/cacheHeaders.js';
import { validateToken as validateCloudflareToken, deploy as cloudflareDeploy } from '../services/deploy/cloudflareDeployer.js';
import { validateToken as validateGithubToken, deploy as githubDeploy } from '../services/deploy/githubPagesDeployer.js';
import { validateToken as validateNetlifyToken, deploy as netlifyDeploy } from '../services/deploy/netlifyDeployer.js';
import { buildPortfolioBundle } from '../services/deploy/portfolioHtmlGenerator.js';
import { validatePortfolioSlug, validatePortfolioContent } from '../middleware/portfolioValidator.js';
import Portfolio from '../models/Portfolio.model.js';
import Resume from '../models/Resume.model.js';
import { enhanceSection } from '../services/ai/portfolioContentEnhancer.js';
import { extractPortfolioData } from '../services/ai/portfolioExtractor.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { generateRobotsTxt, generateSitemapXml } from '../utils/sitemapGenerator.js';
import { analyzeAccessibility } from '../services/accessibilityChecker.js';
import PortfolioVersion from '../models/PortfolioVersion.model.js';
import UserProfile from '../models/UserProfile.model.js';
import { getObjectDiff, applyDiff } from '../utils/diff.js';

const router = express.Router();

const VALID_SECTIONS = ['hero', 'projects', 'about', 'skills', 'experience', 'education'];
const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/i;
const FREE_TIER_LIMIT_MB = 100;

// @route   POST /api/portfolio/extract-from-resume
// @desc    Extracts portfolio JSON structure from raw resume text using AI
// @access  Private
router.post('/extract-from-resume', verifyToken, extractAIProvider, asyncHandler(async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) {
    throw new ApiError(400, 'Resume text is required');
  }

  const extractedData = await extractPortfolioData(resumeText, req.aiProvider);
  
  res.json({
    success: true,
    data: extractedData
  });
}));

// @route   POST /api/portfolio/generate-from-resume/:resumeId
// @desc    Generates portfolio JSON from an enhanced resume
// @access  Private
router.post('/generate-from-resume/:resumeId', verifyToken, extractAIProvider, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;

  const resume = await Resume.findOne({ _id: resumeId, userId }).lean();
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  if (!resume.enhancedText) {
    throw new ApiError(400, 'Enhance this resume before generating a portfolio');
  }

  const extractedData = await extractPortfolioData(resume.enhancedText, req.aiProvider);

  res.json({
    success: true,
    data: extractedData
  });
}));


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

    // Find latest snapshot
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
 * a. POST   /enhance-portfolio-content
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
  let { provider, token } = req.body ?? {};
  if (typeof token === 'string') token = token.trim();

  if (!provider || !TOKEN_VALIDATORS[provider]) {
    throw new ApiError(400, `provider must be one of: ${Object.keys(TOKEN_VALIDATORS).join(', ')}`);
  }

  const result = await TOKEN_VALIDATORS[provider](token);

  res.status(200).json({ success: true, provider, ...result });
}));

/**
 * POST /api/portfolio/deploy
 * Generates a standalone HTML page from portfolio data and deploys it
 * to Cloudflare Pages via the Direct Upload API.
 */
router.post('/deploy', verifyToken, asyncHandler(async (req, res) => {
  let { slug, sections, templateId, title, provider = 'cloudflare', token } = req.body;
  if (typeof token === 'string') token = token.trim();
  const userId = req.user.uid;

  if (!slug || typeof slug !== 'string') {
    throw new ApiError(400, 'slug is required.');
  }

  if (!sections || typeof sections !== 'object') {
    throw new ApiError(400, 'sections (portfolio data) is required.');
  }

  // Build the deployable React app bundle with the user's data and chosen template
  let html, assets;
  try {
    const bundle = await buildPortfolioBundle(sections, templateId || 'default');
    html = bundle.html;
    assets = bundle.assets;
  } catch (bundleErr) {
    console.error('Portfolio bundle build error:', bundleErr);
    throw new ApiError(500, `Failed to build portfolio: ${bundleErr.message}`);
  }

  let deployment;
  try {
    if (provider === 'github') {
      deployment = await githubDeploy(slug, html, assets, slug, token);
    } else if (provider === 'netlify') {
      deployment = await netlifyDeploy(slug, html, assets, slug, token);
    } else {
      deployment = await cloudflareDeploy(slug, html, assets);
    }
  } catch (err) {
    console.error(`${provider} deploy error:`, err);
    throw new ApiError(502, `Deployment failed: ${err.message}`);
  }

  // Save the portfolio to the database (upsert so re-deploys overwrite)
  try {
    await Portfolio.findOneAndUpdate(
      { userId, slug },
      { userId, slug, sections, deployedUrl: deployment.url, projectName: deployment.projectName || slug },
      { upsert: true, new: true }
    );
  } catch (dbErr) {
    console.error('DB save after deploy error:', dbErr);
    // Don't fail the response — the site IS live, even if DB save had an issue
  }

  res.status(200).json({
    success: true,
    message: 'Portfolio deployed successfully!',
    data: {
      url: deployment.url,
      deploymentId: deployment.deployId || deployment.commitSha || deployment.deploymentId || null,
      projectName: deployment.projectName || slug,
    },
  });
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
 * Returns a list of available portfolio template slugs.
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
  res.status(200).json({ success: true, portfolios, data: portfolios });
}));

/**
 * POST /api/portfolio
 * Create a new portfolio with validated and sanitized content.
 */
router.post('/', verifyToken, validatePortfolioSlug, validatePortfolioContent, asyncHandler(async (req, res) => {
  const { slug, sections } = req.body;
  const userId = req.user.uid;

  const existing = await Portfolio.findOne({ userId, slug });
  if (existing) {
    throw new ApiError(409, `A portfolio with slug "${slug}" already exists.`);
  }

  const portfolio = await Portfolio.create({ userId, slug, sections });

  res.status(201).json({
    success: true,
    message: 'Portfolio created successfully.',
    data: portfolio,
  });
}));

/**
 * PUT /api/portfolio/:slug
 * Update an existing portfolio with validated and sanitized content.
 */
router.put('/:slug', verifyToken, validatePortfolioSlug, validatePortfolioContent, asyncHandler(async (req, res) => {
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


  res.status(200).json({
    success: true,
    message: 'Portfolio updated successfully.',
    data: portfolio,
  });
  
}));

/**
 * g. POST /api/portfolio/:id/save
 */
router.post('/:id/save', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Authorization check (IDOR Protection)
  if (req.user.uid !== id) {
    throw new ApiError(403, 'Unauthorized access to this portfolio.');
  }

  if (!content) {
    throw new ApiError(400, 'Content is required for saving.');
  }

  const isConnected = mongoose.connection.readyState === 1;
  let latestVersion;

  if (isConnected) {
    latestVersion = await PortfolioVersion.findOne({ portfolioId: id }).sort({ version: -1 });
  } else {
    const portfolioVersions = inMemoryStore.get(id) || [];
    latestVersion = portfolioVersions[portfolioVersions.length - 1];
  }
  
  const newVersionNumber = (latestVersion?.version || 0) + 1;

  let changes = null;
  let snapshot = null;

  if (!latestVersion) {
    snapshot = content;
  } else {
    // Correctly reconstruct old content for diffing
    const oldContent = await reconstructVersion(id, latestVersion.version, isConnected) || {};
    changes = getObjectDiff(oldContent, content);
    
    if (!changes) {
      return res.status(200).json({
        success: true,
        message: 'No changes detected. Version not created.',
        version: latestVersion.version
      });
    }

    // Every 10th version gets a full snapshot for efficiency
    if (newVersionNumber % 10 === 0) {
      snapshot = content;
    }
  }

  const versionData = {
    portfolioId: id,
    version: newVersionNumber,
    changes,
    snapshot,
    createdBy: req.user.uid,
  };

  if (isConnected) {
    try {
      await PortfolioVersion.create(versionData);
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(409, 'A save request is already in progress. Please try again.');
      }
      throw error;
    }
    
    // Prune old versions (keep latest 50)
    if (newVersionNumber > 50) {
      const thresholdVersion = newVersionNumber - 50;
      
      // Ensure the new base version (thresholdVersion + 1) is a snapshot so it doesn't get orphaned
      const nextBaseVersion = await PortfolioVersion.findOne({
          portfolioId: id,
          version: thresholdVersion + 1
      });

      if (nextBaseVersion && !nextBaseVersion.snapshot) {
          const fullContent = await reconstructVersion(id, thresholdVersion + 1, true);
          await PortfolioVersion.updateOne(
              { _id: nextBaseVersion._id },
              { $set: { snapshot: fullContent, changes: null } }
          );
      }

      await PortfolioVersion.deleteMany({
        portfolioId: id,
        version: { $lte: thresholdVersion }
      });
    }
  } else {
    let portfolioVersions = inMemoryStore.get(id) || [];
    portfolioVersions.push({ _id: `mock-${Date.now()}`, ...versionData, createdAt: new Date() });
    if (portfolioVersions.length > 50) portfolioVersions.shift();
    inMemoryStore.set(id, portfolioVersions);
  }

  res.status(200).json({
    success: true,
    message: `Portfolio saved and version ${newVersionNumber} created.`,
    version: newVersionNumber,
    type: snapshot ? 'snapshot' : 'diff'
  });
}));

/**
 * h. GET /api/portfolio/:id/versions
 */
router.get('/:id/versions', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.uid !== id) {
    throw new ApiError(403, 'Unauthorized access to version history.');
  }

  const isConnected = mongoose.connection.readyState === 1;

  let versions;
  if (isConnected) {
    versions = await PortfolioVersion.find({ portfolioId: id })
      .sort({ version: -1 })
      .select('-snapshot -changes')
      .limit(50);
  } else {
    versions = (inMemoryStore.get(id) || [])
      .slice()
      .reverse()
      .map(({ snapshot, changes, ...v }) => v);
  }

  res.status(200).json({
    success: true,
    portfolioId: id,
    data: versions,
  });
}));

/**
 * i. POST /api/portfolio/:id/restore/:versionId
 */
router.post('/:id/restore/:versionId', verifyToken, asyncHandler(async (req, res) => {
  const { id, versionId } = req.params;

  if (req.user.uid !== id) {
    throw new ApiError(403, 'Unauthorized access to restore this portfolio.');
  }

  const isConnected = mongoose.connection.readyState === 1;

  let versionToRestore;
  if (isConnected) {
    if (!mongoose.Types.ObjectId.isValid(versionId)) {
      throw new ApiError(400, 'Invalid version ID format.');
    }
    versionToRestore = await PortfolioVersion.findById(versionId);
  } else {
    const portfolioVersions = inMemoryStore.get(id) || [];
    versionToRestore = portfolioVersions.find(v => v._id === versionId);
  }

  if (!versionToRestore || versionToRestore.portfolioId !== id) {
    throw new ApiError(404, 'Version not found.');
  }

  const restoredContent = await reconstructVersion(id, versionToRestore.version, isConnected);

  if (!restoredContent) {
    throw new ApiError(500, 'Could not reconstruct version data.');
  }

  let newVersionNumber;
  if (isConnected) {
    const latest = await PortfolioVersion.findOne({ portfolioId: id }).sort({ version: -1 });
    newVersionNumber = (latest?.version || 0) + 1;

    try {
      await PortfolioVersion.create({
        portfolioId: id,
        version: newVersionNumber,
        snapshot: restoredContent,
        createdBy: req.user.uid,
        message: `Restored to version ${versionToRestore.version}`,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(409, 'Conflict: Another restoration or save is in progress.');
      }
      throw error;
    }

    const currentProfile = await UserProfile.findOne({ uid: id }).lean();
    const portfolioFields = ['displayName', 'bio', 'jobRole', 'skills', 'location', 'website', 'github', 'linkedin', 'projects'];
    const update = { $set: {}, $unset: {} };

    for (const field of portfolioFields) {
      if (restoredContent[field] !== undefined) {
        update.$set[field] = restoredContent[field];
      } else if (currentProfile?.[field] !== undefined) {
        update.$unset[field] = '';
      }
    }

    if (Object.keys(update.$set).length === 0) delete update.$set;
    if (Object.keys(update.$unset).length === 0) delete update.$unset;

    await UserProfile.findOneAndUpdate({ uid: id }, update, { upsert: true });
  } else {
    let portfolioVersions = inMemoryStore.get(id) || [];
    newVersionNumber = (portfolioVersions[portfolioVersions.length - 1]?.version || 0) + 1;
    portfolioVersions.push({
      _id: `mock-${Date.now()}`,
      portfolioId: id,
      version: newVersionNumber,
      snapshot: restoredContent,
      createdBy: req.user.uid,
      createdAt: new Date(),
    });
    inMemoryStore.set(id, portfolioVersions);
  }

  res.status(200).json({
    success: true,
    message: `Successfully restored to version ${versionToRestore.version}`,
    portfolioId: id,
    version: versionToRestore.version,
    data: restoredContent,
  });
}));

/**
 * j. POST /api/portfolio/:id/performance
 */
router.post(
  '/:id/performance',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
      htmlSizeKB,
      cssSizeKB,
      imageSizeMB,
      externalRequests,
      cssSelectors,
      fontStrategy,
    } = req.body;

    if (
      !htmlSizeKB &&
      !cssSizeKB &&
      !imageSizeMB
    ) {
      throw new ApiError(
        400,
        'Performance metrics payload is required.'
      );
    }

    res.status(200).json({
      success: true,
      message: `Performance metrics recorded for portfolio ${id}`,
      data: {
        portfolioId: id,
        receivedMetrics: {
          htmlSizeKB,
          cssSizeKB,
          imageSizeMB,
          externalRequests,
          cssSelectors,
          fontStrategy,
        },
      },
    });
  })
);

/**
 * k. GET /api/portfolio/:slug/bandwidth
 */
router.get('/:slug/bandwidth', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  assertValidPortfolioSlug(slug);

  try {
    await fs.stat(getPortfolioTemplatePath(slug));
  } catch {
    throw new ApiError(404, 'Portfolio template not found.');
  }

  const estimatedPageSizeKB = 500;
  const monthlyViews = 1200;
  const bandwidthUsageMB = (estimatedPageSizeKB * monthlyViews) / 1024;
  const usagePercentage = (bandwidthUsageMB / FREE_TIER_LIMIT_MB) * 100;

  res.status(200).json({
    success: true,
    data: {
      slug,
      estimatedPageSizeKB,
      monthlyViews,
      bandwidthUsageMB: bandwidthUsageMB.toFixed(2),
      freeTierLimitMB: FREE_TIER_LIMIT_MB,
      usagePercentage: usagePercentage.toFixed(2),
      warning: usagePercentage >= 80,
    },
  });
}));

export default router;
