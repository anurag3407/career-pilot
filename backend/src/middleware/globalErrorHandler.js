export const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  const message =
    err.isOperational
      ? err.message
      : statusCode === 500
      ? "Internal server error"
      : err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: err.details || null,
  });
};

export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};