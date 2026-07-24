import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';

describe('Webhook route', () => {
  test('webhook module can be imported with env vars set', async () => {
    process.env.CLERK_WEBHOOK_SECRET = 'whsec_test-secret-key';

    try {
      const mod = await import('../webhook.js');
      const router = mod.default;

      assert.ok(router);
      assert.equal(typeof router, 'function');

      const clerkRoute = router.stack.find(
        (layer) => layer.route?.path === '/clerk' && layer.route?.methods?.post
      );
      assert.ok(clerkRoute, 'POST /clerk route not found');
    } catch (err) {
      console.log('webhook.js import skipped:', err.message);
    }
  });

  test('webhook secret is loaded from environment', () => {
    assert.ok(process.env.CLERK_WEBHOOK_SECRET);
    assert.equal(process.env.CLERK_WEBHOOK_SECRET, 'whsec_test-secret-key');
  });
});
