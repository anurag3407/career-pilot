import { test, expect } from '@playwright/test';

// Use environment variables for test user credentials
const TEST_EMAIL = process.env.E2E_TEST_EMAIL || '';
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || '';

test.describe('Authentication flow', () => {
  // Fail the test in CI if the Clerk keys are absent or dummy, since we can't test without them.
  test('user can log in and view dashboard', async ({ page }) => {
    if (!process.env.VITE_CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY.includes('dummy')) {
      if (process.env.CI) {
        throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required in CI to run this test.');
      }
      test.skip(true, 'Requires a valid Clerk Publishable Key');
    }
    
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      if (process.env.CI) {
        throw new Error('E2E_TEST_EMAIL and E2E_TEST_PASSWORD are required in CI.');
      }
      test.skip(true, 'Requires test credentials');
    }
    
    await page.goto('/');

    const loginLink = page.locator('a[href="/login"]').first();
    await expect(loginLink).toBeVisible({ timeout: 15000 });
    
    await loginLink.click();

    const emailInput = page.locator('input[type="email"], input[name="identifier"], input[name="emailAddress"]');
    await expect(emailInput).toBeVisible({ timeout: 15000 });
    await emailInput.fill(TEST_EMAIL);

    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Sign in")');
    await continueButton.click();

    // Wait for password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await passwordInput.fill(TEST_PASSWORD);

    await continueButton.click();

    // Verify successful login by checking for dashboard redirection
    await expect(page).toHaveURL(/.*dashboard/i, { timeout: 15000 });
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });
});

test.describe('Public flows', () => {
  test('user can view the landing page', async ({ page }) => {
    // If the frontend is running without keys, it crashes. We should fail CI.
    if (!process.env.VITE_CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY.includes('dummy')) {
      if (process.env.CI) {
        throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required in CI.');
      }
      test.skip(true, 'Requires a valid Clerk Publishable Key');
    }

    await page.goto('/');
    
    // Check that a key stable element of the landing page is visible
    await expect(page.locator('text=careerpilot').first()).toBeVisible();
  });
});
