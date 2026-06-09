const redis = require("redis");
const crypto = require("crypto");

const SESSION_TTL = 3600;
let client = null;
let connectionPromise = null;

/**
 * Initializes and returns the Redis client (singleton with race condition guard).
 * @returns {Promise<RedisClient>}
 */
async function getRedisClient() {
  if (client) return client;
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    const newClient = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    newClient.on("error", (err) => {
      console.error("[SessionManager] Redis Client Error:", err);
    });
    await newClient.connect();
    client = newClient;
    connectionPromise = null;
    return client;
  })();

  return connectionPromise;
}

/**
 * Creates a new session for a given user ID.
 * @param {string} userId - The user's unique identifier.
 * @param {Object} [metadata={}] - Optional metadata to store with the session.
 * @returns {Promise<string>} The generated session token.
 */
async function createSession(userId, metadata = {}) {
  if (!userId) throw new Error("userId is required to create a session");

  if (typeof metadata !== "object" || metadata === null || Array.isArray(metadata)) {
    throw new Error("metadata must be a plain object");
  }

  const redisClient = await getRedisClient();
  const token = crypto.randomBytes(32).toString("hex");

  // Spread metadata FIRST so userId and createdAt cannot be overridden
  const sessionData = JSON.stringify({
    ...metadata,
    userId,
    createdAt: Date.now(),
  });

  await redisClient.set(`session:${token}`, sessionData, { EX: SESSION_TTL });
  return token;
}

/**
 * Validates a session token and returns the session data.
 * @param {string} token - The session token to validate.
 * @returns {Promise<Object>} The session data object.
 * @throws {Error} If the session is invalid, expired, or data is corrupted.
 */
async function validateSession(token) {
  if (!token) throw new Error("Token is required for validation");
  const redisClient = await getRedisClient();
  const data = await redisClient.get(`session:${token}`);
  if (!data) throw new Error("Session not found or has expired");

  try {
    return JSON.parse(data);
  } catch {
    throw new Error("Session data is corrupted");
  }
}

/**
 * Invalidates (deletes) a session by its token.
 * @param {string} token - The session token to invalidate.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 */
async function invalidateSession(token) {
  if (!token) throw new Error("Token is required for invalidation");
  const redisClient = await getRedisClient();
  const deleted = await redisClient.del(`session:${token}`);
  return deleted === 1;
}

/**
 * Extends the TTL of an existing session (sliding expiry).
 * @param {string} token - The session token to refresh.
 * @returns {Promise<boolean>} True if refreshed, false if session not found.
 */
async function refreshSession(token) {
  if (!token) throw new Error("Token is required to refresh session");
  const redisClient = await getRedisClient();
  const result = await redisClient.expire(`session:${token}`, SESSION_TTL);
  return result === 1;
}

/**
 * Gracefully disconnects the Redis client.
 * @returns {Promise<void>}
 */
async function disconnect() {
  if (client) {
    await client.quit();
    client = null;
    connectionPromise = null;
  }
}

module.exports = { createSession, validateSession, invalidateSession, refreshSession, disconnect };
