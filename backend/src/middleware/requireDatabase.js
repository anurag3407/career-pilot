import mongoose from 'mongoose';

/**
 * Returns 503 when MongoDB is not connected so API handlers do not hang
 * waiting on a dead socket.
 */
export const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    success: false,
    error: 'Database temporarily unavailable. Please try again shortly.',
  });
};
