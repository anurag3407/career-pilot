import redisClient, { isRedisReady } from '../config/redis.js';
import { getUserProfileKey, getUserStatsKey, getUserActivityKey } from './cacheKeys.js';

/**
 * Invalidate all cache keys associated with a user ID
 * @param {string} uid - User ID to invalidate
 * @returns {Promise<void>}
 */
export const invalidateUserProfileCache = async (uid) => {
  if (!uid) return;
  
  if (!isRedisReady()) {
    console.warn(`⚠️ [CACHE INVAL] Redis is unavailable. Invalidation skipped for user: ${uid}`);
    return;
  }

  const profileKey = getUserProfileKey(uid);
  const statsKey = getUserStatsKey(uid);
  const activityKey = getUserActivityKey(uid);

  try {
    const startTime = Date.now();
    // Delete all keys associated with this user
    const deletedCount = await redisClient.del(profileKey, statsKey, activityKey);
    const duration = Date.now() - startTime;

    if (deletedCount > 0) {
      console.log(`🧹 [CACHE INVAL] HIT: Invalidated ${deletedCount} key(s) for user: ${uid} in ${duration}ms`);
    } else {
      console.log(`🧹 [CACHE INVAL] MISS: No cache keys found to invalidate for user: ${uid}`);
    }
  } catch (error) {
    console.error(`❌ [CACHE INVAL ERROR] Failed to invalidate cache for user ${uid}:`, error.message);
  }
};
