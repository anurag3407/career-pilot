import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri && process.env.NODE_ENV !== 'development') {
    throw new Error('MONGODB_URI is not set. Set it in your .env file before starting the server.');
  }

  const uri = mongoUri || 'mongodb://localhost:27017/careerpilot';

  console.log('📦 Connecting to MongoDB...');
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });
  console.log('📦 Connected to MongoDB');

  // Slow-query profiling is opt-in only. Set ENABLE_DB_PROFILING=true to activate.
  const enableDbProfiling = process.env.ENABLE_DB_PROFILING === 'true';
  if (process.env.NODE_ENV !== 'test' && enableDbProfiling) {
    try {
      await mongoose.connection.db.command({ profile: 1, slowms: 100 });
      console.log('📊 MongoDB profiling enabled via ENABLE_DB_PROFILING (threshold: 100ms)');
    } catch (err) {
      // Atlas free tier doesn't support setProfilingLevel — not fatal
      console.warn('⚠️  Could not enable query profiling:', err.message);
    }
  }
};
