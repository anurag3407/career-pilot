import express from 'express';
import fs from 'fs/promises';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import cacheHeaders from '../middleware/cacheHeaders.js';
import { validateToken as validateCloudflareToken } from '../services/deploy/cloudflareDeployer.js';
import { validateToken as validateGithubToken } from '../services/deploy/githubPagesDeployer.js';
import { validateToken as validateNetlifyToken } from '../services/deploy/netlifyDeployer.js';
import { enhanceSection } from '../services/ai/portfolioContentEnhancer.js';
import { generateRobotsTxt, generateSitemapXml } from '../utils/sitemapGenerator.js';
import { analyzeAccessibility } from '../services/accessibilityChecker.js';

const router = express.Router();

const VALID_SECTIONS = ['hero', 'projects', 'about', 'skills'];

const VALID_SLUG_PATTERN =
  /^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/i;

const FREE_TIER_LIMIT_MB = 100;

const getPublicPortfolioBaseUrl = (req) => {
  const configuredBaseUrl =
    process.env.PORTFOLIO_BASE_URL ||
    process.env.FRONTEND_URL;

  const fallbackBaseUrl =
    `${req.protocol}://${req.get('host')}`;

  return String(
    configuredBaseUrl || fallbackBaseUrl
  ).replace(/\/$/, '');
};

const getApiBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`
    .replace(/\/$/, '');
};

const getPublicPortfolioPageUrl = (req, slug) => {
  return `${getPublicPortfolioBaseUrl(req)}/portfolio/public/${encodeURIComponent(slug)}`;
};

const getPortfolioTemplatePath = (slug) => {
  return new URL(
    `../templates/portfolio/${slug}/index.html`,
    import.meta.url
  );
};

const assertValidPortfolioSlug = (slug) => {
  if (!VALID_SLUG_PATTERN.test(slug)) {
    throw new ApiError(
      400,
      'Invalid portfolio slug.'
    );
  }
};

/**
 * POST /api/portfolio/enhance-portfolio-content
 */
router.post(
  '/enhance-portfolio-content',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { sectionType, content } = req.body;

    if (!sectionType || !content) {
      throw new ApiError(
        400,
        'sectionType and content are required.'
      );
    }

    if (!VALID_SECTIONS.includes(sectionType)) {
      throw new ApiError(
        400,
        `Invalid sectionType. Allowed: ${VALID_SECTIONS.join(', ')}`
      );
    }

    if (
      content === null ||
      Array.isArray(content) ||
      typeof content !== 'object'
    ) {
      throw new ApiError(
        400,
        'content must be a non-null object.'
      );
    }

    const result = await enhanceSection(
      sectionType,
      content
    );

    res.status(200).json({
      success: true,
      message:
        'Enhancement suggestion generated. Review before applying.',
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
 * POST /api/portfolio/:id/performance
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
 * GET /api/portfolio/public/:slug/sitemap.xml
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
 * GET /api/portfolio/public/:slug/robots.txt
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
 * POST /api/portfolio/validate-token
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
 * GET /api/portfolio/:slug/bandwidth
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

/**
 * GET /api/portfolio/public/:slug/accessibility
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
 * GET /api/portfolio
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

export default router;
