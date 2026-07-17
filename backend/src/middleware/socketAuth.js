import { Client, Account } from 'node-appwrite';

const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
};

const decodeTokenPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const verifyAppwriteToken = async (token) => {
  const authClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setJWT(token);
  
  const account = new Account(authClient);
  return await account.get();
};

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decodedUser = await verifyAppwriteToken(token);
      socket.user = {
        uid: decodedUser.$id,
        email: decodedUser.email,
        name: decodedUser.name || decodedUser.email?.split('@')[0],
        picture: null,
        emailVerified: decodedUser.emailVerification
      };
      next();
    } catch (appwriteError) {
      if (process.env.ALLOW_DEV_SOCKET_AUTH === 'true' || (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true')) {
        console.warn('Appwrite verification failed, using token payload with ALLOW_DEV_SOCKET_AUTH');
        const tokenPayload = decodeTokenPayload(token);
        
        if (tokenPayload && tokenPayload.userId) { // Appwrite usually has userId in JWT or we just mock it
          socket.user = {
            uid: tokenPayload.userId || 'dev-user-001',
            email: tokenPayload.email || 'unknown@example.com',
            name: tokenPayload.name || 'User',
            picture: null,
            emailVerified: true
          };
          next();
        } else {
          console.error('Could not extract user info from token');
          next(new Error('Invalid authentication token'));
        }
      } else {
        console.error('Socket auth error:', appwriteError.message);
        next(new Error('Invalid authentication token'));
      }
    }
  } catch (error) {
    console.error('Socket middleware error:', error);
    next(new Error('Authentication failed'));
  }
};
