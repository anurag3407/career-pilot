import { describe, test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

const ORIG_GITHUB_TOKEN = process.env.GITHUB_TOKEN;

describe('githubKey middleware', () => {
  let extractGithubToken, requireGithubToken;

  before(async () => {
    process.env.GITHUB_TOKEN = 'env-fallback-token';
    const mod = await import('../githubKey.js');
    extractGithubToken = mod.extractGithubToken;
    requireGithubToken = mod.requireGithubToken;
  });

  after(() => {
    process.env.GITHUB_TOKEN = ORIG_GITHUB_TOKEN;
  });

  function mockReqRes(headers = {}, user = null) {
    const state = { statusCode: 200, body: null };
    const req = { headers, user, githubToken: null, githubAuthMode: null };
    const res = {
      status(code) {
        state.statusCode = code;
        return this;
      },
      json(body) {
        state.body = body;
        return this;
      },
    };
    return { req, res, state };
  }

  test('uses X-GitHub-Token header (PAT) when provided', async () => {
    const { req, res } = mockReqRes({ 'x-github-token': 'pat-token-123' });
    let nextCalled = false;

    await extractGithubToken(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(req.githubToken, 'pat-token-123');
    assert.equal(req.githubAuthMode, 'pat');
  });

  test('falls back to GITHUB_TOKEN env var when no header provided', async () => {
    const { req, res } = mockReqRes({});
    let nextCalled = false;

    await extractGithubToken(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(req.githubToken, 'env-fallback-token');
    assert.equal(req.githubAuthMode, 'env');
  });

  test('returns null token in public mode when no env var', async () => {
    delete process.env.GITHUB_TOKEN;
    const { req, res } = mockReqRes({});
    let nextCalled = false;

    await extractGithubToken(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(req.githubToken, null);
    assert.equal(req.githubAuthMode, 'public');

    process.env.GITHUB_TOKEN = 'env-fallback-token';
  });

  test('requireGithubToken rejects request with 403 when no token', async () => {
    delete process.env.GITHUB_TOKEN;
    const { req, res, state } = mockReqRes({});

    await requireGithubToken(req, res, () => {});

    assert.equal(state.statusCode, 403);
    assert.match(state.body.error, /github token is required/i);
    assert.equal(state.body.requireGithubToken, true);

    process.env.GITHUB_TOKEN = 'env-fallback-token';
  });

  test('requireGithubToken passes when token exists', async () => {
    const { req, res } = mockReqRes({ 'x-github-token': 'valid-pat' });
    let nextCalled = false;

    await requireGithubToken(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(req.githubToken, 'valid-pat');
  });
});
