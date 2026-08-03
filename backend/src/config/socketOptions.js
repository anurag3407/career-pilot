const DEFAULT_ALLOWED_ORIGINS = Object.freeze([
  'http://localhost:5173',
  'http://localhost:3000',
  'https://careerpilotyy.netlify.app'
]);

const normalizeOrigin = (origin) => origin.replace(/\/$/, '');

/**
 * Ordered Socket.IO transports.
 *
 * Polling must be attempted first so clients can still connect through
 * networks or proxies that reject WebSocket upgrade requests.
 */
export const SOCKET_TRANSPORTS = Object.freeze([
  'polling',
  'websocket'
]);

/**
 * Return the frontend origins supported by the REST API and Socket.IO.
 */
export const getAllowedSocketOrigins = () =>
  [
    ...new Set(
      [...DEFAULT_ALLOWED_ORIGINS, process.env.FRONTEND_URL]
        .filter(Boolean)
        .map(normalizeOrigin)
    )
  ];

/**
 * Validate a Socket.IO handshake origin.
 *
 * Requests without an Origin header are allowed for non-browser clients and
 * same-origin server-to-server requests.
 */
export const isSocketOriginAllowed = (
  origin,
  allowedOrigins = getAllowedSocketOrigins()
) => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(normalizeOrigin(origin));
};

/**
 * Build the Socket.IO server configuration.
 */
export const createSocketOptions = () => {
  const allowedOrigins = getAllowedSocketOrigins();

  return {
    cors: {
      origin: (origin, callback) => {
        if (isSocketOriginAllowed(origin, allowedOrigins)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST'],
      credentials: true
    },
    allowRequest: (req, callback) => {
      // In WebSocket upgrades, browsers send the Origin header.
      // If it's absent, we only allow it if we are accepting non-browser clients.
      // But for CSRF protection, we must enforce the allow-list.
      const origin = req.headers.origin || req.headers.referer;
      if (isSocketOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
      } else {
        callback('Not allowed by CORS: Invalid Origin', false);
      }
    },

    // Establish polling first and upgrade when WebSocket is available.
    transports: [...SOCKET_TRANSPORTS],
    allowUpgrades: true,

    pingTimeout: 60_000,
    pingInterval: 25_000
  };
};