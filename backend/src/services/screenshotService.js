import puppeteer from 'puppeteer';

let browser = null;
let browserPromise = null;

/**
 * Gets or initializes the shared Puppeteer browser instance.
 * Handles concurrent initialization requests without double-spawning processes
 * and automatically recovers if the browser crashes or gets disconnected.
 */
async function getBrowserInstance() {
  // If the browser is active and connected, return it
  if (browser && browser.isConnected()) {
    return browser;
  }

  // If a browser is currently launching, wait for it
  if (browserPromise) {
    try {
      browser = await browserPromise;
      if (browser.isConnected()) {
        return browser;
      }
    } catch (err) {
      // Launch failed or browser disconnected, reset promise
      browserPromise = null;
    }
  }

  // Start a new browser launch
  console.log('[ScreenshotService] Spawning new Puppeteer browser instance...');
  browserPromise = puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    browser = await browserPromise;
    return browser;
  } catch (error) {
    // Reset in case of failure to allow subsequent retries
    browserPromise = null;
    browser = null;
    throw error;
  }
}

/**
 * Generates a screenshot from HTML content, reusing a shared browser instance.
 * Automatically handles page opening, lifecycle, and clean closure to prevent memory leaks.
 */
async function generateScreenshot(htmlContent, viewport) {
  let page;

  try {
    const browserInstance = await getBrowserInstance();
    page = await browserInstance.newPage();

    await page.setViewport(viewport);

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const screenshotBuffer = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    return screenshotBuffer;
  } catch (error) {
    console.error("Screenshot generation failed:", error);
    throw error;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (err) {
        console.error("Failed to close Puppeteer page gracefully:", err);
      }
    }
  }
}

/**
 * Closes the shared browser instance.
 * Useful for test suites and clean server shutdowns.
 */
async function closeBrowser() {
  if (browserPromise) {
    try {
      const b = await browserPromise;
      await b.close();
    } catch (error) {
      console.error("Failed to close shared browser gracefully:", error);
    } finally {
      browser = null;
      browserPromise = null;
    }
  }
}

export { generateScreenshot, closeBrowser };