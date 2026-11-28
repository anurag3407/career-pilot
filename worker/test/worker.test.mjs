import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import worker from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createD1Adapter(sqlite) {
  const wrapStmt = (sql, params = []) => ({
    bind(...args) {
      return wrapStmt(sql, args);
    },
    async first() {
      const stmt = sqlite.prepare(sql);
      const row = stmt.get(...params);
      return row ?? null;
    },
    async all() {
      const stmt = sqlite.prepare(sql);
      const results = stmt.all(...params);
      return { results };
    },
    async run() {
      const stmt = sqlite.prepare(sql);
      const info = stmt.run(...params);
      return { success: true, meta: { changes: info.changes } };
    },
  });

  return {
    prepare(sql) {
      return wrapStmt(sql);
    },
  };
}

function setupEnv() {
  const sqlite = new DatabaseSync(':memory:');
  const mig1 = fs.readFileSync(path.join(__dirname, '../migrations/0001_initial_schema.sql'), 'utf8');
  const mig2 = fs.readFileSync(path.join(__dirname, '../migrations/0002_unified_d1_platform.sql'), 'utf8');
  sqlite.exec(mig1);
  sqlite.exec(mig2);
  return {
    DB: createD1Adapter(sqlite),
    AUTH_SECRET: 'test-auth-secret-123456',
    ADMIN_EMAILS: 'admin@careerpilot.test',
    ALLOWED_ORIGINS: '*',
  };
}

async function call(env, routePath, { method = 'GET', body, token, headers: extraHeaders = {} } = {}) {
  const headers = { 'CF-Connecting-IP': '127.0.0.1', ...extraHeaders };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const req = new Request(`https://gateway.test/gateway${routePath}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const res = await worker.fetch(req, env);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

describe('CareerPilot D1 Gateway — End-to-End', () => {
  let env;
  let userToken;
  let userId;
  let otherToken;

  before(() => {
    env = setupEnv();
  });

  test('GET /v1/health reports D1 ready and table count', async () => {
    const res = await call(env, '/v1/health');
    assert.equal(res.status, 200);
    assert.equal(res.data.ok, true);
    assert.equal(res.data.database, 'cloudflare-d1');
    assert.equal(res.data.d1, true);
    assert.ok(res.data.tables >= 15);
  });

  test('Auth signup, login, me, and logout lifecycle', async () => {
    // Signup
    const signup = await call(env, '/v1/auth/signup', {
      method: 'POST',
      body: { email: 'pilot@careerpilot.test', password: 'password123', fullName: 'Ada Pilot' },
    });
    assert.equal(signup.status, 201);
    assert.ok(signup.data.session?.access_token);
    assert.equal(signup.data.user.email, 'pilot@careerpilot.test');
    assert.equal(signup.data.user.displayName, 'Ada Pilot');
    userToken = signup.data.session.access_token;
    userId = signup.data.user.id;

    // Duplicate email rejected
    const dup = await call(env, '/v1/auth/signup', {
      method: 'POST',
      body: { email: 'pilot@careerpilot.test', password: 'password123' },
    });
    assert.equal(dup.status, 409);

    // Wrong password rejected
    const badLogin = await call(env, '/v1/auth/login', {
      method: 'POST',
      body: { email: 'pilot@careerpilot.test', password: 'wrong' },
    });
    assert.equal(badLogin.status, 401);

    // Valid login
    const login = await call(env, '/v1/auth/login', {
      method: 'POST',
      body: { email: 'pilot@careerpilot.test', password: 'password123' },
    });
    assert.equal(login.status, 200);
    assert.ok(login.data.session?.access_token);
    userToken = login.data.session.access_token;

    // /v1/auth/me
    const me = await call(env, '/v1/auth/me', { token: userToken });
    assert.equal(me.status, 200);
    assert.equal(me.data.user.id, userId);

    // Create second user for tenant isolation tests
    const other = await call(env, '/v1/auth/signup', {
      method: 'POST',
      body: { email: 'other@careerpilot.test', password: 'password123', fullName: 'Other User' },
    });
    assert.equal(other.status, 201);
    otherToken = other.data.session.access_token;
  });

  test('Profile update, avatar, stats, and activity', async () => {
    const upd = await call(env, '/v1/db/profiles/me', {
      method: 'PUT',
      token: userToken,
      body: { displayName: 'Ada Lovelace', jobRole: 'Staff Engineer', skills: ['SQL', 'Workers'] },
    });
    assert.equal(upd.status, 200);
    assert.equal(upd.data.profile.displayName, 'Ada Lovelace');
    assert.deepEqual(upd.data.profile.skills, ['SQL', 'Workers']);

    const av = await call(env, '/v1/db/profiles/me/avatar', {
      method: 'POST',
      token: userToken,
      body: { avatarUrl: 'https://ik.imagekit.io/demo/avatar.png' },
    });
    assert.equal(av.status, 200);
    assert.equal(av.data.profile.photoURL, 'https://ik.imagekit.io/demo/avatar.png');
  });

  test('Resumes, versions, ATS history, and tenant isolation', async () => {
    const created = await call(env, '/v1/db/resumes', {
      method: 'POST',
      token: userToken,
      body: { title: 'Platform Engineer CV', targetRole: 'Staff Engineer', summary: 'Built edge systems' },
    });
    assert.equal(created.status, 200);
    const resumeId = created.data.resume.id;
    assert.equal(created.data.resume.title, 'Platform Engineer CV');

    // Read-merge-write partial update
    const updated = await call(env, `/v1/db/resumes/${resumeId}`, {
      method: 'PUT',
      token: userToken,
      body: { sectionOrder: ['summary', 'experience'] },
    });
    assert.equal(updated.status, 200);
    assert.deepEqual(updated.data.resume.sectionOrder, ['summary', 'experience']);
    assert.equal(updated.data.resume.title, 'Platform Engineer CV');

    // Other user cannot read or update
    const forbiddenGet = await call(env, `/v1/db/resumes/${resumeId}`, { token: otherToken });
    assert.equal(forbiddenGet.status, 404);

    // Version snapshot & restore
    const ver = await call(env, `/v1/db/resumes/${resumeId}/versions`, {
      method: 'POST',
      token: userToken,
      body: { versionLabel: 'v1', data: { title: 'Restored CV Title' } },
    });
    assert.equal(ver.status, 201);
    const restored = await call(env, `/v1/db/resumes/${resumeId}/versions/${ver.data.version.id}/restore`, {
      method: 'POST',
      token: userToken,
    });
    assert.equal(restored.status, 200);
    assert.equal(restored.data.resume.title, 'Restored CV Title');

    // ATS history
    const ats = await call(env, `/v1/db/resumes/${resumeId}/ats-history`, {
      method: 'POST',
      token: userToken,
      body: { score: 92, matchedKeywords: ['D1'] },
    });
    assert.equal(ats.status, 201);
    const atsList = await call(env, `/v1/db/resumes/${resumeId}/ats-history`, { token: userToken });
    assert.equal(atsList.data.history.length, 1);
    assert.equal(atsList.data.history[0].score, 92);
  });

  test('Tracked jobs CRUD + extension idempotency + status notes', async () => {
    const extSave = await call(env, '/v1/jobs/track', {
      method: 'POST',
      token: userToken,
      body: { title: 'Systems Engineer', company: 'Cloudflare', notes: 'Dream role' },
    });
    assert.equal(extSave.status, 201);
    assert.equal(extSave.data.alreadyTracked, false);
    const jobId = extSave.data.trackedJob.id;

    // Duplicate extension track is idempotent
    const extDup = await call(env, '/v1/jobs/track', {
      method: 'POST',
      token: userToken,
      body: { title: 'Systems Engineer', company: 'Cloudflare' },
    });
    assert.equal(extDup.status, 200);
    assert.equal(extDup.data.alreadyTracked, true);

    const statusUpd = await call(env, `/v1/db/jobs/${jobId}/status`, {
      method: 'PATCH',
      token: userToken,
      body: { status: 'applied', notes: 'Submitted online' },
    });
    assert.equal(statusUpd.status, 200);
    assert.equal(statusUpd.data.trackedJob.status, 'applied');
    assert.equal(statusUpd.data.trackedJob.notes.length, 2);
  });

  test('Career profile, STAR stories, job alerts, portfolios, roasts, cover letters, settings', async () => {
    const cp = await call(env, '/v1/db/career-profile', {
      method: 'PUT',
      token: userToken,
      body: { targetRoles: ['Staff Engineer'], weeklyApplyTarget: 8, masterResumeText: 'Resume body' },
    });
    assert.equal(cp.status, 200);
    assert.deepEqual(cp.data.profile.targetRoles, ['Staff Engineer']);

    const story = await call(env, '/v1/db/star-stories', {
      method: 'POST',
      token: userToken,
      body: { title: 'Migrated DB to D1', situation: 'High latency', action: 'Edge SQL', result: '5x faster', skills: 'SQL, Workers' },
    });
    assert.equal(story.status, 201);
    assert.deepEqual(story.data.story.skills, ['SQL', 'Workers']);

    const alert = await call(env, '/v1/db/alerts', {
      method: 'POST',
      token: userToken,
      body: { keywords: ['rust', 'workers'], location: 'Remote' },
    });
    assert.equal(alert.status, 201);
    const toggled = await call(env, `/v1/db/alerts/${alert.data.alert.id}/toggle`, {
      method: 'POST',
      token: userToken,
    });
    assert.equal(toggled.status, 200);
    assert.equal(toggled.data.alert.isActive, false);

    const port = await call(env, '/v1/db/portfolios', {
      method: 'POST',
      token: userToken,
      body: { slug: 'ada-portfolio', title: 'Ada Portfolio', sections: { hero: { title: 'Hi' } }, isPublic: true },
    });
    assert.equal(port.status, 200);
    const bySlug = await call(env, '/v1/db/portfolios?slug=ada-portfolio');
    assert.equal(bySlug.status, 200);
    assert.equal(bySlug.data.portfolio.title, 'Ada Portfolio');

    const roast = await call(env, '/v1/db/roasts', {
      method: 'POST',
      token: userToken,
      body: { resumeText: 'My CV', jobRole: 'SWE', isPublic: true, overallScore: 85 },
    });
    assert.equal(roast.status, 201);
    const shareRoast = await call(env, `/v1/db/roasts/share/${roast.data.roast.share_token}`);
    assert.equal(shareRoast.status, 200);

    const cl = await call(env, '/v1/db/cover-letters', {
      method: 'POST',
      token: userToken,
      body: { jobTitle: 'SWE', company: 'Acme', content: 'Dear hiring team...' },
    });
    assert.equal(cl.status, 201);

    const settings = await call(env, '/v1/db/settings', {
      method: 'PUT',
      token: userToken,
      body: { notifications: { jobAlerts: false, directMessages: true, proposalUpdates: true }, theme: 'light' },
    });
    assert.equal(settings.status, 200);
    assert.equal(settings.data.settings.theme, 'light');

    const stats = await call(env, '/v1/db/profiles/me/stats', { token: userToken });
    assert.equal(stats.status, 200);
    assert.equal(stats.data.stats.resumesCreated, 1);
    assert.equal(stats.data.stats.applicationsTracked, 1);
    assert.equal(stats.data.stats.portfoliosCreated, 1);
  });

  test('Logout revokes active JWT session', async () => {
    const out = await call(env, '/v1/auth/logout', { method: 'POST', token: userToken });
    assert.equal(out.status, 200);
    const me = await call(env, '/v1/auth/me', { token: userToken });
    assert.equal(me.status, 401);
  });

  test('Model discovery: static catalog covers every registered provider', async () => {
    const res = await call(env, '/v1/ai/models?provider=all');
    assert.equal(res.status, 200);
    assert.equal(res.data.source, 'static');
    for (const id of [
      'cloudflare',
      'gemini',
      'anthropic',
      'openai',
      'groq',
      'openrouter',
      'deepseek',
      'mistral',
      'xai',
      'together',
      'ollama',
      'lmstudio',
      'vllm',
      'custom',
    ]) {
      assert.ok(Array.isArray(res.data.models[id]), `missing static catalog for ${id}`);
    }
    assert.ok(res.data.models.deepseek.includes('deepseek-chat'));
  });

  test('Model discovery: live /models lookup for custom endpoints', async () => {
    const origFetch = globalThis.fetch;
    const seen = [];
    globalThis.fetch = async (url) => {
      seen.push(String(url));
      if (String(url).startsWith('https://llm.example.com/v1')) {
        return new Response(
          JSON.stringify({ object: 'list', data: [{ id: 'my-model-a' }, { id: 'my-model-b' }] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return origFetch(url);
    };

    try {
      const res = await call(env, '/v1/ai/models', {
        method: 'POST',
        body: { provider: 'custom', baseUrl: 'https://llm.example.com/v1/' },
      });
      assert.equal(res.status, 200);
      assert.equal(res.data.source, 'live');
      assert.deepEqual(res.data.models, ['my-model-a', 'my-model-b']);
      assert.equal(res.data.count, 2);
      assert.ok(seen.some((u) => u === 'https://llm.example.com/v1/models'));
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('Validate key: custom endpoint without a key reports models and latency', async () => {
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      if (String(url).startsWith('https://llm.example.com/v1')) {
        return new Response(
          JSON.stringify({ data: [{ id: 'local-llama' }, { id: 'local-qwen' }] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return origFetch(url);
    };

    try {
      const res = await call(env, '/v1/ai/validate-key', {
        method: 'POST',
        body: { provider: 'custom', baseUrl: 'https://llm.example.com/v1', model: 'local-llama' },
      });
      assert.equal(res.status, 200);
      assert.equal(res.data.valid, true);
      assert.equal(res.data.source, 'live');
      assert.equal(res.data.modelCount, 2);
      assert.equal(res.data.modelAvailable, true);
      assert.equal(typeof res.data.latencyMs, 'number');
      assert.ok(res.data.models.includes('local-qwen'));
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('Model discovery: explicit empty credentials never reuse the active provider key', async () => {
    const origFetch = globalThis.fetch;
    let authorization = 'unset';
    globalThis.fetch = async (url, init = {}) => {
      if (String(url).startsWith('https://llm.example.com/v1')) {
        authorization = init.headers?.Authorization ?? init.headers?.authorization ?? 'none';
        return new Response(
          JSON.stringify({ data: [{ id: 'keyless-model' }] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return origFetch(url);
    };

    try {
      const res = await call(env, '/v1/ai/models', {
        method: 'POST',
        headers: { 'X-AI-Key': 'active-provider-secret', 'X-AI-Provider': 'openai' },
        body: { provider: 'custom', apiKey: '', baseUrl: 'https://llm.example.com/v1' },
      });
      assert.equal(res.status, 200);
      assert.equal(res.data.source, 'live');
      assert.equal(authorization, 'none');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('Validate key: falls back to a 1-token chat probe when /models is unavailable', async () => {
    const origFetch = globalThis.fetch;
    const calls = [];
    globalThis.fetch = async (url, init = {}) => {
      const u = String(url);
      if (u.startsWith('https://deploy.example.com/v1/models')) {
        calls.push('models');
        return new Response(JSON.stringify({ error: { message: 'Not found' } }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (u.startsWith('https://deploy.example.com/v1/chat/completions')) {
        calls.push('chat');
        assert.equal(init.method, 'POST');
        return new Response(
          JSON.stringify({ choices: [{ message: { content: 'OK' } }], usage: {} }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return origFetch(url);
    };

    try {
      const res = await call(env, '/v1/ai/validate-key', {
        method: 'POST',
        body: {
          provider: 'custom',
          apiKey: 'test-key',
          baseUrl: 'https://deploy.example.com/v1',
          model: 'my-deployment',
        },
      });
      assert.equal(res.status, 200);
      assert.equal(res.data.valid, true);
      assert.equal(res.data.source, 'chat-probe');
      assert.match(res.data.warning, /1-token completion/);
      assert.deepEqual(calls, ['models', 'chat']);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('Validate key: providers that require a key fail fast with a clear error', async () => {
    const res = await call(env, '/v1/ai/validate-key', {
      method: 'POST',
      body: { provider: 'openai' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.valid, false);
    assert.match(res.data.error, /API key/i);
  });

  test('ImageKit upload validates multipart files and falls back to File.name', async () => {
    const ikEnv = { ...env, IMAGEKIT_PRIVATE_KEY: 'private_test_key' };

    // Missing file in multipart form data -> 400
    const emptyForm = new FormData();
    const missingRes = await worker.fetch(
      new Request('https://gateway.test/gateway/v1/imagekit/upload', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': '127.0.0.1' },
        body: emptyForm,
      }),
      ikEnv
    );
    assert.equal(missingRes.status, 400);

    // Multipart upload with File.name and no explicit fileName field succeeds
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      if (String(url).includes('upload.imagekit.io')) {
        return new Response(
          JSON.stringify({
            fileId: 'ik_file_1',
            name: 'resume.pdf',
            url: 'https://ik.imagekit.io/demo/resumes/resume.pdf',
            size: 12,
            fileType: 'non-image',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return origFetch(url);
    };

    try {
      const form = new FormData();
      form.append('file', new File(['%PDF-1.4'], 'resume.pdf', { type: 'application/pdf' }));
      form.append('folder', '/resumes');
      const okRes = await worker.fetch(
        new Request('https://gateway.test/gateway/v1/imagekit/upload', {
          method: 'POST',
          headers: { 'CF-Connecting-IP': '127.0.0.1', 'X-User-Id': userId },
          body: form,
        }),
        ikEnv
      );
      assert.equal(okRes.status, 200);
      const data = await okRes.json();
      assert.equal(data.success, true);
      assert.equal(data.url, 'https://ik.imagekit.io/demo/resumes/resume.pdf');
    } finally {
      globalThis.fetch = origFetch;
    }
  });
});
