import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Your specs live in the e2e folder (there is no ./tests folder in the repo).
  testDir: './e2e',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // 'github' prints failures as annotations in the Actions log, and open: 'never'
  // stops the HTML reporter from trying to launch a browser on the runner.
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : 'html',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    // Logs in once and saves the session to playwright/.auth/admin.json.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Real tests: wait for setup, then start already logged in as admin.
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
    },

    // Re-enable once chromium is green. Each one also needs its browser installed in CI.
    // {
    //   name: 'firefox',
    //   dependencies: ['setup'],
    //   use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/admin.json' },
    // },
    // {
    //   name: 'webkit',
    //   dependencies: ['setup'],
    //   use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/admin.json' },
    // },
  ],

  // Starts the Angular dev server before the tests and stops it afterwards.
  // Locally, reuseExistingServer lets it use the ng serve you already have running.
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});