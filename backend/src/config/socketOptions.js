const DEFAULT_FRONTEND_URL = 'http://localhost:5173';

/**
 * Ordered Socket.IO transports.
 *
 * Polling must be attempted first so clients can still connect through
 * networks or proxies that reject WebSocket upgrade requests.
 */
export const SOCKET_TRANSPORTS = Object.freeze(['polling', 'websocket']);

/**
 * Build the Socket.IO server configuration.
 *
 * Keeping this in a separate pure function makes the transport policy
 * independently testable without creating an HTTP or Socket.IO server.
 */
export const createSocketOptions = () => ({
  cors: {
    origin: process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },

  // Start with HTTP long-polling and upgrade only when WebSocket is available.
  transports: [...SOCKET_TRANSPORTS],
  allowUpgrades: true,

  // Preserve the existing heartbeat configuration.
  pingTimeout: 60_000,
  pingInterval: 25_000
});