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
 * Isolation:
 *   The generator looks at `process.env.PORTFOLIO_DIST_DIR` first, so the
 *   test points it at a per-process temp directory under `os.tmpdir()`. That
 *   keeps the test off the real `frontend/dist-portfolio/standalone.html`
 *   build artifact — no shared global state, no race with parallel test
 *   runs or a running dev server, no risk of leaving the developer's real
 *   shell file in a half-overwritten state if the run aborts.
 *
 * Run:
 *   node --test src/services/deploy/__tests__/portfolioHtmlGenerator.test.js
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Sandbox the generator into a per-process temp dir so it never touches the
// real `frontend/dist-portfolio/standalone.html` build artifact. Must be set
// *before* importing the generator, because the module captures DIST_DIR at
// import time.
const TMP_DIST_DIR = await fs.mkdtemp(
  path.join(os.tmpdir(), 'portfolio-html-gen-test-')
);
process.env.PORTFOLIO_DIST_DIR = TMP_DIST_DIR;

const { buildPortfolioBundle } = await import('../portfolioHtmlGenerator.js');

const SHELL = path.join(TMP_DIST_DIR, 'standalone.html');

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

before(async () => {
  await fs.writeFile(SHELL, MIN_SHELL, 'utf-8');
});

after(async () => {
  // Always wipe the entire temp dir. We created it, so we own it — no need
  // to restore anything, and nothing leaks back into the repo.
  await fs.rm(TMP_DIST_DIR, { recursive: true, force: true });
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

  test('</SCRIPT> with non-lowercase casing round-trips unchanged', async () => {
    // The `</script` escaper uses a capture group so the original casing is
    // preserved. Without it, `JSON.parse(...)` would reconstruct `</SCRIPT>`
    // as `</script>`, silently mangling the user's data.
    const payload = 'see </SCRIPT> and </Script> tags';
    const malicious = { notes: payload };

    const { window } = await buildAndExecute(malicious, 'default');

    assert.equal(window.__PORTFOLIO_DATA__.notes, payload,
      'Casing of </script>-like substrings was not preserved on round-trip');
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

  test('$-tokens in user data are inserted literally, not expanded by String.replace', async () => {
    // `String.prototype.replace` with a string replacement expands `$&`,
    // `` $` ``, `$'`, `$$` and `$n` against the regex match. If the
    // replacement is built from user data, that turns into a data-integrity
    // bug (and, for the script-tag injection path, an escape-bypass:
    // `$&` would re-emit the placeholder block — which contains `</script>`
    // — unescaped into the JSON literal). All three call sites use a
    // replacer function to defeat this.
    const sections = {
      hero: {
        // `$&` would otherwise be replaced by the entire `<title>...</title>`
        // match; `$$` would collapse to a single `$`.
        subtitle: 'Dollar $& and $$ and $`',
        title: "trailing $' here"
      },
      // Inside the JSON-string injection, `$&` would re-insert the
      // placeholder block (containing `</script>`), corrupting the JSON.
      projects: [{ name: 'price was $5 and ends with $&' }]
    };

    const { html, window } = await buildAndExecute(sections, 'default');

    // Exactly one <script> — the placeholder block was not reconstituted
    // into the JSON literal via `$&` expansion.
    const scripts = [...window.document.querySelectorAll('script')];
    assert.equal(scripts.length, 1,
      `Expected exactly 1 <script>, found ${scripts.length}.\n${html}`);

    // Data round-trips verbatim.
    assert.equal(window.__PORTFOLIO_DATA__.projects[0].name,
      sections.projects[0].name,
      'User data containing $-tokens did not round-trip literally');

    // Title interpolation inserts the escaped user values literally —
    // `$&`, `$$`, `` $` ``, `$'` are not expanded.
    assert.equal(
      window.document.title,
      `${sections.hero.subtitle} — ${sections.hero.title}`,
      '$-tokens in hero fields were expanded by String.replace'
    );
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
