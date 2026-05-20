import redisClient, { isRedisReady } from '../config/redis.js';
import { 
  getUserProfileKey, 
  getUserStatsKey, 
  getUserActivityKey, 
  getJobsKey, 
  getVerbListsKey 
} from '../utils/cacheKeys.js';

/**
 * Automatically resolve the correct cache key based on the request route and details
 * @param {object} req - Express request object
 * @returns {string}
 */
const resolveCacheKey = (req) => {
  const urlPath = req.originalUrl || req.url;

  // 1. Job search listings
  if (urlPath.includes('/api/fetchjobs') || urlPath.includes('/jobs')) {
    return getJobsKey(req.query);
  }

  // 2. AI Verb lists
  if (urlPath.includes('/api/enhance/verb-lists')) {
    return getVerbListsKey();
  }

  // 3. User profiles
  if (urlPath.includes('/api/user-profiles')) {
    const uid = req.params.uid || (req.user && req.user.uid);
    if (uid) {
      if (urlPath.endsWith('/stats')) {
        return getUserStatsKey(uid);
      }
      if (urlPath.endsWith('/activity')) {
        return getUserActivityKey(uid);
      }
      return getUserProfileKey(uid);
    }
  }

  // 4. Default generic fallback
  return `cache:generic:${urlPath}`;
};

/**
 * Reusable Express Caching Middleware
 * @param {number} ttl - Time-to-live in seconds
 * @returns {Function} Express middleware function
 */
export const cache = (ttl) => {
  return async (req, res, next) => {
    // Restriction: Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Graceful connection fallback: Skip caching if Redis is offline
    if (!isRedisReady()) {
      res.setHeader('X-Cache', 'BYPASS-OFFLINE');
      return next();
    }

    const key = resolveCacheKey(req);
    const startTime = Date.now();

    try {
      // 1. Check if cached data exists in Redis
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        const duration = Date.now() - startTime;
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Content-Type', 'application/json');
        
        console.log(`🚀 [CACHE HIT] Key: ${key} | Timing: ${duration}ms`);
        return res.send(cachedData);
      }

      // 2. Cache MISS: Intercept response to store the data once resolved
      res.setHeader('X-Cache', 'MISS');
      const originalSend = res.send;

      res.send = function (body) {
        // Restore standard res.send method
        res.send = originalSend;

        // Cache only successful 2xx responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const bodyToCache = typeof body === 'string' ? body : JSON.stringify(body);
            
            // Set async cache without blocking HTTP response lifecycle
            redisClient.set(key, bodyToCache, 'EX', ttl).catch((err) => {
              console.error(`❌ [CACHE WRITE ERROR] Failed to cache key: ${key}:`, err.message);
            });
          } catch (err) {
            console.error(`❌ [CACHE STR ERROR] Failed to stringify cache body for key: ${key}:`, err.message);
          }
        }

        const duration = Date.now() - startTime;
        console.log(`⚡ [CACHE MISS] Key: ${key} | Timing: ${duration}ms`);

        return originalSend.apply(res, arguments);
      };

      next();
    } catch (error) {
      console.error(`❌ [CACHE MIDDLEWARE ERROR] Skipping cache for key: ${key}:`, error.message);
      // Fail gracefully: continue processing request
      next();
    }
  };
};

export default cache;
