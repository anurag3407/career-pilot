import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { ApiError } from './errorHandler.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

// Allowed MIME types for resume documents
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Allowed extensions — cross-checked with MIME to block spoofed Content-Type headers
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// Cloudinary storage — resource_type 'raw' prevents media processing of uploaded docs;
// allowed_formats acts as a second-layer whitelist enforced by Cloudinary itself
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'resumes',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

// File filter for resume documents (PDF / DOC / DOCX only)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ALLOWED_MIME_TYPES;
  const allowedExtensions = ALLOWED_EXTENSIONS;

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(415, 'Unsupported file type. Please upload a PDF, DOC, or DOCX resume.'),
      false
    );
  }
};

// Create multer upload instance with strict size and type boundaries
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB limit
    files: 1 // Only 1 file at a time
  }
});

// Single file upload middleware
const singleResumeUpload = upload.single('resume');

// Error handling wrapper for multer
export const handleResumeUpload = (req, res, next) => {
  singleResumeUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new ApiError(413, 'File size exceeds 5MB limit. Please upload a smaller resume.')
        );
      }
      return next(new ApiError(400, err.message));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

export default upload;