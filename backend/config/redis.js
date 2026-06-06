// backend/config/redis.js
// Simple Redis client configuration for BullMQ

const IORedis = require('ioredis');

// In development we can use default localhost:6379
// In production this should be configured via env vars.
const redis = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

module.exports = redis;
