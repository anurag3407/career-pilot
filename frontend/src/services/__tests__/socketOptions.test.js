import { describe, expect, it } from 'vitest';

import {
  createSocketOptions,
  SOCKET_TRANSPORTS
} from '../socketOptions.js';

describe('Socket.IO client options', () => {
  it('attempts polling before websocket', () => {
    const options = createSocketOptions('test-token');

    expect(SOCKET_TRANSPORTS).toEqual(['polling', 'websocket']);
    expect(options.transports).toEqual(['polling', 'websocket']);
  });

  it('allows websocket upgrade while keeping polling fallback', () => {
    const options = createSocketOptions('test-token');

    expect(options.upgrade).toBe(true);
    expect(options.rememberUpgrade).toBe(false);
  });

  it('uses resilient reconnection backoff', () => {
    const options = createSocketOptions('test-token');

    expect(options.reconnection).toBe(true);
    expect(options.reconnectionAttempts).toBe(Infinity);
    expect(options.reconnectionDelay).toBe(1_000);
    expect(options.reconnectionDelayMax).toBe(10_000);
    expect(options.randomizationFactor).toBe(0.5);
    expect(options.timeout).toBe(20_000);
  });

  it('includes the Firebase token in the socket handshake', () => {
    const options = createSocketOptions('firebase-token');

    expect(options.auth).toEqual({
      token: 'firebase-token'
    });
  });

  it('returns a new transports array for each client', () => {
    const firstOptions = createSocketOptions('first-token');
    const secondOptions = createSocketOptions('second-token');

    expect(firstOptions.transports).not.toBe(secondOptions.transports);
    expect(firstOptions.transports).toEqual(secondOptions.transports);
  });
});