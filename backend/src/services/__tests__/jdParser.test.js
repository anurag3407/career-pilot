/**
 * Unit tests for the JD parser service.
 *
 * Run with:
 *   node --test src/services/__tests__/jdParser.test.js
 *
 * We mock `node-fetch` so no network is required.
 */

import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

import { parseJdFromUrl, parseJdFromText } from '../jdParser.service.js';

describe('parseJdFromText', () => {
  test('rejects too-short input', () => {
    assert.throws(() => parseJdFromText('short'), /too short/);
  });

  test('extracts role and company from "Role at Company" pattern', () => {
    const r = parseJdFromText('Senior Backend Engineer at Stripe\nWe are hiring a senior engineer...');
    assert.equal(r.role, 'Senior Backend Engineer');
    assert.equal(r.company, 'Stripe');
    assert.ok(r.jdText.length > 50);
  });

  test('falls back to first line as role when no "at" pattern', () => {
    const r = parseJdFromText('Staff iOS Engineer\nYou will work on the iOS app...');
    assert.equal(r.role, 'Staff iOS Engineer');
    assert.equal(r.company, '');
  });

  test('collapses whitespace and trims', () => {
    const r = parseJdFromText('Data Scientist\n\n\nWe are looking for a data scientist with strong SQL skills.');
    assert.ok(!r.jdText.includes('\n\n\n'));
  });

  test('truncates very long text to 8000 chars', () => {
    const longText = 'x'.repeat(20000);
    const r = parseJdFromText(longText);
    assert.ok(r.jdText.length <= 8000);
  });
});

// ---------------------------------------------------------------------------
// URL parsing — mock fetch
// ---------------------------------------------------------------------------

const ORIGINAL_FETCH = globalThis.fetch;

const mockHtml = (html) => () =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: { get: () => null },
    text: async () => html
  });

const setupFetch = (fn) => {
  globalThis.fetch = fn;
};

after(() => {
  globalThis.fetch = ORIGINAL_FETCH;
});

describe('parseJdFromUrl', () => {
  test('rejects invalid URL', async () => {
    await assert.rejects(() => parseJdFromUrl('not-a-url'), /Invalid URL/);
  });

  test('rejects non-http scheme', async () => {
    await assert.rejects(() => parseJdFromUrl('ftp://example.com'), /Only http/);
  });

  test('parses JD from .job-description container', async () => {
    setupFetch(
      mockHtml(`
        <html>
          <body>
            <nav>ignored nav</nav>
            <div class="job-description">
              Senior Engineer at Acme\nYou will lead backend systems.
              Must have 5+ years of experience with Python.
            </div>
          </body>
        </html>
      `)
    );
    const r = await parseJdFromUrl('https://example.com/jobs/1');
    assert.ok(r.jdText.includes('Senior Engineer'));
    assert.ok(r.jdText.includes('Python'));
    assert.ok(!r.jdText.includes('ignored nav'));
  });

  test('falls back to <main> when no JD container found', async () => {
    setupFetch(
      mockHtml(`
        <html>
          <body>
            <main>We need a frontend developer with React experience.</main>
          </body>
        </html>
      `)
    );
    const r = await parseJdFromUrl('https://example.com/x');
    assert.ok(r.jdText.includes('frontend developer'));
  });

  test('throws when page has no meaningful text', async () => {
    setupFetch(mockHtml('<html><body></body></html>'));
    await assert.rejects(
      () => parseJdFromUrl('https://example.com/x'),
      /Could not extract/
    );
  });
});
