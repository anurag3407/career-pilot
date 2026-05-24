import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';

const DAILY_LIMIT = 20;
const WINDOW_MS = 24 * 60 * 60 * 1000;

// Redis store for express-rate-limit using the ioredis client already in the project.
// Limits survive server restarts when REDIS_URL is configured.
class RedisStore {
  constructor(client, windowMs) {
    this.client = client;
    this.windowSecs = Math.ceil(windowMs / 1000);
    this.prefix = 'ai_rl:';
  }

  async increment(key) {
    const redisKey = this.prefix + key;
    const pipeline = this.client.pipeline();
    pipeline.incr(redisKey);
    pipeline.ttl(redisKey);
    const [[, hits], [, ttl]] = await pipeline.exec();

    if (ttl < 0) {
      await this.client.expire(redisKey, this.windowSecs);
    }

    const remainingTtl = ttl < 0 ? this.windowSecs : ttl;
    return {
      totalHits: Number(hits) || 1,
      resetTime: new Date(Date.now() + remainingTtl * 1000)
    };
  }

  async decrement(key) {
    await this.client.decr(this.prefix + key);
  }

  async resetKey(key) {
    await this.client.del(this.prefix + key);
  }
}

const buildStore = () => {
  if (!process.env.REDIS_URL) return undefined; // falls back to express-rate-limit in-memory store

  try {
    const client = new Redis(process.env.REDIS_URL, { lazyConnect: true, enableOfflineQueue: false });
    client.on('error', (err) => console.warn('Rate limiter Redis error:', err.message));
    return new RedisStore(client, WINDOW_MS);
  } catch {
    console.warn('Rate limiter: could not connect to Redis, using in-memory store');
    return undefined;
  }
};

export const aiRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: DAILY_LIMIT,
  keyGenerator: (req) => req.user?.uid || req.ip,
  store: buildStore(),
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
