import fs from 'fs/promises';
import { ApiError } from './errorHandler.js';

/**
 * Security scanner for uploaded files.
 * Primarily targets PDF files as they are the primary resume format.
 */

// Malicious patterns commonly found in PDF files
const PDF_MALICIOUS_PATTERNS = [
  { pattern: /\/JS\b/i, name: 'Embedded JavaScript' },
  { pattern: /\/JavaScript\b/i, name: 'Embedded JavaScript' },
  { pattern: /\/OpenAction\b/i, name: 'Automatic Action' },
  { pattern: /\/AA\b/i, name: 'Additional Action' },
  { pattern: /\/Launch\b/i, name: 'External Command Launch' },
  { pattern: /\/EmbeddedFiles\b/i, name: 'Embedded Files' },
  { pattern: /\/RichMedia\b/i, name: 'Flash/Media Content' },
  { pattern: /\/URI\s+\(javascript:/i, name: 'JavaScript URI' }
];

const MAX_SCAN_SIZE = 10 * 1024 * 1024; // 10MB hard limit for the scanner

/**
 * Scans a file for malicious patterns.
 * 
 * @param {string} filePath - Path to the file on disk.
 * @returns {Promise<{isSafe: boolean, threats: string[]}>}
 */
const scanFile = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    
    if (stats.size > MAX_SCAN_SIZE) {
      return {
        isSafe: false,
        threats: [`File size (${(stats.size / (1024 * 1024)).toFixed(2)}MB) exceeds security scan limit of 10MB`]
      };
    }

    const buffer = await fs.readFile(filePath);
    const content = buffer.toString('binary');
    const threatsFound = [];

    for (const { pattern, name } of PDF_MALICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        threatsFound.push(name);
      }
    }

    return {
      isSafe: threatsFound.length === 0,
      threats: threatsFound
    };
  } catch (error) {
    console.error('[SecurityScanner] Scan failed:', error.message);
    throw new ApiError(500, 'Security scan failed. Please try again.');
  }
};

/**
 * Middleware to perform security scanning on uploaded files.
 * This should be placed after the multer upload middleware and before any processing.
 */
export const uploadSecurityScanner = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const { path: filePath, mimetype } = req.file;

  // Only scan PDFs for now as they are the most common resume format
  if (mimetype !== 'application/pdf') {
    return next();
  }

  try {
    const { isSafe, threats } = await scanFile(filePath);

    if (!isSafe) {
      // Security threat detected - cleanup file and block request
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error('[SecurityScanner] Cleanup failed:', cleanupError.message);
      }

      return next(
        new ApiError(
          400,
          `Security Alert: Malicious content detected in the uploaded file (${threats.join(', ')}). Your upload has been blocked for safety.`
        )
      );
    }

    next();
  } catch (error) {
    // If scanning fails, we should probably fail-safe and block the upload
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        // Ignore unlink errors
      }
    }
    next(error);
  }
};
