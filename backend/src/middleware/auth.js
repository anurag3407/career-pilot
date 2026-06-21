import admin from 'firebase-admin';
import { ApiError } from './errorHandler.js';

// Middleware to verify Firebase ID token
export const verifyToken = async (req, res, next) => {
  try {
    // Development bypass
    if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true') {
      req.user = {
        uid: process.env.DEV_USER_UID || 'dev-user-001',
        email: process.env.DEV_USER_EMAIL || 'dev@example.com',
        name: 'Local Dev User',
        picture: null,
        emailVerified: true
      };
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        picture: decodedToken.picture || null,
        emailVerified: decodedToken.email_verified
      };

      next();
    } catch (firebaseError) {
      if (firebaseError?.code === 'app/no-app') {
        console.error('Firebase Admin not configured');

        throw new ApiError(
          500,
          'Firebase Admin not configured'
        );
      }

      throw new ApiError(401, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access to admin users only.
// Must be placed after verifyToken in the middleware chain.
// Admin users are identified by email matching the ADMIN_EMAILS environment variable
// (comma-separated list). Returns 403 for any authenticated user not on the list.
export const adminOnly = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (!req.user || !adminEmails.includes(req.user.email)) {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    // Development bypass
    if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true') {
      req.user = {
        uid: process.env.DEV_USER_UID || 'dev-user-001',
        email: process.env.DEV_USER_EMAIL || 'dev@example.com',
        name: 'Local Dev User',
        picture: null,
        emailVerified: true
      };
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        picture: decodedToken.picture || null,
        emailVerified: decodedToken.email_verified
      };

      next();
    } catch (error) {
      if (error?.code === 'app/no-app') {
        console.error('Firebase Admin not configured');

        throw new ApiError(
          500,
          'Firebase Admin not configured'
        );
      }

      req.user = null;
      next();
    }
  } catch (error) {
    next(error);
  }
};