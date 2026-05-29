import path from 'path';
import { ApiError } from './errorHandler.js';
import fs from 'fs/promises';
import redisManager from '../config/redis.js';

// Allowed MIME types and their magic bytes
const ALLOWED_TYPES = {
  'application/pdf': {
    extension: '.pdf',
    magicBytes: [0x25, 0x50, 0x44, 0x46], // %PDF
    offset: 0,
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// In-memory store for daily upload tracking per user (non-production fallback)
// { userId: { date: 'YYYY-MM-DD', totalBytes: number } }
const dailyUploadTracker = new Map();

const MAX_DAILY_BYTES = 20 * 1024 * 1024; // 20MB per user per day

let warnedUploadFallback = false;

const isProd = () => process.env.NODE_ENV === 'production';

/**
 * Validate magic bytes of uploaded file buffer
 */
const validateMagicBytes = (buffer, allowedType) => {
  const { magicBytes, offset } = allowedType;
  for (let i = 0; i < magicBytes.length; i++) {
    if (buffer[offset + i] !== magicBytes[i]) {
      return false;
    }
  }
  return true;
};

/**
 * Check and update daily upload limit for a user (Redis-backed with fallback)
 */
const checkDailyLimit = async (userId, fileSize) => {
  const today = new Date().toISOString().slice(0, 10);

  if (process.env.REDIS_URL) {
    try {
      const client = redisManager.get('upload-limiter');
      if (client && client.status === 'ready') {
        const redisKey = `v1:rate_limit:upload:${userId}`;
        const pipeline = client.pipeline();
        pipeline.incrby(redisKey, fileSize);
        pipeline.ttl(redisKey);
        const [[errIncr, newTotal], [errTtl, ttl]] = await pipeline.exec();

        if (errIncr) throw errIncr;
        if (errTtl) throw errTtl;

        // Set expiration only when the key is first created
        if (ttl < 0) {
          await client.expire(redisKey, 24 * 60 * 60); // 24 hours
        }

        if (newTotal > MAX_DAILY_BYTES) {
          // Decrement back to keep counter precise
          await client.decrby(redisKey, fileSize);
          return false;
        }
        return true;
      }
    } catch (err) {
      console.error('❌ [UploadValidator] Redis check failed:', err.message);
      if (isProd()) {
        throw new ApiError(503, 'Upload validation service temporarily unavailable');
      }
    }
  } else if (isProd()) {
    console.error('❌ [UploadValidator] Redis not configured in production environment');
    throw new ApiError(503, 'Upload validation service temporarily unavailable');
  }

  // Non-production in-memory fallback
  if (!warnedUploadFallback) {
    console.warn('⚠️ [UploadValidator] Redis daily upload tracker unavailable. Falling back to local Map store.');
    warnedUploadFallback = true;
  }

  const record = dailyUploadTracker.get(userId);

  if (!record || record.date !== today) {
    dailyUploadTracker.set(userId, { date: today, totalBytes: fileSize });
    return true;
  }

  if (record.totalBytes + fileSize > MAX_DAILY_BYTES) {
    return false;
  }

  record.totalBytes += fileSize;
  return true;
};

/**
 * Reads the first N bytes of a file on disk.
 *
 * @param {string} filePath - Absolute path to the file.
 * @param {number} byteCount - Number of bytes to read.
 * @returns {Promise<Buffer>} The read bytes as a Buffer.
 */
const readFirstBytes = async (filePath, byteCount) => {
  let fileHandle = null;
  try {
    fileHandle = await fs.open(filePath, 'r');
    const buffer = Buffer.alloc(byteCount);
    const { bytesRead } = await fileHandle.read(buffer, 0, byteCount, 0);
    if (bytesRead < byteCount) {
      return buffer.subarray(0, bytesRead);
    }
    return buffer;
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
  }
};

/**
 * Main upload validator middleware
 */
export const validateUpload = async (req, res, next) => {
  const file = req.file;

  // A helper function to safely unlink the temporary disk file
  const cleanup = async () => {
    if (file && file.path) {
      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.error('[UploadValidator] Error cleaning up file:', err.message);
      }
    }
  };

  try {
    // 1. Check file exists
    if (!file) {
      return next(new ApiError(400, 'No file uploaded.'));
    }

    // 2. Check file size
    if (file.size > MAX_FILE_SIZE) {
      await cleanup();
      return next(new ApiError(400, `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`));
    }

    // 3. Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = Object.values(ALLOWED_TYPES).map((t) => t.extension);
    if (!allowedExtensions.includes(ext)) {
      await cleanup();
      return next(new ApiError(400, `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`));
    }

    // 4. Check MIME type
    const allowedMime = ALLOWED_TYPES[file.mimetype];
    if (!allowedMime) {
      await cleanup();
      return next(new ApiError(400, 'Invalid MIME type. Only PDF files are allowed.'));
    }

    // 5. Magic byte validation from temporary disk file
    if (!file.path) {
      await cleanup();
      return next(new ApiError(400, 'File upload path is missing.'));
    }

    let buffer;
    try {
      buffer = await readFirstBytes(file.path, 4);
    } catch (err) {
      console.error('[UploadValidator] Error reading file header:', err.message);
      await cleanup();
      return next(new ApiError(400, 'File is unreadable or corrupted.'));
    }

    if (!buffer || buffer.length < 4) {
      await cleanup();
      return next(new ApiError(400, 'File is too small or corrupted.'));
    }

    const isValidMagicBytes = validateMagicBytes(buffer, allowedMime);
    if (!isValidMagicBytes) {
      await cleanup();
      return next(new ApiError(400, 'File content does not match its extension. Please upload a valid PDF.'));
    }

    // 6. Daily limit check (per user)
    const userId = req.user?.uid || req.user?.id || 'anonymous';
    const withinLimit = await checkDailyLimit(userId, file.size);
    if (!withinLimit) {
      await cleanup();
      return next(new ApiError(429, `Daily upload limit reached (${MAX_DAILY_BYTES / 1024 / 1024}MB per day). Try again tomorrow.`));
    }

    next();
  } catch (error) {
    console.error('[UploadValidator] Error:', error.message);
    await cleanup();
    return next(new ApiError(500, 'File validation failed.'));
  }
};