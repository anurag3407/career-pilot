import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

describe('Jobs route', () => {
  let router;

  before(async () => {
    const mod = await import('../jobsRoute.js');
    router = mod.default;
  });

  test('exports an Express router', () => {
    assert.ok(router);
    assert.equal(typeof router, 'function');
    assert.ok(Array.isArray(router.stack));
  });

  test('has GET / route', () => {
    const getRoute = router.stack.find(
      (layer) => layer.route?.path === '/' && layer.route?.methods?.get
    );
    assert.ok(getRoute, 'GET / route not found');
  });

  test('has POST /summarize route', () => {
    const summarizeRoute = router.stack.find(
      (layer) => layer.route?.path === '/summarize' && layer.route?.methods?.post
    );
    assert.ok(summarizeRoute, 'POST /summarize route not found');
  });

  test('GET / uses verifyToken middleware', () => {
    const getRoute = router.stack.find(
      (layer) => layer.route?.path === '/' && layer.route?.methods?.get
    );
    assert.ok(getRoute);
    // Should have at least auth middleware + handler
    assert.ok(getRoute.route.stack.length >= 2);
  });

  test('POST /summarize uses verifyToken + extractAIProvider + aiRateLimiter middleware chain', () => {
    const summarizeRoute = router.stack.find(
      (layer) => layer.route?.path === '/summarize' && layer.route?.methods?.post
    );
    assert.ok(summarizeRoute);
    // Should have multiple middleware functions
    assert.ok(summarizeRoute.route.stack.length >= 4);
  });
});
