// Custom error class for API errors
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File size exceeds the limit of 5MB',
      message: 'File size exceeds the limit of 5MB'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field',
      message: 'Unexpected file field'
    });
  }

  // Handle API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      message: err.message,
      details: err.details
    });
  }

  // Handle Firebase Auth errors (string codes like 'auth/invalid-token')
  if (err.code && typeof err.code === 'string' && err.code.startsWith('auth/')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication error',
      message: err.message,
      details: err.message
    });
  }

  // Handle Firestore/gRPC errors (numeric codes)
  if (err.code && typeof err.code === 'number') {
    const grpcCodeMessages = {
      1: 'Operation cancelled',
      2: 'Unknown error',
      3: 'Invalid argument',
      4: 'Deadline exceeded',
      5: 'Not found',
      6: 'Already exists',
      7: 'Permission denied',
      9: 'Failed precondition - index may be required',
      10: 'Aborted',
      13: 'Internal error',
      14: 'Service unavailable',
      16: 'Unauthenticated'
    };
    const errMsg = grpcCodeMessages[err.code] || 'Database error';
    return res.status(500).json({
      success: false,
      error: errMsg,
      message: errMsg,
      details: err.details || err.message
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: err.message,
      details: err.message
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    error: message,
    message: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
