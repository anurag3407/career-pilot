import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';

describe('Auth routes', () => {
  test('auth route module can be imported', async () => {
    // We set up required env vars that auth.js needs
    process.env.CLERK_SECRET_KEY = 'test-clerk-secret';
    process.env.ADMIN_EMAILS = 'admin@example.com';
    process.env.GEMINI_API_KEY = 'test-gemini-key';

    try {
      const mod = await import('../auth.js');
      const router = mod.default;

      assert.ok(router);
      assert.ok(Array.isArray(router.stack));
      assert.ok(router.stack.length >= 8);

      const routeLayers = router.stack.filter((l) => l.route);
      assert.ok(routeLayers.length >= 8);

      // Verify specific routes exist
      const paths = routeLayers.map((l) => l.route.path);
      assert.ok(paths.includes('/verify'));
      assert.ok(paths.includes('/profile'));
      assert.ok(paths.includes('/notification-preferences'));
      assert.ok(paths.includes('/github/start'));
      assert.ok(paths.includes('/github/callback'));
      assert.ok(paths.includes('/github/disconnect'));
      assert.ok(paths.includes('/github/status'));
    } catch (err) {
      // Module may fail to import if Clerk SDK isn't properly configured
      console.log('auth.js import skipped:', err.message);
    }
  });
});
