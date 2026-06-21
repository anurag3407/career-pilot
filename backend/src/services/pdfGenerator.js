import puppeteer from 'puppeteer';
import { marked } from 'marked';
import { generateStructuredData } from '../utils/structuredDataGenerator.js';
/**
 * Generate a PDF from markdown text using Puppeteer.
 * @param {string} markdownText - The resume markdown content.
 * @param {Object} options - Options like format ('A4' or 'Letter') and title.
 * @returns {Buffer} - The generated PDF buffer.
 */
export const generatePDF = async (markdownText, options = {}) => {
  const THEME_STYLES = {
  modern: {
    accentColor: '#6366f1',
    fontFamily: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    h1Style: 'text-align: center; font-size: 26px; color: #111;',
    h2Style: 'font-size: 13px; text-transform: uppercase; color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 4px; margin-top: 16px;',
    bodyColor: '#333',
    atsStrict: false,
  },
  corporate: {
    accentColor: '#1e3a5f',
    fontFamily: "Georgia, 'Times New Roman', serif",
    h1Style: 'text-align: center; font-size: 24px; color: #1e3a5f;',
    h2Style: 'font-size: 12px; text-transform: uppercase; background: #1e3a5f; color: #fff; padding: 3px 8px; margin-top: 16px;',
    bodyColor: '#222',
    atsStrict: false,
  },
  compact: {
    accentColor: '#000000',
    fontFamily: "Arial, Helvetica, sans-serif",
    h1Style: 'text-align: center; font-size: 20px; color: #000; letter-spacing: 1px;',
    h2Style: 'font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 2px; margin-top: 12px;',
    bodyColor: '#111',
    atsStrict: true,
  },
  creative: {
    accentColor: '#0891b2',
    fontFamily: "Poppins, 'Trebuchet MS', Arial, sans-serif",
    h1Style: 'text-align: center; font-size: 32px; color: #0891b2; font-weight: 900; letter-spacing: -1px;',
    h2Style: 'font-size: 13px; text-transform: uppercase; color: #0891b2; font-weight: 900; border-left: 4px solid #0891b2; padding-left: 8px; margin-top: 18px;',
    bodyColor: '#333',
    atsStrict: false,
  },
}

const { 
  format = 'A4', 
  title = 'Resume',
  theme = 'modern'
} = options;

const themeStyle = THEME_STYLES[theme] || THEME_STYLES.modern;

  // Convert markdown to HTML
  const htmlContent = marked.parse(markdownText);
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
  // Read full HTML structure with styles
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      ${jsonLdScript}
      <style>
        body {
          font-family: ${themeStyle.fontFamily};
          line-height: 1.5;
          color: ${themeStyle.bodyColor};
          margin: 0;
          padding: 0;
        }
        h1 {
          ${themeStyle.h1Style}
          margin-bottom: 8px;
        }
        h2 {
          ${themeStyle.h2Style}
          margin-bottom: 10px;
        }
        h3 {
          font-size: 12px;
          margin-top: 10px;
          margin-bottom: 4px;
          color: #000;
          display: flex;
          justify-content: space-between;
        }
        p {
          font-size: 11px;
          margin: 4px 0;
        }
        ul {
          margin: 4px 0 10px 0;
          padding-left: 20px;
        }
        li {
          font-size: 11px;
          margin-bottom: 4px;
        }
        a {
          color: ${themeStyle.accentColor};
          text-decoration: none;
        }
        strong {
          font-weight: 600;
          color: #000;
        }
        .contact-info {
          text-align: center;
          font-size: 10px;
          margin-bottom: 16px;
          color: #555;
        }
        .contact-info a {
          color: #555;
        }
        .resume-content {
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="resume-content">
        ${themeStyle.atsStrict ? `
          <div style="text-align:center; font-size:9px; color:#888; margin-bottom:8px;">
            ATS-Optimized Format — Single column, no graphics
          </div>` : ''}
        ${htmlContent}
      </div>
      <script>
        // Post-process the DOM to format the header and dates
        document.querySelectorAll('h3').forEach(el => {
          if (el.textContent.includes('|')) {
            const parts = el.textContent.split('|');
            el.innerHTML = '<span>' + parts[0].trim() + '</span><span style="color: #666; font-weight: normal;">' + parts.slice(1).join('|').trim() + '</span>';
          }
        });
        
        // Post-process contact info (usually the first paragraph after h1)
        const firstH1 = document.querySelector('.resume-content h1');
        if (firstH1) {
            let next = firstH1.nextElementSibling;
            while (next) {
                if (next.tagName === 'P') {
                    if (next.textContent.includes('|') || next.textContent.includes('@')) {
                        next.className = 'contact-info';
                    }
                    break;
                }
                next = next.nextElementSibling;
            }
        }
      </script>
    </body>
    </html>
  `;

  // Launch puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set content and wait for network idle to ensure styles load
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: format, // 'A4' or 'Letter'
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>', // Empty header
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
    await browser.close();
  }
};

/**
 * Render an arbitrary HTML string (e.g. one of the resume templates'
 * JSX output, server-rendered) to an ATS-safe multi-page A4 PDF using
 * Puppeteer. The text layer is preserved — selectable text in the PDF.
 *
 * @param {string} htmlBody - Already-rendered HTML body (no <html>/<head> wrapper needed)
 * @param {Object} options
 * @param {'A4'|'Letter'} [options.format='A4']
 * @param {string} [options.title='Resume']
 * @param {string} [options.css=''] - Optional additional CSS to inject into <head>
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

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};
