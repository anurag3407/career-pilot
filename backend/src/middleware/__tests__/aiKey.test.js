import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const ORIG_GEMINI_KEY = process.env.GEMINI_API_KEY;
const ORIG_AI_PROVIDER = process.env.AI_PROVIDER;

describe('extractAIProvider middleware', () => {
  let extractAIProvider;

  before(async () => {
    // Set up env fallback
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.AI_PROVIDER = 'gemini';

    const mod = await import('../aiKey.js');
    extractAIProvider = mod.extractAIProvider;
  });

  after(() => {
    process.env.GEMINI_API_KEY = ORIG_GEMINI_KEY;
    process.env.AI_PROVIDER = ORIG_AI_PROVIDER;
  });

  function mockReqRes(headers = {}) {
    const state = { statusCode: 200, body: null };
    const req = {
      headers,
      aiProvider: null,
      aiProviderSource: null,
    };
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

  test('uses server env provider when no headers provided', async () => {
    const { req, res } = mockReqRes({});
    let nextCalled = false;

    await extractAIProvider(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.ok(req.aiProvider);
    assert.equal(req.aiProviderSource, 'server_env');
  });

  test('creates provider from x-ai-provider and x-ai-key headers', async () => {
    const { req, res } = mockReqRes({
      'x-ai-provider': 'gemini',
      'x-ai-key': 'user-gemini-key',
    });
    let nextCalled = false;

    await extractAIProvider(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.ok(req.aiProvider);
    assert.equal(req.aiProviderSource, 'user_header');
  });

  test('handles openrouter via x-openrouter-key header', async () => {
    const { req, res } = mockReqRes({
      'x-openrouter-key': 'or-key-123',
    });
    let nextCalled = false;

    await extractAIProvider(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.ok(req.aiProvider);
    assert.equal(req.aiProviderSource, 'user_openrouter_pkce');
  });

  test('rejects unsupported provider in header', async () => {
    const { req, res, state } = mockReqRes({
      'x-ai-provider': 'unsupported-provider',
      'x-ai-key': 'some-key',
    });

    await extractAIProvider(req, res, () => {});

    assert.equal(state.statusCode, 400);
    assert.match(state.body.error, /unsupported/i);
  });

  test('returns 403 when no key available from any source', async () => {
    // Clear env keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.GROQ_API_KEY;

    const { req, res, state } = mockReqRes({});
    await extractAIProvider(req, res, () => {});

    assert.equal(state.statusCode, 403);
    assert.match(state.body.error, /api key is required/i);

    // Restore
    process.env.GEMINI_API_KEY = geminiKey;
    if (openaiKey) process.env.OPENAI_API_KEY = openaiKey;
    if (groqKey) process.env.GROQ_API_KEY = groqKey;
  });

  test('handles model override via x-ai-model header', async () => {
    const { req, res } = mockReqRes({
      'x-ai-provider': 'gemini',
      'x-ai-key': 'key-123',
      'x-ai-model': 'gemini-2.0-flash',
    });
    let nextCalled = false;

    await extractAIProvider(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.ok(req.aiProvider);
  });
});
