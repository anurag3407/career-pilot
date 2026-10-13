import mongoose from 'mongoose';

let eventListenersAttached = false;

function setupConnectionEvents() {
  if (eventListenersAttached) return;

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected. Reconnecting...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB Reconnected successfully.');
  });

  eventListenersAttached = true;
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  setupConnectionEvents();

  const mongoUri = process.env.MONGODB_URI;
  const env = process.env.NODE_ENV || 'development';

  if (!mongoUri && env !== 'development') {
    throw new Error('MONGODB_URI is not set. Set it in your .env file before starting the server.');
  }

  const uri = mongoUri || 'mongodb://localhost:27017/careerpilot';
  const autoIndex = process.env.DB_AUTO_INDEX
    ? process.env.DB_AUTO_INDEX === 'true'
    : env !== 'production';

  const maxPoolSize = parseInt(process.env.DB_MAX_POOL_SIZE, 10) || (env === 'production' ? 50 : 10);
  const minPoolSize = parseInt(process.env.DB_MIN_POOL_SIZE, 10) || (env === 'production' ? 5 : 2);

  console.log(`📦 Connecting to MongoDB (${env})...`);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize,
    minPoolSize,
    autoIndex,
  });
  console.log(`📦 Connected to MongoDB (poolSize: ${minPoolSize}-${maxPoolSize}, autoIndex: ${autoIndex})`);

  // Slow-query profiling is opt-in only. Set ENABLE_DB_PROFILING=true to activate.
  const enableDbProfiling = process.env.ENABLE_DB_PROFILING === 'true';
  if (env !== 'test' && enableDbProfiling) {
    try {
      await mongoose.connection.db.command({ profile: 1, slowms: 100 });
      console.log('📊 MongoDB profiling enabled via ENABLE_DB_PROFILING (threshold: 100ms)');
    } catch (err) {
      console.warn('⚠️  Could not enable query profiling:', err.message);
    }
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(false);
    console.log('📦 Disconnected from MongoDB');
  }
};

export const checkDBHealth = async () => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  if (state !== 1) {
    return { ok: false, state: states[state] || 'unknown', latencyMs: null };
  }

  const start = Date.now();
  try {
    await mongoose.connection.db.admin().ping();
    return { ok: true, state: 'connected', latencyMs: Date.now() - start };
  } catch (err) {
    return { ok: false, state: 'error', error: err.message, latencyMs: Date.now() - start };
  }
};

/**
 * Helper to run a callback inside a MongoDB transaction session with automatic rollback on error.
 */
export const withTransaction = async (fn) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

