import puppeteer from 'puppeteer';
import { marked } from 'marked';

/**
 * Generate a PDF from markdown text using Puppeteer.
 * @param {string} markdownText - The resume markdown content.
 * @param {Object} options - Options like format ('A4' or 'Letter') and title.
 * @returns {Buffer} - The generated PDF buffer.
 */
export const generatePDF = async (markdownText, options = {}) => {
  const { 
    format = 'A4', 
    title = 'Resume',
    themeColor = '#2563eb' 
  } = options;

  // Convert markdown to HTML
  const htmlContent = marked.parse(markdownText);

  // Read full HTML structure with styles
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
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
        /* Typography */
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
          color: var(--theme-color);
          text-decoration: none;
        }
        strong {
          font-weight: 600;
          color: #000;
        }
        /* Contact info styling */
        .contact-info {
          text-align: center;
          font-size: 10px;
          margin-bottom: 16px;
          color: #555;
        }
        .contact-info a {
          color: #555;
        }
        
        /* Layout */
        .resume-content {
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="resume-content">
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
        const content = document.querySelector('.resume-content');
        if (content.children.length > 1) {
            const possibleContact = content.children[1];
            if (possibleContact.tagName === 'P' && (possibleContact.textContent.includes('|') || possibleContact.textContent.includes('@'))) {
                possibleContact.className = 'contact-info';
            }
        }
      </script>
    </body>
    </html>
  `;

  // Launch puppeteer
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode
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
