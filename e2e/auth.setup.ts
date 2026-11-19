import { test as setup, expect } from './fixtures';

// Must match `storageState` in playwright.config.ts.
const AUTH_FILE = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');

  // The API is mocked (see fixtures.ts), so any well-formed credentials are accepted.
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // LoginComponent navigates to /dashboard after a successful login.
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /welcome, admin user/i })).toBeVisible();

  // The access token lives in memory, but the refresh token is in localStorage. Saving the
  // browser state lets every other test start signed in: the app calls /auth/refresh on boot.
  await page.context().storageState({ path: AUTH_FILE });
});