import express from 'express';
import fs from 'fs/promises';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { enhanceSection } from '../services/ai/portfolioContentEnhancer.js';
import { generateRobotsTxt, generateSitemapXml } from '../utils/sitemapGenerator.js';

const router = express.Router();

// Admin email whitelist — loaded from environment or fallback
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : ['someshtiwari.in@gmail.com', 'admin@careerpilot.dev'];

/**
 * Middleware to verify admin access.
 */
const requireAdmin = (req, res, next) => {
  const userEmail = req.user?.email;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Protected admin-only stats endpoint
// GET /api/portfolio/admin/stats
router.get('/admin/stats', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const now = new Date();
  const adminStats = {
    totalDeployments: { today: 18, week: 127, month: 512 },
    activePortfolios: 243,
    avgDeploymentTime: 38,
    systemUptime: 99.97,
    successRate: 97.6,
    successCount: 500,
    failureCount: 12,
    providerStats: {
      vercel: { deployments: 320, successRate: 98.4, avgTime: 32, failures: 5 },
      netlify: { deployments: 142, successRate: 96.5, avgTime: 44, failures: 5 },
      github: { deployments: 50, successRate: 96.0, avgTime: 51, failures: 2 },
    },
    deploymentTrends: [
      { name: 'Mon', vercel: 18, netlify: 8, github: 4, total: 30 },
      { name: 'Tue', vercel: 22, netlify: 10, github: 5, total: 37 },
      { name: 'Wed', vercel: 14, netlify: 7, github: 3, total: 24 },
      { name: 'Thu', vercel: 26, netlify: 12, github: 6, total: 44 },
      { name: 'Fri', vercel: 20, netlify: 9, github: 4, total: 33 },
      { name: 'Sat', vercel: 8, netlify: 4, github: 2, total: 14 },
      { name: 'Sun', vercel: 10, netlify: 3, github: 1, total: 14 },
    ],
    hourlyThroughput: Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      count: Math.floor(Math.random() * 12) + (i >= 9 && i <= 18 ? 8 : 1),
    })),
    providerUsage: {
      vercel: { used: 850, limit: 1000 },
      netlify: { used: 220, limit: 500 },
      github: { used: 78, limit: 1000 },
    },
    systemHealth: {
      api: { status: 'operational', latency: 42 },
      database: { status: 'operational', latency: 8 },
      redis: { status: 'degraded', latency: 125 },
      storage: { status: 'operational', latency: 18 },
    },
    recentDeployments: [
      { id: 'dep_a1b2c3', user: 'john@example.com', provider: 'vercel', status: 'success', duration: 28, createdAt: new Date(now - 300000).toISOString() },
      { id: 'dep_d4e5f6', user: 'sara@example.com', provider: 'netlify', status: 'success', duration: 42, createdAt: new Date(now - 900000).toISOString() },
      { id: 'dep_g7h8i9', user: 'mike@example.com', provider: 'vercel', status: 'failed', duration: 15, createdAt: new Date(now - 1800000).toISOString() },
      { id: 'dep_j0k1l2', user: 'emma@example.com', provider: 'github', status: 'success', duration: 55, createdAt: new Date(now - 3600000).toISOString() },
      { id: 'dep_m3n4o5', user: 'alex@example.com', provider: 'vercel', status: 'success', duration: 31, createdAt: new Date(now - 7200000).toISOString() },
      { id: 'dep_p6q7r8', user: 'lisa@example.com', provider: 'netlify', status: 'failed', duration: 12, createdAt: new Date(now - 10800000).toISOString() },
    ],
    generatedAt: now.toISOString(),
  };

  res.json(adminStats);
}));

const VALID_SECTIONS = ['hero', 'projects', 'about', 'skills'];
const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/i;

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

/**
 * POST /api/ai/enhance-portfolio-content
 */
router.post('/enhance-portfolio-content', verifyToken, asyncHandler(async (req, res) => {
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

  const result = await enhanceSection(sectionType, content);

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
}));

router.get('/public/:slug/sitemap.xml', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  assertValidPortfolioSlug(slug);

  let templateStat;
  try {
    templateStat = await fs.stat(getPortfolioTemplatePath(slug));
  } catch {
    throw new ApiError(404, 'Portfolio template not found.');
  }

  const sitemapXml = generateSitemapXml({
    baseUrl: getPublicPortfolioBaseUrl(req),
    slug,
    portfolioPath: '/portfolio/public',
    portfolioUpdatedAt: templateStat.mtime,
  });

  res.status(200).type('application/xml').send(sitemapXml);
}));

router.get('/public/:slug/robots.txt', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  assertValidPortfolioSlug(slug);

  try {
    await fs.stat(getPortfolioTemplatePath(slug));
  } catch {
    throw new ApiError(404, 'Portfolio template not found.');
  }

  const sitemapUrl = `${getApiBaseUrl(req)}/api/portfolio/public/${encodeURIComponent(slug)}/sitemap.xml`;
  res.status(200).type('text/plain').send(generateRobotsTxt({ sitemapUrl }));
}));

export default router;