import express from 'express';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { handleUpload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { validateUpload } from '../middleware/uploadValidator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const parseInWorker = (buffer, ms = 8000) =>
  new Promise((resolve, reject) => {
    let settled = false;
    const worker = new Worker(
      path.join(__dirname, '../workers/pdfWorker.js'),
      { workerData: { buffer: buffer.buffer } }
    );

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      reject(new Error('PDF parsing timed out'));
    }, ms);

    worker.on('message', (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (result.success) resolve(result);
      else reject(new Error(result.error));
    });

    worker.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });

    worker.on('exit', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error('PDF worker exited unexpectedly'));
    });
  });

// Upload and extract text from PDF
router.post('/', verifyToken, handleUpload, validateUpload, asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }
  try {
    const fileBuffer = await fs.readFile(req.file.path);
    const pdfData = await parseInWorker(fileBuffer);
    const resumeId = uuidv4();

    res.json({
      success: true,
      data: {
        resumeId,
        originalFilename: req.file.originalname,
        size: req.file.size,
        extractedText: pdfData.text,
        pageCount: pdfData.numpages,
        metadata: {
          info: pdfData.info,
          uploadedAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('PDF parsing error:', error);
    if (error.message === 'PDF parsing timed out') {
      throw new ApiError(408, 'PDF parsing timed out. Please try a smaller or simpler file.');
    }
    throw new ApiError(400, 'Failed to parse PDF. Please ensure the file is a valid PDF document.');
  } finally {
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error('[UploadRoute] Failed to delete temp file:', err.message);
      }
    }
  }
}));

// Extract text only endpoint (for re-processing)
router.post('/extract-text', verifyToken, handleUpload, validateUpload, asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }
  try {
    const fileBuffer = await fs.readFile(req.file.path);
    const pdfData = await parseInWorker(fileBuffer);

    res.json({
      success: true,
      data: {
        text: pdfData.text,
        pageCount: pdfData.numpages
      }
    });
  } catch (error) {
    console.error('PDF text extraction error:', error);
    if (error.message === 'PDF parsing timed out') {
      throw new ApiError(408, 'PDF parsing timed out. Please try a smaller or simpler file.');
    }
    throw new ApiError(400, 'Failed to extract text from PDF');
  } finally {
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error('[UploadRoute] Failed to delete temp file:', err.message);
      }
    }
  }
}));

export default router;