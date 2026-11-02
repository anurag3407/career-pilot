import express from 'express';
import mongoose from 'mongoose';
import { getRedisConnection } from '../services/jobAlertQueue.js';

const router = express.Router();

const toMB = (bytes) => Math.round((bytes / (1024 * 1024)) * 100) / 100;

const getMongoStatus = async () => {
  try {
    const state = mongoose.connection.readyState;
    if (state !== 1 || !mongoose.connection.db) {
      return { status: 'down' };
    }

    await mongoose.connection.db.admin().ping();
    return { status: 'up' };
  } catch {
    return { status: 'down' };
  }
};

const getRedisStatus = async () => {
  try {
    const redis = getRedisConnection();
    if (!redis || redis.status !== 'ready') {
      return { status: 'down' };
    }

    await redis.ping();
    return { status: 'up' };
  } catch {
    return { status: 'down' };
  }
};

router.get('/', async (req, res) => {
  const [mongodb, redis] = await Promise.all([
    getMongoStatus(),
    getRedisStatus(),
  ]);

  const allHealthy = mongodb.status === 'up' && redis.status === 'up';
  const memoryUsage = process.memoryUsage();

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      mongodb,
      redis,
    },
    uptime: {
      seconds: Math.floor(process.uptime()),
    },
    memory: {
      rssMb: toMB(memoryUsage.rss),
      heapTotalMb: toMB(memoryUsage.heapTotal),
      heapUsedMb: toMB(memoryUsage.heapUsed),
      externalMb: toMB(memoryUsage.external),
      arrayBuffersMb: toMB(memoryUsage.arrayBuffers),
    },
    version: process.version,
  });
});

export default router;