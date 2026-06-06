// backend/services/aiEngine/parseResume.js
// Parses a PDF resume stored in Firebase Storage and returns raw text.

const fetch = require('node-fetch');
const pdf = require('pdf-parse');

/**
 * Downloads the PDF from a public URL (Firebase Storage URL) and extracts text.
 * @param {string} pdfUrl - URL to the PDF file.
 * @returns {Promise<string>} extracted raw text.
 */
async function parseResume(pdfUrl) {
  // Download PDF bytes
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.statusText}`);
  }
  const buffer = await response.buffer();

  // Use pdf-parse to extract text
  const data = await pdf(buffer);
  return data.text;
}

module.exports = { parseResume };
