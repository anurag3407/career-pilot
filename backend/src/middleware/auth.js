import admin from '../config/firebase.js';
import TwoFactor from '../models/TwoFactor.model.js';
import { ApiError } from './errorHandler.js'; 

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (firebaseError) {
      if (firebaseError?.code === 'app/no-app') {
        console.error('Firebase Admin not configured');
        throw new ApiError(500, 'Firebase Admin not configured');
      }
      throw new ApiError(401, firebaseError.message || 'Invalid or expired token');
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0],
      picture: decodedToken.picture || null,
      emailVerified: decodedToken.email_verified
    };

    const twoFactorRecord = await TwoFactor.findOne({ uid: req.user.uid });
    
    if (twoFactorRecord && twoFactorRecord.enabled && !decodedToken.is2FAVerified) {
      const allowedPaths = ['/status', '/setup', '/enable', '/verify', '/verify-backup'];
      const is2FAPath = req.baseUrl.includes('/2fa') && allowedPaths.includes(req.path);
      
      if (!is2FAPath) {
        throw new ApiError(403, '2FA verification required');
      }
    }

    next();
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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split('Bearer ')[1];
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
    req.user = null;
    next();
  }
};