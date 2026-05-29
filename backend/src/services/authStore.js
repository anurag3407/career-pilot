import redisManager from '../config/redis.js';
import { ApiError } from '../middleware/errorHandler.js';

// Fallback in-memory stores for non-production environments
const fallbackOAuthStates = new Map();
const fallbackLinkedInCodes = new Map();
const fallbackPasswordResets = new Map();

let warnedConnectionError = false;

const isProd = () => process.env.NODE_ENV === 'production';

const getClient = () => {
  if (!process.env.REDIS_URL) {
    if (isProd()) {
      throw new ApiError(503, 'Authentication service configuration error');
    }
    return null;
  }
  try {
    return redisManager.get('auth');
  } catch (err) {
    if (isProd()) {
      throw new ApiError(503, 'Authentication service connection error');
    }
    if (!warnedConnectionError) {
      console.warn('⚠️ [AuthStore] Redis client retrieval failed. Falling back to local Map:', err.message);
      warnedConnectionError = true;
    }
    return null;
  }
};

const handleRedisError = (err, contextMessage) => {
  console.error(`❌ [AuthStore] Redis error during ${contextMessage}:`, err.message);
  if (isProd()) {
    throw new ApiError(503, 'Authentication service is temporarily unavailable');
  }
  if (!warnedConnectionError) {
    console.warn(`⚠️ [AuthStore] Fallback to in-memory store activated due to error: ${err.message}`);
    warnedConnectionError = true;
  }
};

// Periodic sweep for fallback store entries (only running in non-prod environments)
if (!isProd()) {
  setInterval(() => {
    const now = Date.now();
    for (const [state, expiry] of fallbackOAuthStates.entries()) {
      if (now > expiry) fallbackOAuthStates.delete(state);
    }
    for (const [code, entry] of fallbackLinkedInCodes.entries()) {
      if (now > entry.expiresAt) fallbackLinkedInCodes.delete(code);
    }
    for (const [token, entry] of fallbackPasswordResets.entries()) {
      if (now > entry.expiresAt) fallbackPasswordResets.delete(token);
    }
  }, 10 * 60 * 1000).unref();
}

export const authStore = {
  /**
   * Store generated OAuth state parameter
   */
  async setOAuthState(state, ttlSecs) {
    const client = getClient();
    if (client) {
      try {
        const key = `v1:auth:oauth_state:${state}`;
        await client.set(key, '1', 'EX', ttlSecs);
        return;
      } catch (err) {
        handleRedisError(err, 'setOAuthState');
        if (isProd()) return; // Flow will have thrown above
      }
    }
    fallbackOAuthStates.set(state, Date.now() + ttlSecs * 1000);
  },

  /**
   * Validate and delete OAuth state (atomic replay prevention)
   */
  async validateOAuthState(state) {
    const client = getClient();
    if (client) {
      try {
        const key = `v1:auth:oauth_state:${state}`;
        const deletedCount = await client.del(key);
        return deletedCount > 0;
      } catch (err) {
        handleRedisError(err, 'validateOAuthState');
        if (isProd()) return false;
      }
    }
    const expiry = fallbackOAuthStates.get(state);
    if (expiry) {
      fallbackOAuthStates.delete(state);
      return Date.now() <= expiry;
    }
    return false;
  },

  /**
   * Store short-lived LinkedIn exchange code and custom token details
   */
  async setLinkedInCode(code, value, ttlSecs) {
    const client = getClient();
    if (client) {
      try {
        const key = `v1:auth:linkedin_code:${code}`;
        await client.set(key, JSON.stringify(value), 'EX', ttlSecs);
        return;
      } catch (err) {
        handleRedisError(err, 'setLinkedInCode');
        if (isProd()) return;
      }
    }
    fallbackLinkedInCodes.set(code, {
      value,
      expiresAt: Date.now() + ttlSecs * 1000,
    });
  },

  /**
   * Retrieve and immediately delete LinkedIn code details (atomic invalidation)
   */
  async getAndDeleteLinkedInCode(code) {
    const client = getClient();
    if (client) {
      try {
        const key = `v1:auth:linkedin_code:${code}`;
        const pipeline = client.pipeline();
        pipeline.get(key);
        pipeline.del(key);
        const [[errGet, value], [errDel]] = await pipeline.exec();

        if (errGet) throw errGet;
        if (errDel) throw errDel;

        if (value) {
          return JSON.parse(value);
        }
        return null;
      } catch (err) {
        handleRedisError(err, 'getAndDeleteLinkedInCode');
        if (isProd()) return null;
      }
    }
    const entry = fallbackLinkedInCodes.get(code);
    if (entry) {
      fallbackLinkedInCodes.delete(code);
      if (Date.now() <= entry.expiresAt) {
        return entry.value;
      }
    }
    return null;
  },

  /**
   * Store password reset token mapped to userId
   */
  async setPasswordResetToken(token, userId, ttlSecs) {
    const client = getClient();
    if (client) {
      try {
        const key = `v1:auth:reset_token:${token}`;
        await client.set(key, userId, 'EX', ttlSecs);
        return;
      } catch (err) {
        handleRedisError(err, 'setPasswordResetToken');
        if (isProd()) return;
      }
    }
    fallbackPasswordResets.set(token, {
      userId,
      expiresAt: Date.now() + ttlSecs * 1000,
    });
  },

  /**
   * Retrieve and delete password reset token (atomic usage)
   */
  async getAndDeletePasswordResetToken(token) {
    const client = getClient();
    if (client) {
      try {
        const key = `v1:auth:reset_token:${token}`;
        const pipeline = client.pipeline();
        pipeline.get(key);
        pipeline.del(key);
        const [[errGet, userId], [errDel]] = await pipeline.exec();

        if (errGet) throw errGet;
        if (errDel) throw errDel;

        return userId || null;
      } catch (err) {
        handleRedisError(err, 'getAndDeletePasswordResetToken');
        if (isProd()) return null;
      }
    }
    const entry = fallbackPasswordResets.get(token);
    if (entry) {
      fallbackPasswordResets.delete(token);
      if (Date.now() <= entry.expiresAt) {
        return entry.userId;
      }
    }
    return null;
  },
};
