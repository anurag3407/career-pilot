import { sanitizePortfolioHtml, detectThreats } from '../utils/htmlSanitizer.js';

/**
 * Render and sanitize a portfolio template before serving
 * @param {string} rawHtml - Raw HTML from template
 * @param {object} data - Portfolio data to inject
 * @returns {object} - { html, threats, wasSanitized }
 */
export const renderPortfolioTemplate = (rawHtml, data = {}) => {
  if (typeof rawHtml !== 'string') {
    throw new TypeError('rawHtml must be a string');
  }

  // Detect threats before sanitizing
  const { safe, threats } = detectThreats(rawHtml);

  // Always sanitize regardless
  const sanitizedHtml = sanitizePortfolioHtml(rawHtml);

  return {
    html: sanitizedHtml,
    threats,
    wasSanitized: !safe,
  };
};