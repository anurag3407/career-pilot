import { describe, test, expect, vi, beforeEach } from 'vitest';
import { d1Auth, d1Fetch, getD1AccessToken, isD1Configured } from '../config/d1';

describe('Cloudflare D1 client & auth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('isD1Configured defaults to true', () => {
    expect(isD1Configured).toBe(true);
  });

  test('signUp stores session and exposes access token', async () => {
    const mockSession = {
      access_token: 'jwt-token-123',
      token_type: 'bearer',
      expires_at: new Date(Date.now() + 3600_000).toISOString(),
      user: { id: 'u1', uid: 'u1', email: 'ada@example.com', displayName: 'Ada' },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ success: true, user: mockSession.user, session: mockSession }),
      })
    );

    const res = await d1Auth.signUp({
      email: 'ada@example.com',
      password: 'password123',
      options: { data: { full_name: 'Ada' } },
    });

    expect(res.error).toBeNull();
    expect(res.data.session.access_token).toBe('jwt-token-123');
    expect(await getD1AccessToken()).toBe('jwt-token-123');
  });

  test('d1Fetch attaches Bearer token and throws on non-ok status', async () => {
    localStorage.setItem(
      'careerpilot:d1:session',
      JSON.stringify({
        access_token: 'jwt-abc',
        expires_at: new Date(Date.now() + 3600_000).toISOString(),
        user: { id: 'u1' },
      })
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, resumes: [{ id: 'r1', title: 'CV' }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const data = await d1Fetch('/db/resumes', { method: 'GET', requireAuth: true });
    expect(data.resumes).toHaveLength(1);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer jwt-abc');
  });

  test('signOut clears session', async () => {
    localStorage.setItem(
      'careerpilot:d1:session',
      JSON.stringify({ access_token: 'jwt-abc', user: { id: 'u1' } })
    );
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true }) })
    );

    await d1Auth.signOut();
    expect(await getD1AccessToken()).toBeNull();
  });
});
