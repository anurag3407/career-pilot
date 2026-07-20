/**
 * Builds a deployable portfolio bundle from the pre-built standalone React app.
 *
 * Instead of generating generic static HTML, this reads the pre-built React app
 * (built via `npm run build:portfolio` in the frontend) and injects the user's
 * portfolio data and chosen template ID. The result is a complete React SPA that
 * renders the EXACT same template the user previewed — with all animations,
 * icons, and styling preserved.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the pre-built standalone portfolio app.
// Tests can override the dist directory via PORTFOLIO_DIST_DIR so they don't
// have to mutate the real build artifact (which would be shared global state
// racing with parallel test runs and a running dev server).
const DIST_DIR = process.env.PORTFOLIO_DIST_DIR
  || path.resolve(__dirname, '../../../../frontend/dist-portfolio');

/**
 * Escape a string for safe embedding inside a `<script>` tag *as the contents
 * of a single-quoted JS string literal*. Defends against:
 *   - `</script>` HTML-parser breakouts (CWE-79)
 *   - `<!--` HTML comment confusion
 *   - U+2028 / U+2029 line terminators, which end string literals in classic
 *     script context even though they are valid JSON
 *   - Backslash / single-quote escaping of the literal itself
 *
 * Intended to wrap a `JSON.stringify(...)` payload that will be parsed back
 * out at runtime via `JSON.parse('...')`.
 */
function escapeForScript(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    // Capture the matched `/script` so the original casing (`</SCRIPT>`,
    // `</Script>`, ...) round-trips through `JSON.parse(...)` unchanged.
    .replace(/<(\/script)/gi, '<\\$1')
    .replace(/<!--/g, '<\\!--')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Escape a string for safe embedding in HTML text / attribute context.
 * Used for the page <title>, which is interpolated into the HTML shell.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build a deployable portfolio bundle.
 *
 * @param {Object} sections    - Portfolio data (hero, about, skills, projects, experience, contact)
 * @param {string} templateId  - Template ID (e.g. 'Cherry_Blossom', 'Swiss_Typography')
 * @returns {Promise<{ html: string, assets: Record<string, Buffer|string> }>}
 */
export async function buildPortfolioBundle(sections, templateId = 'default') {
  // Read the pre-built HTML shell
  let html;
  try {
    html = await fs.readFile(path.join(DIST_DIR, 'standalone.html'), 'utf-8');
  } catch (err) {
    throw new Error(
      `Pre-built portfolio app not found at ${DIST_DIR}. ` +
      `Run "npm run build:portfolio" in the frontend directory first. ` +
      `Original error: ${err.message}`
    );
  }

  // Inject portfolio data and template ID into the HTML.
  //
  // Security: the JSON payload is wrapped in a JS string literal and parsed
  // back out at runtime via `JSON.parse(...)`. This means every character of
  // the user-controlled data passes through `escapeForScript`, so attacker
  // input cannot break out of the inline `<script>` tag (CWE-79). Embedding
  // `JSON.stringify(...)` directly into the script body would let any string
  // containing `</script>` terminate the surrounding script context.
  const dataJson = JSON.stringify(sections || {});
  const injection = `<script>
      window.__PORTFOLIO_DATA__ = JSON.parse('${escapeForScript(dataJson)}');
      window.__TEMPLATE_ID__ = '${escapeForScript(String(templateId))}';
    </script>`;

  // Replace the placeholder injection block. We pass a *function* as the
  // replacement so `String.prototype.replace` inserts `injection` verbatim —
  // otherwise `$&`, `` $` ``, `$'`, `$$` and `$n` sequences inside the
  // escaped JSON would be expanded against the regex match, re-emitting the
  // unescaped placeholder block (which itself contains `</script>`) into
  // the JSON literal and breaking the very escaping we just performed.
  html = html.replace(
    /<!-- PORTFOLIO_DATA_INJECTION -->[\s\S]*?<!-- END_PORTFOLIO_DATA_INJECTION -->/,
    () => injection
  );

  // If no placeholder found, inject before </head>. Same `$`-expansion
  // concern as above — use a function so the script body is inserted literally.
  if (!html.includes('__PORTFOLIO_DATA__')) {
    html = html.replace('</head>', () => `${injection}\n</head>`);
  }

  // Update page title. Both fields are user-controlled, so they must be
  // HTML-escaped before being interpolated into the HTML shell. We again use
  // a replacer function so any `$`-tokens in `name`/`title` (which
  // `escapeHtml` does not neutralize) are inserted literally rather than
  // expanded against the regex match.
  const name = sections?.hero?.subtitle || 'Portfolio';
  const title = sections?.hero?.title || '';
  html = html.replace(
    /<title>.*?<\/title>/,
    () => `<title>${escapeHtml(name)} — ${escapeHtml(title)}</title>`
  );

  // Read all asset files (JS, CSS, etc.)
  const assets = {};
  try {
    const assetsDir = path.join(DIST_DIR, 'assets');
    const assetFiles = await fs.readdir(assetsDir);

    for (const file of assetFiles) {
      const filePath = path.join(assetsDir, file);
      const content = await fs.readFile(filePath);
      assets[`assets/${file}`] = content;
    }
  } catch (err) {
    console.warn('Warning: Could not read assets directory:', err.message);
  }

  return { html, assets };
}

/**
 * Legacy function for backwards compatibility.
 * Delegates to buildPortfolioBundle and returns just the HTML.
 */
export function generatePortfolioHtml(data, templateId = 'default') {
  // This is now a sync fallback that generates basic HTML
  // The async buildPortfolioBundle should be used instead
  const hero = data.hero || {};
  const name = hero.subtitle || 'Portfolio';
  const title = hero.title || '';
  const tagline = hero.tagline || '';

  const esc = (s) => String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(name)} — ${esc(title)}</title>
  <meta name="description" content="${esc(tagline)}">
  <style>
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #0a0a0f;
      color: #e4e4e7;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      margin: 0;
    }
    h1 { font-size: 3rem; font-weight: 900; }
    p { opacity: 0.7; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <div>
    <h1>${esc(name)}</h1>
    <p>${esc(title)}</p>
  </div>
</body>
</html>`;

  return { html };
}
