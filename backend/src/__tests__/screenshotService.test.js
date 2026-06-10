import { describe, test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { generateScreenshot, closeBrowser } from '../services/screenshotService.js';

const MOCK_HTML = '<html><body>Test</body></html>';
const VIEWPORT = { width: 800, height: 600 };

describe('Screenshot Service', () => {
  let launchCallCount = 0;
  let mockBrowserCloseCount = 0;
  let isBrowserConnected = true;

  const mockPage = {
    setViewport: mock.fn(async () => {}),
    setContent: mock.fn(async () => {}),
    screenshot: mock.fn(async () => Buffer.from('mock-screenshot')),
    close: mock.fn(async () => {}),
  };

  const mockBrowser = {
    isConnected: mock.fn(() => isBrowserConnected),
    newPage: mock.fn(async () => mockPage),
    close: mock.fn(async () => {
      mockBrowserCloseCount++;
    }),
  };

  beforeEach(async () => {
    // Reset call counts and state
    launchCallCount = 0;
    mockBrowserCloseCount = 0;
    isBrowserConnected = true;
    mock.restoreAll();
    
    // Setup puppeteer.launch mock
    mock.method(puppeteer, 'launch', async () => {
      launchCallCount++;
      return mockBrowser;
    });

    // Make sure singleton state in the service is clean before test
    await closeBrowser();
  });

  afterEach(async () => {
    await closeBrowser();
    mock.restoreAll();
  });

  test('should launch browser and generate screenshot on first call', async () => {
    const buffer = await generateScreenshot(MOCK_HTML, VIEWPORT);
    
    assert.equal(launchCallCount, 1);
    assert.deepEqual(buffer, Buffer.from('mock-screenshot'));
  });

  test('should reuse browser instance on subsequent calls (singleton pattern)', async () => {
    await generateScreenshot(MOCK_HTML, VIEWPORT);
    const buffer2 = await generateScreenshot(MOCK_HTML, VIEWPORT);
    
    assert.equal(launchCallCount, 1, 'puppeteer.launch should only be called once');
    assert.deepEqual(buffer2, Buffer.from('mock-screenshot'));
  });

  test('should handle concurrent screenshot requests with exactly one browser launch', async () => {
    const results = await Promise.all([
      generateScreenshot(MOCK_HTML, VIEWPORT),
      generateScreenshot(MOCK_HTML, VIEWPORT),
      generateScreenshot(MOCK_HTML, VIEWPORT),
    ]);

    assert.equal(launchCallCount, 1, 'puppeteer.launch should be called exactly once for concurrent requests');
    assert.equal(results.length, 3);
    for (const res of results) {
      assert.deepEqual(res, Buffer.from('mock-screenshot'));
    }
  });

  test('should recover and spawn a new browser instance if closed', async () => {
    await generateScreenshot(MOCK_HTML, VIEWPORT);
    assert.equal(launchCallCount, 1);

    await closeBrowser();
    assert.equal(mockBrowserCloseCount, 1);

    const buffer = await generateScreenshot(MOCK_HTML, VIEWPORT);
    assert.equal(launchCallCount, 2, 'should spawn a new browser instance after closeBrowser');
    assert.deepEqual(buffer, Buffer.from('mock-screenshot'));
  });

  test('should handle browser disconnect and launch a new instance', async () => {
    await generateScreenshot(MOCK_HTML, VIEWPORT);
    assert.equal(launchCallCount, 1);

    // Simulate browser disconnection
    isBrowserConnected = false;

    const buffer = await generateScreenshot(MOCK_HTML, VIEWPORT);
    assert.equal(launchCallCount, 2, 'should launch a new browser since the first was disconnected');
    assert.deepEqual(buffer, Buffer.from('mock-screenshot'));
  });

  test('should propagate errors and reset browser promise if launch fails', async () => {
    // Override launch to fail for one call
    mock.restoreAll();
    let failedLaunchCount = 0;
    mock.method(puppeteer, 'launch', async () => {
      failedLaunchCount++;
      throw new Error('Launch failed');
    });

    await assert.rejects(
      async () => {
        await generateScreenshot(MOCK_HTML, VIEWPORT);
      },
      { message: 'Launch failed' }
    );
    assert.equal(failedLaunchCount, 1);

    // Restore working mock
    mock.restoreAll();
    mock.method(puppeteer, 'launch', async () => {
      launchCallCount++;
      return mockBrowser;
    });

    // Next call should succeed by attempting launch again
    const buffer = await generateScreenshot(MOCK_HTML, VIEWPORT);
    assert.equal(launchCallCount, 1);
    assert.deepEqual(buffer, Buffer.from('mock-screenshot'));
  });

  test('should close page even if screenshot generation fails', async () => {
    mockPage.screenshot = mock.fn(async () => {
      throw new Error('Screenshot capture failed');
    });

    await assert.rejects(
      async () => {
        await generateScreenshot(MOCK_HTML, VIEWPORT);
      },
      { message: 'Screenshot capture failed' }
    );

    // Page close should still have been called
    assert.ok(mockPage.close.mock.calls.length > 0, 'page.close should have been called in finally block');
  });
});
