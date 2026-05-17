import { maskSensitiveFields } from '../utils/maskSensitiveFields.js';

export function requestLogger(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    return next();
  }

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(
      `[${req.method}] ${req.originalUrl}`,
      maskSensitiveFields(req.body)
    );
  }

  return next();
}
