import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getSharedBrowser, closeSharedBrowser } from '../pdfGenerator.js';

describe('PDF Generator & Browser Pool', () => {
  test('getSharedBrowser returns a singleton browser instance when puppeteer is available', async () => {
    let b1, b2;
    try {
      b1 = await getSharedBrowser();
      b2 = await getSharedBrowser();
      assert.equal(b1, b2);
      assert.equal(typeof b1.newPage, 'function');
    } catch (err) {
      // In minimal test containers without chromium, verify error is clean
      assert.ok(err.message.includes('Could not find Chrome') || err.message.includes('sandbox'));
    } finally {
      await closeSharedBrowser();
    }
  });

  test('closeSharedBrowser cleans up gracefully without errors', async () => {
    await assert.doesNotReject(async () => {
      await closeSharedBrowser();
      await closeSharedBrowser();
    });
  });
});
