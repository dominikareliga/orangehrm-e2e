import { defineConfig, devices } from '@playwright/test';
import { config } from './tests/config';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // The target is a public demo shared with everyone on the internet; two
  // workers is fast enough and keeps our load on it polite.
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ...(isCI ? [['github'] as const] : []),
  ],
  use: {
    baseURL: config.baseUrl,
    actionTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: config.adminStorageState },
      dependencies: ['setup'],
    },
  ],
});
