/**
 * Start with HTTP long-polling so the application remains usable when
 * corporate proxies or firewalls reject WebSocket upgrades.
 */
export const SOCKET_TRANSPORTS = Object.freeze(['polling', 'websocket']);

export const createSocketOptions = (token) => ({
  auth: { token },

  // Establish a reliable polling connection first.
  transports: [...SOCKET_TRANSPORTS],

  // Upgrade to WebSocket whenever the network permits it.
  upgrade: true,

  // Never skip the polling handshake based on a previous successful upgrade.
  // A user may have moved to a different or more restrictive network.
  rememberUpgrade: false,

  reconnection: true,

  // Continue retrying while the application remains open.
  reconnectionAttempts: Infinity,

  // Socket.IO applies exponential backoff and jitter between attempts.
  reconnectionDelay: 1_000,
  reconnectionDelayMax: 10_000,
  randomizationFactor: 0.5,

  // Give slower corporate proxies enough time to complete polling handshakes.
  timeout: 20_000
});