import {
  afterEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import {
  createSocketOptions,
  SOCKET_TRANSPORTS
} from '../socketOptions.js';

const getAuthPayload = (options) =>
  new Promise((resolve) => {
    options.auth(resolve);
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Socket.IO client options', () => {
  it('attempts polling before websocket', () => {
    const options = createSocketOptions(
      async () => 'test-token'
    );

    expect(SOCKET_TRANSPORTS).toEqual([
      'polling',
      'websocket'
    ]);

    expect(options.transports).toEqual([
      'polling',
      'websocket'
    ]);
  });

  it('allows websocket upgrade while keeping polling fallback', () => {
    const options = createSocketOptions(
      async () => 'test-token'
    );

    expect(options.upgrade).toBe(true);
    expect(options.rememberUpgrade).toBe(false);
  });

  it('uses resilient reconnection backoff', () => {
    const options = createSocketOptions(
      async () => 'test-token'
    );

    expect(options.reconnection).toBe(true);
    expect(options.reconnectionAttempts).toBe(
      Infinity
    );

    expect(options.reconnectionDelay).toBe(1_000);
    expect(options.reconnectionDelayMax).toBe(
      10_000
    );

    expect(options.randomizationFactor).toBe(0.5);
    expect(options.timeout).toBe(20_000);
  });

  it('includes the latest Firebase token in the handshake', async () => {
    const getToken = vi
      .fn()
      .mockResolvedValue('firebase-token');

    const options = createSocketOptions(getToken);

    await expect(
      getAuthPayload(options)
    ).resolves.toEqual({
      token: 'firebase-token'
    });

    expect(getToken).toHaveBeenCalledTimes(1);
  });

  it('requests a fresh token for each handshake', async () => {
    const getToken = vi
      .fn()
      .mockResolvedValueOnce('first-token')
      .mockResolvedValueOnce('second-token');

    const options = createSocketOptions(getToken);

    await expect(
      getAuthPayload(options)
    ).resolves.toEqual({
      token: 'first-token'
    });

    await expect(
      getAuthPayload(options)
    ).resolves.toEqual({
      token: 'second-token'
    });

    expect(getToken).toHaveBeenCalledTimes(2);
  });

  it('handles token refresh failure safely', async () => {
    vi.spyOn(console, 'error').mockImplementation(
      () => {}
    );

    const getToken = vi
      .fn()
      .mockRejectedValue(
        new Error('token refresh failed')
      );

    const options = createSocketOptions(getToken);

    await expect(
      getAuthPayload(options)
    ).resolves.toEqual({
      token: null
    });
  });

  it('returns a new transports array for each client', () => {
    const firstOptions = createSocketOptions(
      async () => 'first-token'
    );

    const secondOptions = createSocketOptions(
      async () => 'second-token'
    );

    expect(firstOptions.transports).not.toBe(
      secondOptions.transports
    );

    expect(firstOptions.transports).toEqual(
      secondOptions.transports
    );
  });
});