import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

let redisClient;

const getRedisClient = () => {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, { lazyConnect: true, enableOfflineQueue: false });
      redisClient.on('error', (err) => console.warn('Rate limiter Redis error:', err.message));
    } catch (err) {
      console.warn('Rate limiter: could not connect to Redis, using in-memory store:', err.message);
    }
  }
  return redisClient;
};

// Helper to create the store (falls back to memory if Redis is unavailable)
const buildStore = (prefix = 'rl:') => {
  const client = getRedisClient();
  if (!client) return undefined;

  return new RedisStore({
    sendCommand: (...args) => client.call(...args),
    prefix,
  });
};

const keyGenerator = (req) => req.user?.uid || req.ip;

let _globalLimiter;
export const globalLimiter = (req, res, next) => {
  if (!_globalLimiter) {
    _globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      store: buildStore('rl:'),
      handler: (req, res, next, options) => {
        res.status(429).json({
          success: false,
          error: options.message?.error || 'Rate limit exceeded',
          message: options.message
        });
      },
      message: {
        error: 'Too many requests, please try again later.'
      }
    });
  }
  return _globalLimiter(req, res, next);
};

let _strictLimiter;
export const strictLimiter = (req, res, next) => {
  if (!_strictLimiter) {
    _strictLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      store: buildStore('ai_rl:'),
      validate: { ip: false }, // Disable IPv6 validation to allow fallback to req.ip
      keyGenerator, // Strict limits by user ID (if auth) or IP
      handler: (req, res, next, options) => {
        res.status(429).json({
          success: false,
          error: 'Rate limit exceeded for AI/Upload endpoints',
          limit: options.max,
          message: {
              error: 'Too many requests to high-cost endpoints, please try again later.'
          }
        });
      },
      // Skip limiting only when the user supplies their own API key (they pay for their own quota).
      // Do NOT skip unauthenticated requests — they must still be rate-limited by IP.
      skip: (req) => req.aiProviderSource === 'user_header' || req.aiProviderSource === 'user_openrouter_pkce'
    });
  }
  return _strictLimiter(req, res, next);
};

export const aiRateLimiter = strictLimiter;
