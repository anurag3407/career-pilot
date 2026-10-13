import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  auditRouteAuth,
  extractRoutes,
  PUBLIC_ROUTE_ALLOWLIST,
} from '../../../scripts/auditRouteAuth.js';

/**
 * Guardrail against unauthenticated AI spend and unguarded state mutation.
 *
 * Context: `POST /api/resume/score` shipped without auth while calling
 * `analyzeResume()`, which spends a hosted AI call — anyone could burn the
 * project's provider quota anonymously. These tests fail if that class of bug
 * is ever reintroduced.
 */
describe('route authentication guardrail', () => {
  test('no mutating or AI-spending route is left without authentication', () => {
    const { violations, checked } = auditRouteAuth();

    assert.ok(checked > 0, 'scanner found no routes — it is probably broken');

    const detail = violations
      .map((v) => `  ${v.file}: ${v.route} (${v.reason})`)
      .join('\n');

    assert.equal(
      violations.length,
      0,
      `Found ${violations.length} route(s) reachable without authentication:\n${detail}\n` +
        'Either add auth middleware, or — if the route is intentionally public — ' +
        'add a justified entry to PUBLIC_ROUTE_ALLOWLIST in scripts/auditRouteAuth.js.',
    );
  });

  test('the scanner actually parses route registrations', () => {
    const routes = extractRoutes(`
      router.post('/thing', verifyToken, handler);
      router.get(
        "/multi",
        aiRateLimiter,
        handler,
      );
    `);

    assert.equal(routes.length, 2);
    assert.deepEqual(
      routes.map((r) => `${r.method} ${r.path}`),
      ['POST /thing', 'GET /multi'],
    );
  });

  test('scanner ignores parentheses and routes inside strings', () => {
    const routes = extractRoutes(`
      // router.post('/commented-out', nothing);
      const snippet = "router.post('/in-a-string', nothing)";
      router.post('/real', verifyToken, handler); // trailing ) noise
    `);

    assert.equal(routes.length, 1);
    assert.equal(routes[0].path, '/real');
  });

  test('every allowlisted public route carries a justification', () => {
    for (const [file, entries] of Object.entries(PUBLIC_ROUTE_ALLOWLIST)) {
      for (const [route, reason] of Object.entries(entries)) {
        assert.ok(
          typeof reason === 'string' && reason.trim().length > 10,
          `Allowlist entry "${file}: ${route}" needs a real justification`,
        );
      }
    }
  });
});

/**
 * Targeted regression test. This route spends AI through `getDefaultProvider()`
 * *without* the `extractAIProvider` middleware, so the generic scanner classifies
 * it by file (resume.js is an AI-spending file) rather than by chain. Pin it
 * directly so the guarantee does not depend on the classifier staying correct.
 */
describe('POST /api/resumes/score authentication', () => {
  test('is registered with an auth middleware in its chain', async () => {
    const router = (await import('../../routes/resume.js')).default;

    const layer = router.stack.find(
      (l) => l.route?.path === '/score' && l.route?.methods?.post,
    );
    assert.ok(layer, 'POST /score route not found');

    const names = layer.route.stack.map((s) => s.handle?.name ?? '');

    assert.ok(
      names.includes('enforceAuth') || names.includes('attachUserToReq'),
      `POST /score must sit behind auth middleware, got: ${names.join(', ')}`,
    );
  });
});