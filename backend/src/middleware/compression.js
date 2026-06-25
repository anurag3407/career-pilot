import compression from 'compression';

/**
 * Determines whether the response should be compressed.
 * Skips compression if the client sends 'x-no-compression' header.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean}
 */
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

/**
 * Compression middleware using gzip/brotli
 * - Skips responses smaller than 1kb (threshold)
 * - Respects client Accept-Encoding headers
 * - Falls back gracefully if compression fails
 */
const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024,
  level: 6,
});

export default compressionMiddleware;