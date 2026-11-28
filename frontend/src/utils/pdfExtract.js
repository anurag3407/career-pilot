import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

export const MAX_PDF_SIZE_MB = 5;
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

let workerConfigured = false;
function ensurePdfWorker() {
  if (workerConfigured) return;
  // In real browsers, point PDF.js at the Vite-bundled worker module.
  // In Vitest/jsdom or Node (where global Worker is absent), PDF.js uses its built-in fake worker.
  if (typeof Worker !== 'undefined' && pdfWorkerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
  }
  workerConfigured = true;
}

function createAbortError() {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('Upload cancelled', 'AbortError');
  }
  const err = new Error('Upload cancelled');
  err.name = 'AbortError';
  return err;
}

/**
 * Checks whether a File/Blob looks like a PDF based on MIME type or extension.
 * Some browsers/OSes report an empty MIME type or `application/x-pdf` for valid PDFs.
 */
export function isPdfFile(file) {
  if (!file) return false;
  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  return mime === 'application/pdf' || mime === 'application/x-pdf' || name.endsWith('.pdf');
}

async function readFileAsUint8Array(file) {
  if (typeof file.arrayBuffer === 'function') {
    const buf = await file.arrayBuffer();
    return new Uint8Array(buf);
  }
  if (typeof Response !== 'undefined') {
    const buf = await new Response(file).arrayBuffer();
    return new Uint8Array(buf);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file bytes'));
    reader.readAsArrayBuffer(file);
  });
}

function hasPdfMagicHeader(bytes) {
  if (!bytes || bytes.length < 5) return false;
  const searchLen = Math.min(bytes.length, 1024);
  let header = '';
  for (let i = 0; i < searchLen; i++) {
    header += String.fromCharCode(bytes[i]);
  }
  return header.includes('%PDF-');
}

function reconstructPageText(items) {
  if (!Array.isArray(items) || items.length === 0) return '';

  const lines = [];
  let currentLine = '';
  let lastY = null;

  for (const item of items) {
    if (!item || typeof item.str !== 'string') continue;

    const y = Array.isArray(item.transform) ? item.transform[5] : null;
    const text = item.str;

    if (lastY !== null && y !== null && Math.abs(y - lastY) >= 2) {
      if (currentLine.trim()) lines.push(currentLine.trim());
      currentLine = text;
    } else if (currentLine && text && !currentLine.endsWith(' ') && !text.startsWith(' ')) {
      currentLine += ` ${text}`;
    } else {
      currentLine += text;
    }

    if (y !== null) {
      lastY = y;
    }

    if (item.hasEOL) {
      if (currentLine.trim()) lines.push(currentLine.trim());
      currentLine = '';
      lastY = null;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.join('\n').trim();
}

/**
 * Validates a PDF file and extracts its text content client-side via PDF.js.
 * Works with zero backend dependency (Cloudflare Pages, Vite dev, offline).
 *
 * @param {File|Blob} file
 * @param {object} [options]
 * @param {number} [options.maxSizeMB=5]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{ text: string, pageCount: number, info: object }>}
 */
export async function extractTextFromPdf(file, { maxSizeMB = MAX_PDF_SIZE_MB, signal } = {}) {
  if (signal?.aborted) {
    throw createAbortError();
  }

  if (!file) {
    throw new Error('No file selected.');
  }

  if (!isPdfFile(file)) {
    throw new Error('Unsupported file format. Please upload a valid PDF resume.');
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (typeof file.size === 'number') {
    if (file.size === 0) {
      throw new Error('The selected PDF file is empty.');
    }
    if (file.size > maxBytes) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit. Please upload a smaller PDF file.`);
    }
  }

  const bytes = await readFileAsUint8Array(file);
  if (signal?.aborted) {
    throw createAbortError();
  }

  if (!hasPdfMagicHeader(bytes)) {
    throw new Error('File content does not match a valid PDF document.');
  }

  ensurePdfWorker();

  const loadingTask = pdfjsLib.getDocument({
    data: bytes,
    verbosity: 0,
    useSystemFonts: true,
  });

  const onAbort = () => {
    try {
      loadingTask.destroy();
    } catch {
      // ignore destroy errors on abort
    }
  };

  if (signal) {
    signal.addEventListener('abort', onAbort, { once: true });
  }

  let pdfDoc = null;
  try {
    pdfDoc = await loadingTask.promise;
    if (signal?.aborted) {
      throw createAbortError();
    }

    const pageTexts = [];
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      if (signal?.aborted) {
        throw createAbortError();
      }
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = reconstructPageText(textContent?.items);
      if (pageText) {
        pageTexts.push(pageText);
      }
      if (typeof page.cleanup === 'function') {
        page.cleanup();
      }
    }

    let info = {};
    try {
      const meta = await pdfDoc.getMetadata();
      info = meta?.info || {};
    } catch {
      info = {};
    }

    const extractedText = pageTexts.join('\n\n').trim();
    if (!extractedText) {
      throw new Error(
        'Could not extract text from this PDF. It may be a scanned image-only PDF — try pasting your resume text instead.'
      );
    }

    return {
      text: extractedText,
      pageCount: pdfDoc.numPages,
      info,
    };
  } catch (err) {
    if (signal?.aborted || err?.name === 'AbortError') {
      throw createAbortError();
    }
    if (err?.name === 'PasswordException') {
      throw new Error('This PDF is password-protected. Please remove the password and try again.');
    }
    if (err?.name === 'InvalidPDFException' || err?.name === 'FormatError') {
      throw new Error('Failed to parse PDF. Please ensure the file is a valid PDF document.');
    }
    throw err;
  } finally {
    if (signal) {
      signal.removeEventListener('abort', onAbort);
    }
    if (pdfDoc) {
      try {
        await pdfDoc.destroy();
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
