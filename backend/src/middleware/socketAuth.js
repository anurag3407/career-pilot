import { createClerkClient, verifyToken } from '@clerk/express';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
      const userId = decoded.userId || decoded.sub;
      
      const user = await clerkClient.users.getUser(userId);
      const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0]?.emailAddress;

      socket.user = {
        uid: user.id,
        email: email,
        name: user.fullName || user.username || email?.split('@')[0],
        picture: user.imageUrl,
        emailVerified: true
      };
      next();
    } catch (clerkError) {
      if (process.env.ALLOW_DEV_SOCKET_AUTH === 'true' || (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true')) {
        console.warn('Clerk verification failed, using dev bypass');
        socket.user = {
          uid: 'dev-user-001',
          email: 'dev@example.com',
          name: 'User',
          picture: null,
          emailVerified: true
        };
        next();
      } else {
        console.error('Socket auth error:', clerkError.message);
        next(new Error('Invalid authentication token'));
      }
    }
  } catch (error) {
    console.error('Socket middleware error:', error);
    next(new Error('Authentication failed'));
  }
};
