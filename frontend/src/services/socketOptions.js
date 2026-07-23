/**
 * Start with HTTP long-polling so the application remains usable when
 * corporate proxies or firewalls reject WebSocket upgrades.
 */
export const SOCKET_TRANSPORTS = Object.freeze([
  'polling',
  'websocket'
]);

export const createSocketOptions = (getToken) => ({
  /**
   * Socket.IO calls this function for each namespace handshake, including
   * reconnects. Fetching the token here prevents expired Firebase tokens from
   * being reused indefinitely.
   */
  auth: (callback) => {
    Promise.resolve()
      .then(() => getToken())
      .then((token) => {
        callback({ token });
      })
      .catch((error) => {
        console.error(
          'Unable to refresh Socket.IO authentication:',
          error instanceof Error
            ? error.message
            : String(error)
        );

        callback({ token: null });
      });
  },

  transports: [...SOCKET_TRANSPORTS],
  upgrade: true,
  rememberUpgrade: false,

  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1_000,
  reconnectionDelayMax: 10_000,
  randomizationFactor: 0.5,
  timeout: 10_000
});