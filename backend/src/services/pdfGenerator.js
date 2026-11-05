import puppeteer from 'puppeteer';
import { marked } from 'marked';
import { generateStructuredData } from '../utils/structuredDataGenerator.js';

let sharedBrowserInstance = null;
let sharedBrowserPromise = null;

// Concurrency control for browser page generation
const MAX_CONCURRENT_RENDERS = parseInt(process.env.MAX_CONCURRENT_PDF_RENDERS, 10) || 3;
let activeRenders = 0;
const renderWaitQueue = [];

function acquireRenderSlot() {
  if (activeRenders < MAX_CONCURRENT_RENDERS) {
    activeRenders++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    renderWaitQueue.push(resolve);
  });
}

function releaseRenderSlot() {
  activeRenders--;
  if (renderWaitQueue.length > 0) {
    activeRenders++;
    const nextInQueue = renderWaitQueue.shift();
    nextInQueue();
  }
}

/**
 * Gets or initializes a shared Puppeteer browser instance.
 * Automatically handles browser restarts on crashes or disconnections.
 */
export async function getSharedBrowser() {
  if (sharedBrowserInstance && sharedBrowserInstance.isConnected()) {
    return sharedBrowserInstance;
  }

  if (!sharedBrowserPromise) {
    sharedBrowserPromise = puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
      ],
    }).then((browser) => {
      sharedBrowserInstance = browser;
      browser.once('disconnected', () => {
        sharedBrowserInstance = null;
        sharedBrowserPromise = null;
      });
      return browser;
    }).catch((err) => {
      sharedBrowserPromise = null;
      throw err;
    });
  }

  return sharedBrowserPromise;
}

/**
 * Closes the shared browser instance on graceful shutdown.
 */
export async function closeSharedBrowser() {
  if (sharedBrowserInstance) {
    try {
      await sharedBrowserInstance.close();
    } catch {
      // Ignore cleanup error
    } finally {
      sharedBrowserInstance = null;
      sharedBrowserPromise = null;
    }
  }
}

/**
 * Generate a PDF from markdown text using Puppeteer with browser pooling and concurrency bounds.
 * @param {string} markdownText - The resume markdown content.
 * @param {Object} options - Options like format ('A4' or 'Letter') and title.
 * @returns {Promise<Buffer>} - The generated PDF buffer.
 */
export const generatePDF = async (markdownText, options = {}) => {
  const { 
    format = 'A4', 
    title = 'Resume',
    themeColor = '#2563eb' 
  } = options;

  // Convert markdown to HTML
  const htmlContent = marked.parse(markdownText || '');
  const jsonLdScript =
    options.portfolio && Object.keys(options.portfolio).length > 0
      ? (() => {
          const structuredData = generateStructuredData(options.portfolio);
          const jsonLd = JSON.stringify(structuredData, null, 2).replace(
            /<\/script>/gi,
            '<\\/script>'
          );
          return `<script type="application/ld+json">\n${jsonLd}\n</script>`;
        })()
      : '';

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      ${jsonLdScript}
      <style>
        :root {
          --theme-color: ${themeColor};
        }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          line-height: 1.5;
          color: #333;
          margin: 0;
          padding: 0;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #000;
          text-align: center;
        }
        h2 {
          font-size: 14px;
          text-transform: uppercase;
          color: var(--theme-color);
          border-bottom: 1px solid #ccc;
          padding-bottom: 4px;
          margin-top: 16px;
        }
        p, li {
          font-size: 11px;
        }
        ul {
          padding-left: 20px;
          margin: 4px 0;
        }
        .resume-container {
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        ${htmlContent}
      </div>
    </body>
    </html>
  `;

  await acquireRenderSlot();
  let page = null;
  try {
    const browser = await getSharedBrowser();
    page = await browser.newPage();
    
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: format,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width: 100%; font-size: 8px; text-align: center; color: #888; padding-bottom: 10px;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '1.5cm',
        bottom: '1.5cm',
        left: '1.5cm',
        right: '1.5cm'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    releaseRenderSlot();
  }
};

/**
 * Render an arbitrary HTML string to an ATS-safe multi-page A4 PDF using
 * the pooled Puppeteer browser.
 *
 * @param {string} htmlBody
 * @param {Object} options
 * @returns {Promise<Buffer>}
 */
export const generatePDFFromHTML = async (htmlBody, options = {}) => {
  const { format = 'A4', title = 'Resume', css = '' } = options;

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { size: ${format}; margin: 0; }
    html, body { margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; }
    ${css}
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;

  await acquireRenderSlot();
  let page = null;
  try {
    const browser = await getSharedBrowser();
    page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    releaseRenderSlot();
  }
};

export default {
  generatePDF,
  generatePDFFromHTML,
  getSharedBrowser,
  closeSharedBrowser,
};
