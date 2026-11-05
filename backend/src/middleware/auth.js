import { clerkMiddleware, createClerkClient } from '@clerk/express';
import { ApiError } from './errorHandler.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

const getClerkClient = () => {
  if (process.env.CLERK_SECRET_KEY) {
    try {
      return createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    } catch {
      return null;
    }
  }
  return null;
};

const tokenParserMiddleware = (req, res, next) => {
  if (process.env.CLERK_SECRET_KEY) {
    try {
      return clerkMiddleware()(req, res, next);
    } catch {
      return next();
    }
  }
  next();
};

const attachUserToReq = async (req, res, next) => {
  try {
    // 1. Development bypass
    if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true') {
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
      const devEmail = (process.env.DEV_USER_EMAIL || 'dev@example.com').toLowerCase();
      req.user = {
        id: process.env.DEV_USER_UID || 'dev-user-001',
        uid: process.env.DEV_USER_UID || 'dev-user-001',
        email: devEmail,
        name: 'Local Dev User',
        picture: null,
        emailVerified: true,
        isAdmin: adminEmails.includes(devEmail)
      };
      return next();
    }

    // 2. Supabase Auth via Bearer token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token && supabaseAdmin?.auth) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && data?.user) {
          const user = data.user;
          const email = (user.email || '').toLowerCase();
          const meta = user.user_metadata || {};
          const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

          req.user = {
            id: user.id,
            uid: user.id,
            email: user.email,
            name: meta.full_name || meta.name || meta.username || user.email?.split('@')[0] || 'User',
            picture: meta.avatar_url || meta.picture || null,
            emailVerified: Boolean(user.email_confirmed_at),
            isAdmin: adminEmails.includes(email)
          };
          return next();
        }
      } catch (supaErr) {
        // Fall through to Clerk or null
      }
    }

    // 3. Fallback to Clerk Auth if present
    const clerkClient = getClerkClient();
    if (req.auth && req.auth.userId && clerkClient) {
      const user = await clerkClient.users.getUser(req.auth.userId);
      const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0]?.emailAddress;

      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
      const emailLower = email?.toLowerCase();

      req.user = {
        id: user.id,
        uid: user.id,
        email: email,
        name: user.fullName || user.username || email?.split('@')[0],
        picture: user.imageUrl,
        emailVerified: true,
        isAdmin: adminEmails.includes(emailLower)
      };
      return next();
    }

    req.user = null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const enforceAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true') {
    return next();
  }
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized'));
  }
  next();
};

export const verifyToken = [
  tokenParserMiddleware,
  attachUserToReq,
  enforceAuth
];

export const optionalAuth = [
  tokenParserMiddleware,
  attachUserToReq
];

export const adminOnly = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!req.user || !adminEmails.includes(req.user.email?.toLowerCase())) {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};

export default {
  verifyToken,
  optionalAuth,
  adminOnly,
};
