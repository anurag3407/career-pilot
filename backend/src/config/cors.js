/**
 * Resolves the list of allowed origins from the environment.
 * Parses a comma-separated list of origins or falls back to FRONTEND_URL.
 * Provides safe localhost fallbacks ONLY in development mode.
 */
export const getAllowedOrigins = () => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim().replace(/\/$/, ''));
  }
  
  if (process.env.FRONTEND_URL) {
    return [process.env.FRONTEND_URL.replace(/\/$/, '')];
  }

  // Development safe fallback
  if (process.env.NODE_ENV === 'development') {
    return ['http://localhost:5173', 'http://localhost:3000'];
  }

  // Empty array in production if not configured, blocking CORS for safety
  return [];
};

export const allowedOrigins = getAllowedOrigins();
