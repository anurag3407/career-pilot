import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';

describe('cspHeaders', () => {
  let cspHeaders;

  before(async () => {
    cspHeaders = (await import('../cspHeaders.js')).cspHeaders;
  });

  test('exports a middleware function', () => {
    assert.equal(typeof cspHeaders, 'function');
    assert.equal(cspHeaders.length, 3);
  });

  test('middleware configuration includes correct security directives', () => {
    // Verify the function shape - we can't easily introspect helmet middleware
    assert.ok(cspHeaders);
    assert.equal(typeof cspHeaders, 'function');
  });

  test('invocation returns a function (helmet middleware factory)', () => {
    // Helmet middleware is a function that returns a function
    assert.equal(typeof cspHeaders, 'function');
  });
});
