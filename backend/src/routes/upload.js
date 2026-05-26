import express from 'express';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { handleUpload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { validateUpload } from '../middleware/uploadValidator.js';

const router = express.Router();

/**
 * @openapi
 * /api/upload:
 *   post:
 *     summary: Upload and extract text from a PDF resume
 *     tags:
 *       - Resume
 *     description: Uploads a PDF resume, parses its content to extract text, and returns extracted text along with file metadata. The file is temporarily stored and immediately deleted after processing.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: PDF file of the resume (max 5MB)
 *             required:
 *               - resume
 *     responses:
 *       200:
 *         description: Resume uploaded and parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     resumeId:
 *                       type: string
 *                       format: uuid
 *                     originalFilename:
 *                       type: string
 *                       example: resume.pdf
 *                     size:
 *                       type: integer
 *                       example: 125432
 *                     extractedText:
 *                       type: string
 *                       example: "John Doe\nSoftware Engineer..."
 *                     pageCount:
 *                       type: integer
 *                       example: 1
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         info:
 *                           type: object
 *                         uploadedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad request (no file uploaded, invalid PDF format, or file size too large)
 *       401:
 *         description: Unauthorized (missing or invalid Firebase ID Token)
 *       500:
 *         description: Internal server error
 */
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