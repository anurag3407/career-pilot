import { test, expect } from '@playwright/test';

test('has title and loads landing page', async ({ page }) => {
  // If the frontend is running without keys, it crashes. We should fail CI.
  if (!process.env.VITE_CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY.includes('dummy')) {
    if (process.env.CI) {
      throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required in CI.');
    }
    test.skip(true, 'Requires a valid Clerk Publishable Key');
  }

  await page.goto('/');

  // Wait for a stable page element to ensure React actually rendered the page
  await expect(page.locator('nav').first()).toBeVisible();
});
