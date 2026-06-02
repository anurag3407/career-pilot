import rateLimit from 'express-rate-limit';
import redisManager from '../config/redis.js';
import { ApiError } from './errorHandler.js';

const DAILY_LIMIT = 20;
const WINDOW_MS = 24 * 60 * 60 * 1000;

let warnedRateLimitFallback = false;

/**
 * Cluster-safe, resilient Redis store for express-rate-limit
 */
export class ResilientRedisStore {
  constructor(getClientFn, windowMs, prefix) {
    this.getClient = getClientFn;
    this.windowMs = windowMs;
    this.windowSecs = Math.ceil(windowMs / 1000);
    this.prefix = `v1:rate_limit:${prefix}`;
    this.localFallback = new Map();
  }

  async increment(key) {
    const client = this.getClient();
    const redisKey = this.prefix + key;

    if (client && client.status === 'ready') {
      try {
        const pipeline = client.pipeline();
        pipeline.incr(redisKey);
        pipeline.ttl(redisKey);
        const [[errIncr, hits], [errTtl, ttl]] = await pipeline.exec();

        if (errIncr) throw errIncr;
        if (errTtl) throw errTtl;

        // Set expiration only when the key is first created
        if (ttl < 0) {
          await client.expire(redisKey, this.windowSecs);
        }

        const remainingTtl = ttl < 0 ? this.windowSecs : ttl;
        return {
          totalHits: Number(hits) || 1,
          resetTime: new Date(Date.now() + remainingTtl * 1000)
        };
      } catch (err) {
        console.error(`❌ [ResilientRedisStore] Redis error during increment for ${redisKey}:`, err.message);
        if (process.env.NODE_ENV === 'production') {
          throw new ApiError(503, 'Rate limiting service temporarily unavailable');
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.error(`❌ [ResilientRedisStore] Redis connection unavailable during rate limit increment for ${redisKey}`);
      throw new ApiError(503, 'Rate limiting service temporarily unavailable');
    }

    // Non-production in-memory fallback
    if (!warnedRateLimitFallback) {
      console.warn('⚠️ [ResilientRedisStore] Redis rate limiter unavailable. Falling back to local Map store.');
      warnedRateLimitFallback = true;
    }

    const now = Date.now();
    let record = this.localFallback.get(key);
    if (!record || now > record.resetTime) {
      record = {
        hits: 1,
        resetTime: now + this.windowMs
      };
      this.localFallback.set(key, record);
    } else {
      record.hits += 1;
    }

    return {
      totalHits: record.hits,
      resetTime: new Date(record.resetTime)
    };
  }

  async decrement(key) {
    const client = this.getClient();
    const redisKey = this.prefix + key;

    if (client && client.status === 'ready') {
      try {
        await client.decr(redisKey);
        return;
      } catch (err) {
        console.error(`❌ [ResilientRedisStore] Redis error during decrement for ${redisKey}:`, err.message);
        if (process.env.NODE_ENV === 'production') {
          throw new ApiError(503, 'Rate limiting service temporarily unavailable');
        }
      }
    }

    const record = this.localFallback.get(key);
    if (record) {
      record.hits = Math.max(0, record.hits - 1);
    }
  }

  async resetKey(key) {
    const client = this.getClient();
    const redisKey = this.prefix + key;

    if (client && client.status === 'ready') {
      try {
        await client.del(redisKey);
        return;
      } catch (err) {
        console.error(`❌ [ResilientRedisStore] Redis error during resetKey for ${redisKey}:`, err.message);
        if (process.env.NODE_ENV === 'production') {
          throw new ApiError(503, 'Rate limiting service temporarily unavailable');
        }
      }
    }

    this.localFallback.delete(key);
  }
}

/**
 * Helper to build a resilient rate limit store using the centralized redisManager connection
 */
export const createResilientStore = (prefix, windowMs) => {
  return new ResilientRedisStore(
    () => {
      try {
        return redisManager.get('rate-limiter');
      } catch {
        return null;
      }
    },
    windowMs,
    prefix
  );
};

export const aiRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: DAILY_LIMIT,
  keyGenerator: (req) => req.user?.uid || req.ip,
  store: createResilientStore('ai:', WINDOW_MS),
  standardHeaders: true,
  legacyHeaders: true,
  handler: (req, res, next, options) => {
    const reset = res.getHeader('X-RateLimit-Reset') || res.getHeader('RateLimit-Reset');
    const resetAt = reset ? new Date(Number(reset) * 1000).toISOString() : null;

    res.status(429).json({
      success: false,
      error: 'Daily limit reached',
      limit: DAILY_LIMIT,
      remaining: 0,
      resetAt
    });
  },
  skip: (req) => !req.user
});
