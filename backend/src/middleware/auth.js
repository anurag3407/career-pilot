import { Client, Account } from 'node-appwrite';
import { ApiError } from './errorHandler.js';

// Helper to verify Appwrite JWT
const verifyAppwriteToken = async (token) => {
  const authClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setJWT(token);
  
  const account = new Account(authClient);
  return await account.get();
};

// Middleware to verify Appwrite JWT
export const verifyToken = async (req, res, next) => {
  try {
    // Development bypass
    if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true') {
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const devEmail = (process.env.DEV_USER_EMAIL || 'dev@example.com').toLowerCase();
      req.user = {
        uid: process.env.DEV_USER_UID || 'dev-user-001',
        email: process.env.DEV_USER_EMAIL || 'dev@example.com',
        name: 'Local Dev User',
        picture: null,
        emailVerified: true,
        isAdmin: adminEmails.includes(devEmail)
      };
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedUser = await verifyAppwriteToken(token);

      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const emailLower = decodedUser.email?.toLowerCase();

      req.user = {
        uid: decodedUser.$id,
        email: decodedUser.email,
        name: decodedUser.name || decodedUser.email?.split('@')[0],
        picture: null, // Appwrite doesn't provide picture by default in account.get()
        emailVerified: decodedUser.emailVerification,
        isAdmin: decodedUser.emailVerification && adminEmails.includes(emailLower)
      };

      next();
    } catch (appwriteError) {
      if (!process.env.APPWRITE_PROJECT_ID) {
        console.error('Appwrite not configured');
        throw new ApiError(500, 'Appwrite not configured');
      }
      throw new ApiError(401, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access to admin users only.
export const adminOnly = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!req.user || !req.user.emailVerified || !adminEmails.includes(req.user.email?.toLowerCase())) {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    // Development bypass
    if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true') {
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const devEmail = (process.env.DEV_USER_EMAIL || 'dev@example.com').toLowerCase();
      req.user = {
        uid: process.env.DEV_USER_UID || 'dev-user-001',
        email: process.env.DEV_USER_EMAIL || 'dev@example.com',
        name: 'Local Dev User',
        picture: null,
        emailVerified: true,
        isAdmin: adminEmails.includes(devEmail)
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
      const decodedUser = await verifyAppwriteToken(token);

      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const emailLower = decodedUser.email?.toLowerCase();

      req.user = {
        uid: decodedUser.$id,
        email: decodedUser.email,
        name: decodedUser.name || decodedUser.email?.split('@')[0],
        picture: null,
        emailVerified: decodedUser.emailVerification,
        isAdmin: decodedUser.emailVerification && adminEmails.includes(emailLower)
      };

      next();
    } catch (error) {
      if (!process.env.APPWRITE_PROJECT_ID) {
        console.error('Appwrite not configured');
        throw new ApiError(500, 'Appwrite not configured');
      }
      req.user = null;
      next();
    }
  } catch (error) {
    next(error);
  }
};