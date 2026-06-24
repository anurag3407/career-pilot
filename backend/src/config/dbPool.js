const mongoose = require("mongoose");

/**
 * Connection pool configuration options.
 */
const POOL_CONFIG = {
  maxPoolSize: 10,
  minPoolSize: 2,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
};

let isConnected = false;

/**
 * Connects to MongoDB with connection pooling.
 * Reuses existing connection if already established.
 * @returns {Promise<mongoose.Connection>} The active mongoose connection.
 * @throws {Error} If MONGODB_URI is not set or connection fails.
 */
async function connectDB() {
  if (isConnected) {
    console.log("[DBPool] Reusing existing MongoDB connection");
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    await mongoose.connect(uri, POOL_CONFIG);
    isConnected = true;
    console.log("[DBPool] MongoDB connected with connection pooling");
    return mongoose.connection;
  } catch (error) {
    isConnected = false;
    console.error("[DBPool] MongoDB connection error:", error.message);
    throw error;
  }
}

/**
 * Returns the current connection pool status.
 * @returns {Object} Pool status including state and pool size config.
 */
function getPoolStatus() {
  const state = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  return {
    state: states[state] || "unknown",
    maxPoolSize: POOL_CONFIG.maxPoolSize,
    minPoolSize: POOL_CONFIG.minPoolSize,
  };
}

/**
 * Gracefully disconnects from MongoDB.
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log("[DBPool] MongoDB disconnected");
}

mongoose.connection.on("error", (err) => {
  console.error("[DBPool] MongoDB runtime error:", err.message);
  isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  console.warn("[DBPool] MongoDB disconnected unexpectedly");
  isConnected = false;
});

module.exports = { connectDB, disconnectDB, getPoolStatus };
