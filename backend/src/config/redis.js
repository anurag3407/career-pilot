import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { RedisMemoryServer } from 'redis-memory-server';

dotenv.config();

if (process.env.NODE_ENV === 'development') {
    const url = process.env.REDIS_URL;
    if (!url || url.includes('localhost') || url.includes('127.0.0.1')) {
        console.log('🔄 Starting redis-memory-server to satisfy localhost REDIS_URL...');
        (async () => {
            try {
                const redisServer = new RedisMemoryServer();
                const host = await redisServer.getHost();
                const port = await redisServer.getPort();
                process.env.REDIS_URL = `redis://${host}:${port}`;
                console.log(`✅ redis-memory-server running at ${process.env.REDIS_URL}`);
            } catch (e) {
                console.warn('⚠️ Could not start redis-memory-server:', e.message);
            }
        })();
    }
}

export class RedisManager {
  constructor() {
    this.connections = new Map();
    this.workers = new Map();
    this._shuttingDown = false;
  }

  _createClient(name, extraOpts = {}) {
    const url = process.env.REDIS_URL;
    if (!url) return null;

    const client = new IORedis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (this._shuttingDown) return null;
        if (times > 10) {
          console.warn(`⚠️ Redis [${name}]: giving up after ${times} retries`);
          return null;
        }
        return Math.min(times * 300, 3000);
      },
      ...extraOpts,
    });

    client.on('error', (err) => {
      console.error(`❌ Redis [${name}]: ${err.message}`);
    });

    client.on('close', () => {
      if (!this._shuttingDown) {
        console.log(`ℹ️ Redis [${name}]: connection closed`);
      }
    });

    client.on('reconnecting', () => {
      console.log(`ℹ️ Redis [${name}]: reconnecting...`);
    });

    return client;
  }

  get(name, extraOpts = {}) {
    const existing = this.connections.get(name);
    if (existing) {
      const s = existing.client.status;
      if (s === 'ready' || s === 'connect' || s === 'connecting' || s === 'reconnecting') {
        existing.status = s === 'ready' ? 'connected' : 'connecting';
        return existing.client;
      }
      // Dead connection — close and replace
      existing.client.disconnect();
      this.connections.delete(name);
    }

    const client = this._createClient(name, extraOpts);
    if (!client) return null;

    this.connections.set(name, { client, status: 'connecting' });
    return client;
  }

  async waitForReady(name, timeoutMs = 8000) {
    const entry = this.connections.get(name);
    if (!entry) return null;
    if (entry.status === 'connected' && entry.client.status === 'ready') {
      return entry.client;
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Redis [${name}] connection timeout`)), timeoutMs);
      const client = entry.client;

      if (client.status === 'ready') {
        clearTimeout(timer);
        entry.status = 'connected';
        return resolve(client);
      }

      const onReady = () => {
        clearTimeout(timer);
        client.off('error', onError);
        entry.status = 'connected';
        resolve(client);
      };
      const onError = (err) => {
        clearTimeout(timer);
        client.off('ready', onReady);
        entry.status = 'failed';
        reject(err);
      };

      client.once('ready', onReady);
      client.once('error', onError);
    });
  }

  getWorkerConnection(name) {
    return this.get(`worker:${name}`, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  registerWorker(name, worker) {
    this.workers.set(name, worker);
  }

  unregisterWorker(name) {
    this.workers.delete(name);
  }

  isHealthy(name) {
    const entry = this.connections.get(name);
    return !!(entry && entry.client && entry.client.status === 'ready');
  }

  async close(name) {
    const entry = this.connections.get(name);
    if (!entry) return;
    try {
      await entry.client.quit();
    } catch {
      entry.client.disconnect();
    }
    this.connections.delete(name);
  }

  async shutdown() {
    this._shuttingDown = true;
    console.log('\n🔌 Shutting down Redis connections...');

    for (const [name, worker] of this.workers) {
      try {
        await worker.close();
        console.log(`  ✅ Worker "${name}" closed`);
      } catch {
        console.warn(`  ⚠️ Worker "${name}" close failed`);
      }
    }
    this.workers.clear();

    const names = Array.from(this.connections.keys());
    await Promise.allSettled(names.map((n) => this.close(n)));
    console.log('✅ All Redis connections closed\n');
  }
}

const redisManager = new RedisManager();
export default redisManager;
