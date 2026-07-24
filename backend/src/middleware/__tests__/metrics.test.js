import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Since prom-client registers global metrics and we can't easily isolate,
// we test the middleware shape and the metrics export contract.
describe('metrics middleware', () => {
  let mod;

  before(async () => {
    mod = await import('../metrics.js');
  });

  test('exports httpRequestCounter as a Counter', () => {
    assert.ok(mod.httpRequestCounter);
    assert.equal(mod.httpRequestCounter.constructor.name, 'Counter');
  });

  test('exports httpRequestDuration as a Histogram', () => {
    assert.ok(mod.httpRequestDuration);
    assert.equal(mod.httpRequestDuration.constructor.name, 'Histogram');
  });

  test('exports httpErrorCounter as a Counter', () => {
    assert.ok(mod.httpErrorCounter);
    assert.equal(mod.httpErrorCounter.constructor.name, 'Counter');
  });

  test('exports aiCallsCounter as a Counter', () => {
    assert.ok(mod.aiCallsCounter);
    assert.equal(mod.aiCallsCounter.constructor.name, 'Counter');
  });

  test('exports jobsScrapedCounter as a Counter', () => {
    assert.ok(mod.jobsScrapedCounter);
    assert.equal(mod.jobsScrapedCounter.constructor.name, 'Counter');
  });

  test('exports metricsMiddleware as a function', () => {
    assert.equal(typeof mod.metricsMiddleware, 'function');
    assert.equal(mod.metricsMiddleware.length, 3);
  });

  test('exports metricsHandler as a function', () => {
    assert.equal(typeof mod.metricsHandler, 'function');
    assert.equal(mod.metricsHandler.length, 2);
  });

  test('exports register as a Registry', () => {
    assert.ok(mod.default);
    assert.equal(mod.default.constructor.name, 'Registry');
  });

  test('metricsMiddleware calls next()', () => {
    const req = { method: 'GET', path: '/test' };
    const res = { on: (event, cb) => {}, statusCode: 200 };
    let nextCalled = false;

    mod.metricsMiddleware(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  });
});
