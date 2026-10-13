import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    }),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('API Service', () => {
  let api;

  beforeEach(async () => {
    vi.clearAllMocks();
    api = await import('../services/api.js');
  });

  test('exports API modules', () => {
    expect(api.authApi).toBeDefined();
    expect(api.resumeApi).toBeDefined();
  });

  test('exports api helper functions', () => {
    // Check for common API export patterns
    const exports = Object.keys(api);
    expect(exports.length).toBeGreaterThan(0);
  });
});
