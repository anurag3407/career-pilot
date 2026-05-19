import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpilot';

  console.log('📦 Connecting to MongoDB...');
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });
  console.log('📦 Connected to MongoDB');

  // Enable slow-query profiling (level 1 = queries > slowms threshold)
  if (process.env.NODE_ENV !== 'test') {
    try {
      await mongoose.connection.db.command({ profile: 1, slowms: 100 });
      console.log('📊 MongoDB profiling enabled (threshold: 100ms)');
    } catch (err) {
      // Atlas free tier doesn't support setProfilingLevel — not fatal
      console.warn('⚠️  Could not enable query profiling:', err.message);
    }
  }
};
