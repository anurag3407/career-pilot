import test from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import crypto from 'crypto';

// Import models and services to mock
import ProjectAnalysis from '../../models/ProjectAnalysis.model.js';
import RepoAnalysisHistory from '../../models/RepoAnalysisHistory.model.js';
import socketConfig from '../../config/socket.js';
import webhookRouter, { services } from '../webhooks.js';

// Setup environment variable for test secret
process.env.GITHUB_WEBHOOK_SECRET = 'test-secret';

// Helper to create mock response
const createMockResponse = () => {
  const res = {
    statusCode: 200,
    body: null,
    headersSent: false,
    status: mock.fn((code) => {
      res.statusCode = code;
      return res;
    }),
    json: mock.fn((data) => {
      res.body = data;
      res.headersSent = true;
      return res;
    })
  };
  return res;
};

test('GitHub Webhook - ping event returns success', async () => {
  const payload = { zen: 'test-zen-string', hook_id: 12345 };
  const rawBody = Buffer.from(JSON.stringify(payload));
  const req = {
    method: 'POST',
    url: '/github',
    headers: {
      'x-github-event': 'ping',
      'x-hub-signature-256': 'sha256=' + crypto.createHmac('sha256', 'test-secret').update(rawBody).digest('hex')
    },
    body: payload,
    rawBody
  };
  const res = createMockResponse();
  const next = mock.fn();

  await webhookRouter(req, res, next);

  assert.strictEqual(res.statusCode, 200);
  assert.deepEqual(res.body, { success: true, message: 'pong' });
});

test('GitHub Webhook - invalid signature returns 401', async () => {
  const payload = { zen: 'test' };
  const rawBody = Buffer.from(JSON.stringify(payload));
  const req = {
    method: 'POST',
    url: '/github',
    headers: {
      'x-github-event': 'ping',
      'x-hub-signature-256': 'sha256=invalid-signature-hash-here'
    },
    body: payload,
    rawBody
  };
  const res = createMockResponse();
  const next = mock.fn();

  await webhookRouter(req, res, next);

  assert.strictEqual(res.statusCode, 401);
  assert.deepEqual(res.body, { error: 'Invalid signature' });
});

test('GitHub Webhook - push event with matching repo triggers background scan', async () => {
  const repoUrl = 'https://github.com/test-owner/test-repo';
  const userId = 'user-123';

  // Mock database find call
  const mockFind = mock.method(ProjectAnalysis, 'find', async () => {
    return [
      {
        _id: 'analysis-123',
        userId,
        repoUrl,
        status: 'complete',
        save: mock.fn(async () => {})
      }
    ];
  });

  // Mock socket.js getIO
  const mockEmit = mock.fn();
  const mockTo = mock.fn(() => ({ emit: mockEmit }));
  const mockGetIO = mock.method(socketConfig, 'getIO', () => {
    return { to: mockTo };
  });

  // Mock services
  const mockAnalyzeRepo = mock.method(services, 'analyzeRepo', async () => {
    return {
      stats: { totalFiles: 5, totalLOC: 100 },
      modules: [],
      fileGraph: {},
      moduleGraph: {},
      risks: [],
      skeleton: 'Skeleton text',
      dependencies: {}
    };
  });

  const mockEnrich = mock.method(services, 'enrichWithGitHubData', async () => {
    return {
      metadata: { stars: 10, forks: 2 },
      contributors: [],
      recentCommits: []
    };
  });

  // Mock AI summary generators (non-blocking)
  const mockArch = mock.method(services, 'generateArchitectureSummary', async () => 'arch');
  const mockSug = mock.method(services, 'generateSuggestions', async () => []);

  // Mock RepoAnalysisHistory update
  const mockHistoryUpdate = mock.method(RepoAnalysisHistory, 'findOneAndUpdate', async () => {});

  const payload = {
    repository: {
      html_url: repoUrl
    }
  };

  const rawBody = Buffer.from(JSON.stringify(payload));
  const req = {
    method: 'POST',
    url: '/github',
    headers: {
      'x-github-event': 'push',
      'x-hub-signature-256': 'sha256=' + crypto.createHmac('sha256', 'test-secret').update(rawBody).digest('hex')
    },
    body: payload,
    rawBody
  };

  const res = createMockResponse();
  const next = mock.fn();

  await webhookRouter(req, res, next);

  // Endpoint should respond with 202 immediately
  assert.strictEqual(res.statusCode, 202);
  assert.strictEqual(res.body.success, true);

  // Wait for background promises execution to complete
  await new Promise(resolve => setTimeout(resolve, 50));

  // Verify DB Find was called correctly
  assert.strictEqual(mockFind.mock.calls.length, 1);

  // Verify analysis was triggered
  assert.strictEqual(mockAnalyzeRepo.mock.calls.length, 1);
  assert.strictEqual(mockEnrich.mock.calls.length, 1);

  // Cleanup mocks
  mockFind.mock.restore();
  mockGetIO.mock.restore();
  mockAnalyzeRepo.mock.restore();
  mockEnrich.mock.restore();
  mockArch.mock.restore();
  mockSug.mock.restore();
  mockHistoryUpdate.mock.restore();
});

test('GitHub Webhook - fails closed in production when GITHUB_WEBHOOK_SECRET is missing', async () => {
  const originalSecret = process.env.GITHUB_WEBHOOK_SECRET;
  const originalNodeEnv = process.env.NODE_ENV;
  delete process.env.GITHUB_WEBHOOK_SECRET;
  process.env.NODE_ENV = 'production';

  try {
    const req = {
      method: 'POST',
      url: '/github',
      headers: {
        'x-github-event': 'ping'
      },
      body: { zen: 'test' }
    };
    const res = createMockResponse();
    const next = mock.fn();

    await webhookRouter(req, res, next);

    assert.strictEqual(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'Invalid signature' });
  } finally {
    process.env.GITHUB_WEBHOOK_SECRET = originalSecret;
    process.env.NODE_ENV = originalNodeEnv;
  }
});
