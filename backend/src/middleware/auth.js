import admin from 'firebase-admin';
import { ApiError } from './errorHandler.js';

// Middleware to verify Firebase ID token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split('Bearer ')[1];

    if (process.env.DEV_BYPASS_AUTH === 'true' || (process.env.NODE_ENV === 'development' && token === 'dev-token')) {
      console.log('🔑 Local Development Auth Bypass active');
      const devEmail = process.env.DEV_USER_EMAIL || 'dev@example.com';
      req.user = {
        uid: 'dev-user-001',
        email: devEmail,
        name: 'Developer',
        emailVerified: true
      };
      return next();
    }

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
      // For development, allow bypass if Firebase Admin is not fully configured
      if (process.env.NODE_ENV === 'development' && firebaseError.code === 'app/no-app') {
        console.warn('Firebase Admin not configured, allowing request in development mode');
        // Use DEV_USER_EMAIL from .env for testing, or default
        const devEmail = process.env.DEV_USER_EMAIL || 'dev@example.com';
        req.user = {
          uid: 'dev-user',
          email: devEmail,
          name: 'Developer',
          emailVerified: true
        };
        console.log(`   Dev user email: ${devEmail}`);
        next();
      } else {
        throw new ApiError(401, 'Invalid or expired token');
      }
    }
  } catch (error) {
    next(error);
  }
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
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
    } catch (error) {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
