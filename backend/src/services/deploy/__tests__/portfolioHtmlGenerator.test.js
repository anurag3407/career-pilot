/**
 * Tests for backend/src/services/deploy/portfolioHtmlGenerator.js
 *
 * Focus: CWE-79 stored XSS via unsanitized portfolio data injected into
 * the deployed standalone HTML.
 *
 * The vulnerability (before the fix):
 *   - `buildPortfolioBundle(sections, templateId)` serialized user-controlled
 *     `sections` with `JSON.stringify(...)` and embedded the raw JSON string
 *     into an inline `<script>` tag *without* escaping. A literal `</script>`
 *     anywhere in the user data terminates the surrounding inline-script
 *     element in the HTML parser and lets an attacker open a fresh,
 *     attacker-controlled `<script>` block.
 *   - The page `<title>` was built from `sections.hero.subtitle` / `.title`
 *     and interpolated into HTML without escaping, allowing the same
 *     `</title>` + `<script>` breakout vector.
 *
 * This file drives the real `buildPortfolioBundle` against a temporary
 * dist-portfolio shell, then parses the result with `jsdom` (a real HTML
 * parser) and asserts that:
 *   1. Exactly one <script> element is present (no attacker-introduced
 *      siblings from parser-level breakout).
 *   2. The single legitimate <script>'s body, when actually executed,
 *      assigns `window.__PORTFOLIO_DATA__` to a JSON.parse'd copy of the
 *      original sections — and does NOT set any attacker-controlled global.
 *
 * Run:
 *   node --test src/services/deploy/__tests__/portfolioHtmlGenerator.test.js
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

import { buildPortfolioBundle } from '../portfolioHtmlGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Mirror DIST_DIR from portfolioHtmlGenerator.js (../../../../frontend/dist-portfolio)
const DIST_DIR = path.resolve(__dirname, '../../../../../frontend/dist-portfolio');
const SHELL    = path.join(DIST_DIR, 'standalone.html');

const MIN_SHELL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>placeholder</title>
  <!-- PORTFOLIO_DATA_INJECTION -->
  <script>
    window.__PORTFOLIO_DATA__ = null;
    window.__TEMPLATE_ID__ = "default";
  </script>
  <!-- END_PORTFOLIO_DATA_INJECTION -->
</head>
<body><div id="root"></div></body>
</html>`;

/**
 * Build the bundle and return the parsed DOM the way a real browser sees it,
 * with the inline scripts actually executed. This is the closest reproduction
 * of the real-world deployment context.
 */
async function buildAndExecute(sections, templateId = 'default') {
  const { html } = await buildPortfolioBundle(sections, templateId);
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  return { html, dom, window: dom.window };
}

let originalShell = null;

before(async () => {
  try {
    originalShell = await fs.readFile(SHELL, 'utf-8');
  } catch {
    originalShell = null;
  }
  await fs.mkdir(DIST_DIR, { recursive: true });
  await fs.writeFile(SHELL, MIN_SHELL, 'utf-8');
});

after(async () => {
  if (originalShell !== null) {
    await fs.writeFile(SHELL, originalShell, 'utf-8');
  }
});

describe('buildPortfolioBundle — XSS hardening (CWE-79)', () => {
  test('section data with </script> cannot inject a new <script> element', async () => {
    const payload = '</script><script id="pwned-data">window.__pwned=true;//';
    const malicious = {
      hero: { subtitle: 'Alice', title: 'Engineer' },
      projects: [{ name: payload }]
    };

    const { html, window } = await buildAndExecute(malicious, 'default');

    // 1. Parser must see exactly one <script> — the legitimate injection.
    //    Pre-fix, the HTML parser would split on `</script>` and add at
    //    least one extra attacker-controlled <script> element.
    const scripts = [...window.document.querySelectorAll('script')];
    assert.equal(
      scripts.length, 1,
      `Expected exactly 1 <script> element, found ${scripts.length}.\n` +
      `Generated HTML:\n${html}`
    );
    assert.equal(scripts[0].id, '',
      `Legitimate injected <script> should not have an attacker-controlled id.`);

    // 2. The attacker payload must NOT have executed.
    assert.equal(window.__pwned, undefined,
      'Attacker JS executed via parser-level <script> breakout');

    // 3. The original (literal) payload should be available as data, intact.
    assert.equal(window.__PORTFOLIO_DATA__.projects[0].name, payload,
      'Round-trip of attacker payload as literal data failed');
  });

  test('hero fields with </title> cannot inject via <title> breakout', async () => {
    const payload =
      'Evil</title><script id="title-pwned">window.__titlePwned=true;</script>';
    const malicious = { hero: { subtitle: payload, title: 'X' } };

    const { html, window } = await buildAndExecute(malicious, 'default');

    // <title> must contain the attacker payload as literal text.
    assert.equal(window.document.title, `${payload} — X`,
      `Expected escaped title, got: ${window.document.title}`);

    // No attacker-controlled script should have run.
    assert.equal(window.__titlePwned, undefined,
      'Attacker JS executed via <title> breakout');

    // And no second script element should exist.
    const scripts = [...window.document.querySelectorAll('script')];
    assert.equal(scripts.length, 1,
      `Expected exactly 1 <script>, found ${scripts.length}.\n${html}`);
  });

  test('U+2028 line separator cannot terminate the inline JS string literal', async () => {
    // In classic script context (which is what an inline <script> tag uses),
    // U+2028 and U+2029 end string literals even though they are legal inside
    // JSON. A safe escaper must neutralize them so the inline `JSON.parse(...)`
    // call still parses.
    const malicious = { notes: 'a\u2028;window.__lsPwned=true;//' };

    const { html, window } = await buildAndExecute(malicious, 'default');

    assert.equal(window.__lsPwned, undefined,
      'Attacker JS executed via U+2028 line-separator breakout');
    assert.equal(window.__PORTFOLIO_DATA__.notes, malicious.notes,
      'U+2028 payload did not round-trip through inline JSON.parse');
    // Raw line separator must not appear in the inline script source.
    assert.equal(html.includes('\u2028'), false,
      'Raw U+2028 leaked into the generated HTML unescaped');
  });

  test('templateId is escaped against single-quote breakout', async () => {
    const { window } = await buildAndExecute(
      { hero: { subtitle: 'A', title: 'B' } },
      "'; window.__tplPwned=true; //"
    );
    assert.equal(window.__tplPwned, undefined,
      'Attacker JS executed via templateId breakout');
  });

  test('happy path: legitimate portfolio data round-trips through JSON.parse', async () => {
    const sections = {
      hero: { subtitle: 'Ada Lovelace', title: 'Engineer', tagline: 'Hi' },
      projects: [{ name: 'Analytical Engine', url: 'https://example.com/' }]
    };

    const { html, window } = await buildAndExecute(sections, 'Cherry_Blossom');

    assert.ok(html.includes('window.__PORTFOLIO_DATA__'));
    assert.ok(html.includes('window.__TEMPLATE_ID__'));
    assert.equal(JSON.stringify(window.__PORTFOLIO_DATA__), JSON.stringify(sections));
    assert.equal(window.__TEMPLATE_ID__, 'Cherry_Blossom');
    assert.equal(window.document.title, 'Ada Lovelace — Engineer');
  });
});
