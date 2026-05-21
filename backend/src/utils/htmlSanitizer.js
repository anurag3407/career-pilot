import sanitizeHtml from 'sanitize-html';

/**
 * Whitelisted HTML tags — no script, no iframe
 */
const ALLOWED_TAGS = [
  // Structure
  'html', 'head', 'body', 'main', 'section', 'article',
  'header', 'footer', 'nav', 'aside', 'div', 'span',
  // Text
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u',
  'small', 'mark', 'del', 'ins', 'sub', 'sup', 'blockquote',
  'pre', 'code',
  // Lists
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  // Links & Media
  'a', 'img',
  // Tables
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  // Forms (display only — no action)
  'label',
  // Meta (safe ones)
  'meta', 'title',
];

/**
 * Whitelisted attributes per tag
 */
const ALLOWED_ATTRIBUTES = {
  '*': [
    'class', 'id', 'style',
    'aria-label', 'aria-hidden', 'aria-describedby',
    'role', 'tabindex',
    // data-* attributes allowed
    'data-*',
  ],
  'a': ['href', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height', 'loading'],
  'meta': ['name', 'content', 'charset', 'viewport'],
  'link': ['rel', 'href', 'type'],
  'td': ['colspan', 'rowspan'],
  'th': ['colspan', 'rowspan', 'scope'],
};

/**
 * Whitelisted CSS properties for inline styles
 */
const ALLOWED_CSS_PROPERTIES = [
  'color', 'background-color', 'background',
  'font-size', 'font-family', 'font-weight', 'font-style',
  'text-align', 'text-decoration', 'text-transform',
  'line-height', 'letter-spacing',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
  'display', 'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items',
  'grid', 'grid-template-columns', 'grid-template-rows', 'gap',
  'border', 'border-radius', 'border-color', 'border-width', 'border-style',
  'box-shadow', 'opacity', 'overflow', 'position',
  'top', 'right', 'bottom', 'left', 'z-index',
  'list-style', 'cursor',
];

/**
 * Sanitize options
 */
const SANITIZE_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowVulnerableTags: false, 

  // Allow data-* attributes globally
  allowedAttributesGlob: { '*': ['data-*'] },

  // Validate and sanitize inline styles
  allowedStyles: {
    '*': ALLOWED_CSS_PROPERTIES.reduce((acc, prop) => {
      acc[prop] = [/.*/]; // allow any value for whitelisted props
      return acc;
    }, {}),
  },

  // Block javascript: and data: URLs in href/src
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'], // data URIs OK for images
    link: ['http', 'https'],
  },

  // Force rel="noopener noreferrer" on external links
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || '';

      // Block javascript: URLs
      if (/^javascript:/i.test(href.trim())) {
        return { tagName: 'span', attribs: {} };
      }

      return {
        tagName,
        attribs: {
          ...attribs,
          // Force safe rel on all links
          rel: 'noopener noreferrer',
          // Force external links to open in new tab
          target: href.startsWith('http') ? '_blank' : attribs.target,
        },
      };
    },

    img: (tagName, attribs) => {
      const src = attribs.src || '';

      // Block external resources that aren't images
      if (/^javascript:/i.test(src.trim())) {
        return { tagName: 'span', attribs: {} };
      }

      return {
        tagName,
        attribs: {
          ...attribs,
          // Add lazy loading by default
          loading: attribs.loading || 'lazy',
        },
      };
    },
  },

  // Remove all event handlers (onclick, onerror, onload, etc.)
  disallowedTagsMode: 'discard',
};

/**
 * Sanitize HTML string to prevent XSS and code injection
 * @param {string} html - Raw HTML to sanitize
 * @returns {string} - Sanitized HTML safe for serving
 */
export const sanitizePortfolioHtml = (html) => {
  if (typeof html !== 'string') {
    throw new TypeError('html must be a string');
  }

  if (!html.trim()) return '';

  return sanitizeHtml(html, SANITIZE_OPTIONS);
};

/**
 * Sanitize a plain text string (strip all HTML)
 * @param {string} text - Raw text that may contain HTML
 * @returns {string} - Plain text with all HTML removed
 */
export const sanitizePlainText = (text) => {
  if (typeof text !== 'string') return '';
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
};

/**
 * Check if HTML contains dangerous patterns before sanitizing
 * @param {string} html - HTML to check
 * @returns {object} - { safe: boolean, threats: string[] }
 */
export const detectThreats = (html) => {
  if (typeof html !== 'string') return { safe: false, threats: ['Input is not a string'] };

  const threats = [];

  if (/<script/i.test(html)) threats.push('script tag detected');
  if (/javascript:/i.test(html)) threats.push('javascript: URL detected');
  if (/on\w+\s*=/i.test(html)) threats.push('event handler attribute detected');
  if (/<iframe/i.test(html)) threats.push('iframe tag detected');
  if (/<object/i.test(html)) threats.push('object tag detected');
  if (/<embed/i.test(html)) threats.push('embed tag detected');
  if (/data:text\/html/i.test(html)) threats.push('data:text/html URL detected');
  if (/<link[^>]*rel=["']?import/i.test(html)) threats.push('HTML import detected');

  return {
    safe: threats.length === 0,
    threats,
  };
};
