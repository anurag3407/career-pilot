import express from 'express';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { handleUpload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { validateUpload } from '../middleware/uploadValidator.js';

const router = express.Router();

// Upload and extract text from PDF
router.post('/', verifyToken, handleUpload, validateUpload, asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }
  try {
    const fileBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(fileBuffer);
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
    const pdfData = await pdfParse(fileBuffer);

    res.json({
      success: true,
      data: {
        text: pdfData.text,
        pageCount: pdfData.numpages
      }
    });
  } catch (error) {
    console.error('PDF text extraction error:', error);
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