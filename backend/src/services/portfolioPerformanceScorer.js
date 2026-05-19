/**
 * Portfolio Performance Scorer (Lighthouse-lite)
 * Analyzes portfolio content for performance metrics without using actual Lighthouse
 */

// Scoring weights (must sum to 100)
const WEIGHTS = {
  htmlSize: 20,
  cssSize: 20,
  imageSize: 20,
  externalRequests: 15,
  cssComplexity: 15,
  fontStrategy: 10,
};

// Targets
const TARGETS = {
  htmlSizeKB: 50,       // < 50KB
  cssSizeKB: 20,        // < 20KB
  imageSizeMB: 1,       // < 1MB total
  externalRequests: 10, // < 10 external requests
  cssSelectors: 500,    // < 500 selectors
};

/**
 * Score HTML size (0-100)
 * Target: < 50KB
 */
const scoreHtmlSize = (htmlSizeKB) => {
  if (htmlSizeKB <= TARGETS.htmlSizeKB) return 100;
  if (htmlSizeKB <= 100) return Math.round(100 - ((htmlSizeKB - 50) / 50) * 50);
  if (htmlSizeKB <= 200) return Math.round(50 - ((htmlSizeKB - 100) / 100) * 40);
  return 10;
};

/**
 * Score CSS size (0-100)
 * Target: < 20KB
 */
const scoreCssSize = (cssSizeKB) => {
  if (cssSizeKB <= TARGETS.cssSizeKB) return 100;
  if (cssSizeKB <= 50) return Math.round(100 - ((cssSizeKB - 20) / 30) * 50);
  if (cssSizeKB <= 100) return Math.round(50 - ((cssSizeKB - 50) / 50) * 40);
  return 10;
};

/**
 * Score total image size (0-100)
 * Target: < 1MB
 */
const scoreImageSize = (imageSizeMB) => {
  if (imageSizeMB <= TARGETS.imageSizeMB) return 100;
  if (imageSizeMB <= 3) return Math.round(100 - ((imageSizeMB - 1) / 2) * 60);
  if (imageSizeMB <= 5) return Math.round(40 - ((imageSizeMB - 3) / 2) * 30);
  return 10;
};

/**
 * Score external requests (0-100)
 * Target: < 10 requests
 */
const scoreExternalRequests = (count) => {
  if (count <= TARGETS.externalRequests) return 100;
  if (count <= 20) return Math.round(100 - ((count - 10) / 10) * 50);
  if (count <= 40) return Math.round(50 - ((count - 20) / 20) * 40);
  return 10;
};

/**
 * Score CSS complexity (0-100)
 * Target: < 500 selectors
 */
const scoreCssComplexity = (selectorCount) => {
  if (selectorCount <= TARGETS.cssSelectors) return 100;
  if (selectorCount <= 1000) return Math.round(100 - ((selectorCount - 500) / 500) * 50);
  if (selectorCount <= 2000) return Math.round(50 - ((selectorCount - 1000) / 1000) * 40);
  return 10;
};

/**
 * Score font loading strategy (0-100)
 * Based on strategy type
 */
const scoreFontStrategy = (strategy) => {
  const strategies = {
    'preload': 100,
    'swap': 85,
    'system': 100,
    'variable': 95,
    'none': 60,
    'blocking': 20,
    'unknown': 50,
  };
  return strategies[strategy?.toLowerCase()] ?? 50;
};

/**
 * Calculate weighted overall score
 */
const calculateOverallScore = (scores) => {
  return Math.round(
    (scores.htmlSize * WEIGHTS.htmlSize +
    scores.cssSize * WEIGHTS.cssSize +
    scores.imageSize * WEIGHTS.imageSize +
    scores.externalRequests * WEIGHTS.externalRequests +
    scores.cssComplexity * WEIGHTS.cssComplexity +
    scores.fontStrategy * WEIGHTS.fontStrategy) / 100
  );
};

/**
 * Generate actionable suggestions based on scores
 */
const generateSuggestions = (scores, metrics) => {
  const suggestions = [];

  if (scores.htmlSize < 80) {
    suggestions.push(`HTML size is ${metrics.htmlSizeKB}KB — minify HTML and remove unused markup to get under ${TARGETS.htmlSizeKB}KB.`);
  }
  if (scores.cssSize < 80) {
    suggestions.push(`CSS size is ${metrics.cssSizeKB}KB — use PurgeCSS or remove unused styles to get under ${TARGETS.cssSizeKB}KB.`);
  }
  if (scores.imageSize < 80) {
    suggestions.push(`Total image size is ${metrics.imageSizeMB.toFixed(2)}MB — compress images using WebP format and lazy loading.`);
  }
  if (scores.externalRequests < 80) {
    suggestions.push(`${metrics.externalRequests} external requests detected — bundle dependencies and reduce third-party scripts.`);
  }
  if (scores.cssComplexity < 80) {
    suggestions.push(`${metrics.cssSelectors} CSS selectors found — simplify selectors and remove redundant rules.`);
  }
  if (scores.fontStrategy < 80) {
    suggestions.push(`Font loading strategy "${metrics.fontStrategy}" is suboptimal — use font-display: swap or preload key fonts.`);
  }
  if (suggestions.length === 0) {
    suggestions.push('Great job! Your portfolio is well optimized. Consider adding resource hints (preconnect, prefetch) for further gains.');
  }

  return suggestions;
};

/**
 * Get performance grade from score
 */
const getGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

/**
 * Main scorer function
 * @param {object} portfolioData - Portfolio performance metrics
 * @returns {object} - Scores, grade, suggestions
 */
export const scorePortfolioPerformance = (portfolioData) => {
  if (!portfolioData || typeof portfolioData !== 'object' || Array.isArray(portfolioData)) {
    throw new Error('portfolioData must be a non-null object');
  }

  // Extract metrics with safe defaults
  const metrics = {
    htmlSizeKB: Number(portfolioData.htmlSizeKB) || 0,
    cssSizeKB: Number(portfolioData.cssSizeKB) || 0,
    imageSizeMB: Number(portfolioData.imageSizeMB) || 0,
    externalRequests: Number(portfolioData.externalRequests) || 0,
    cssSelectors: Number(portfolioData.cssSelectors) || 0,
    fontStrategy: portfolioData.fontStrategy || 'unknown',
  };

  // Calculate individual scores
  const scores = {
    htmlSize: scoreHtmlSize(metrics.htmlSizeKB),
    cssSize: scoreCssSize(metrics.cssSizeKB),
    imageSize: scoreImageSize(metrics.imageSizeMB),
    externalRequests: scoreExternalRequests(metrics.externalRequests),
    cssComplexity: scoreCssComplexity(metrics.cssSelectors),
    fontStrategy: scoreFontStrategy(metrics.fontStrategy),
  };

  const overall = calculateOverallScore(scores);
  const grade = getGrade(overall);
  const suggestions = generateSuggestions(scores, metrics);

  return {
    portfolioId: portfolioData.id || null,
    analyzedAt: new Date().toISOString(),
    overall,
    grade,
    scores,
    metrics,
    targets: TARGETS,
    suggestions,
  };
};