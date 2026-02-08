import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173/holy-grind/',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173/holy-grind/',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
})
