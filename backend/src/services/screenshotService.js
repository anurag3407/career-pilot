import puppeteer from 'puppeteer';

async function generateScreenshot(htmlContent, viewport) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

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
    if (browser) {
      await browser.close();
    }
  }
}

export { generateScreenshot };