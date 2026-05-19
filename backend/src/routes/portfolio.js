import express from 'express';
import fs from 'fs/promises';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { enhanceSection } from '../services/ai/portfolioContentEnhancer.js';
import { generateRobotsTxt, generateSitemapXml } from '../utils/sitemapGenerator.js';

const router = express.Router();

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

const getPublicPortfolioPageUrl = (req, slug) => {
  return `${getPublicPortfolioBaseUrl(req)}/portfolio/public/${encodeURIComponent(slug)}`;
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
 * Enhance a portfolio section using AI
 * Returns before/after comparison — does NOT save automatically
 */
router.post('/enhance-portfolio-content', verifyToken, asyncHandler(async (req, res) => {
  const { sectionType, content } = req.body;

  // Validate inputs
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

  res
    .status(200)
    .type('application/xml')
    .send(sitemapXml);
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

  res
    .status(200)
    .type('text/plain')
    .send(generateRobotsTxt({ sitemapUrl }));
}));

export default router;