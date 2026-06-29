import multer from 'multer';
import path from 'path';
import { ApiError } from './errorHandler.js';

import os from 'os';
import crypto from 'crypto';

/**
 * Multer disk storage configuration targeting the OS temp directory
 * with secure, randomized, collision-resistant filenames.
 */
const storage = multer.diskStorage({
  /**
   * Defines the destination directory for temporary files.
   *
   * @param {object} req - Express request object.
   * @param {object} file - Multer file object.
   * @param {Function} cb - Destination callback.
   */
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  /**
   * Defines the secure unique filename for temporary files.
   *
   * @param {object} req - Express request object.
   * @param {object} file - Multer file object.
   * @param {Function} cb - Filename callback.
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${uniqueSuffix}${ext}`);
  }
});

// File filter for PDF only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  const allowedExtensions = ['.pdf'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
  new ApiError(
    400,
    'Unsupported file format. Please upload a valid PDF resume.'
  ),
  false
);
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only 1 file at a time
  }
});

// Single file upload middleware
export const singleUpload = upload.single('resume');

// Error handling wrapper for multer
export const handleUpload = (req, res, next) => {
  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
  new ApiError(
    400,
    'File size exceeds 5MB limit. Please upload a smaller PDF file.'
  )
);
      }
      return next(new ApiError(400, err.message));
    } else if (err) {
      return next(err);
    }
    next();
  });
};
