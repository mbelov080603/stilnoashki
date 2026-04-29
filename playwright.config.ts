import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  workers: 1,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://localhost:3010",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 3010",
    env: {
      LEADS_WEBHOOK_URL: "http://127.0.0.1:3011/leads",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3010",
    },
    url: "http://localhost:3010",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
