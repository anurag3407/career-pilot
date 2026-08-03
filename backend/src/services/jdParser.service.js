import * as cheerio from 'cheerio';

// node-fetch is referenced via globalThis.fetch so tests can override it.
// We resolve at call time so swapping globalThis.fetch after import works.
const getFetch = () => globalThis.fetch || (async () => {
  throw new Error('No fetch implementation available');
});

/**
 * JD Parser — fetches a job description from a URL or cleans pasted text and
 * extracts structured fields for downstream question generation.
 *
 * Strategy:
 *   1. URL: fetch the page, strip <script>/<style>/<nav>/<footer>, prefer
 *      common JD containers (.job-description, [itemprop="description"], etc.),
 *      fall back to <main> or <body>.
 *   2. Text: trim whitespace, drop lines that are just punctuation / too short.
 *
 * The parser is intentionally lenient — if it can't detect a clean container
 * it returns as much text as possible. The LLM downstream handles the rest.
 */

const MAX_TEXT_LENGTH = 8000;

const cleanWhitespace = (text) =>
  String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/**
 * Best-effort extraction of <title>, role hint, and company hint from the
 * page. Heuristic only — never trusted blindly downstream.
 */
const extractMetadata = ($, fullText) => {
  const title = $('title').first().text().trim()
    || $('meta[property="og:title"]').attr('content')
    || $('meta[name="twitter:title"]').attr('content')
    || '';

  // Look for "Company: X" or "at X" patterns in title
  const atMatch = title.match(/(?:at|@|with)\s+([A-Z][\w& .'-]{1,40})/);
  let company = atMatch ? atMatch[1].trim() : '';

  // Try meta tag
  if (!company) {
    const ogSite = $('meta[property="og:site_name"]').attr('content');
    if (ogSite) company = ogSite.trim();
  }

  // Role = strip the company segment from the title
  let role = title;
  if (company && role.toLowerCase().includes(company.toLowerCase())) {
    role = role.replace(new RegExp(`(?:at|@|with)\\s+${company}`, 'i'), '').trim();
  }
  role = role.replace(/\s*[|\-–—:]\s*$/, '').trim();

  return { role, company, title };
};

const extractJdText = ($, url) => {
  // Strip noise
  $('script, style, noscript, iframe, nav, footer, header, aside, form, button, [aria-hidden="true"]').remove();

  // Try common JD containers in order
  const containerSelectors = [
    '[itemprop="description"]',
    '.job-description',
    '.jobDescription',
    '.job-description-content',
    '.description',
    '#job-description',
    '[data-testid="job-description"]',
    '[class*="jobDescription" i]',
    '[class*="job-description" i]',
    '[class*="description" i]',
    'article',
    'main',
    '[role="main"]',
    'body'
  ];

  for (const sel of containerSelectors) {
    const el = $(sel).first();
    if (el.length) {
      const text = cleanWhitespace(el.text());
      if (text.length > 200) {
        return text;
      }
    }
  }

  return cleanWhitespace($('body').text());
};

/**
 * Fetch a URL and extract job description text.
 * Returns: { role, company, jdText, sourceUrl }
 */
export const parseJdFromUrl = async (url) => {
  if (!url) throw new Error('URL is required');

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('Only http(s) URLs are supported');
  }

  const fetchImpl = getFetch();
  const response = await fetchImpl(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (CareerPilot JD parser; +https://careerpilot.app)',
      'Accept': 'text/html,application/xhtml+xml'
    },
    redirect: 'follow',
    timeout: 10000
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const jdText = extractJdText($).substring(0, MAX_TEXT_LENGTH);
  const meta = extractMetadata($, jdText);

  if (!jdText || jdText.length < 50) {
    throw new Error('Could not extract meaningful text from the URL');
  }

  return {
    role: meta.role || '',
    company: meta.company || '',
    title: meta.title || '',
    jdText,
    sourceUrl: url
  };
};

/**
 * Clean and structure pasted JD text.
 * Returns: { role, company, jdText, sourceUrl: '' }
 */
export const parseJdFromText = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text is required');
  }
  const trimmed = text.trim();
  if (trimmed.length < 30) {
    throw new Error('Job description text is too short (minimum 30 characters)');
  }

  // Heuristic: first non-empty line is often a title
  const lines = trimmed.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';

  // Try "Role at Company" pattern
  const atMatch = firstLine.match(/^(.+?)\s+(?:at|@|with)\s+([A-Z][\w& .'-]{1,40})$/);
  let role = '';
  let company = '';
  if (atMatch) {
    role = atMatch[1].trim();
    company = atMatch[2].trim();
  } else {
    role = firstLine.substring(0, 120);
  }

  return {
    role,
    company,
    title: firstLine,
    jdText: cleanWhitespace(trimmed).substring(0, MAX_TEXT_LENGTH),
    sourceUrl: ''
  };
};
