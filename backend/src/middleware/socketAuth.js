import { createClerkClient, verifyToken as verifyClerkToken } from '@clerk/express';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // 1. Try Supabase Auth
    if (supabaseAdmin?.auth) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && data?.user) {
          const user = data.user;
          const meta = user.user_metadata || {};
          socket.user = {
            uid: user.id,
            id: user.id,
            email: user.email,
            name: meta.full_name || meta.name || user.email?.split('@')[0] || 'User',
            picture: meta.avatar_url || null,
            emailVerified: Boolean(user.email_confirmed_at)
          };
          return next();
        }
      } catch {
        // Fall through
      }
    }

    // 2. Try Clerk Auth if configured
    if (process.env.CLERK_SECRET_KEY) {
      try {
        const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        const decoded = await verifyClerkToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
        const userId = decoded.userId || decoded.sub;
        const user = await clerkClient.users.getUser(userId);
        const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0]?.emailAddress;

        socket.user = {
          uid: user.id,
          id: user.id,
          email: email,
          name: user.fullName || user.username || email?.split('@')[0],
          picture: user.imageUrl,
          emailVerified: true
        };
        return next();
      } catch (clerkError) {
        // Fall through to dev check
      }
    }

    // 3. Dev bypass
    if (process.env.ALLOW_DEV_SOCKET_AUTH === 'true' || (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true')) {
      console.warn('Authentication failed, using dev bypass');
      socket.user = {
        uid: 'dev-user-001',
        id: 'dev-user-001',
        email: 'dev@example.com',
        name: 'User',
        picture: null,
        emailVerified: true
      };
      return next();
    }

    return next(new Error('Invalid authentication token'));
  } catch (error) {
    console.error('Socket middleware error:', error);
    next(new Error('Authentication failed'));
  }
};

export default socketAuthMiddleware;
