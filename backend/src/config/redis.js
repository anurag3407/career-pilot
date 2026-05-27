import Redis from 'ioredis';

let redisClient = null;

if (!process.env.REDIS_URL) {
  console.log('ℹ️  REDIS_URL not configured - API caching layer disabled');
} else {
  console.log('🔄 Initializing Redis connection...');
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        // Graceful exponential backoff with max 2 seconds delay
        const delay = Math.min(times * 100, 2000);
        return delay;
      },
      connectTimeout: 5000, // Fail fast on slow networks
    });

    redisClient.on('connect', () => {
      console.log('🔌 Redis connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client is ready and connected!');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis client connection error:', err.message);
    });

    redisClient.on('close', () => {
      console.warn('⚠️ Redis client connection closed');
    });

    redisClient.on('reconnecting', (time) => {
      console.log(`🔄 Redis client reconnecting... Attempt delay: ${time}ms`);
    });

    redisClient.on('end', () => {
      console.error('🛑 Redis connection ended');
    });
  } catch (error) {
    console.error('❌ Failed to construct Redis client:', error.message);
  }
}

/**
 * Helper to check if Redis is active and usable
 * @returns {boolean}
 */
export const isRedisReady = () => {
  return !!(redisClient && redisClient.status === 'ready');
};

export default redisClient;
