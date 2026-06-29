import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Dedicated port to avoid clashing with any manually-started dev server.
const PORT = 4187;
const BASE = `http://127.0.0.1:${PORT}`;

// Locally use the container's pre-installed Chromium; in CI (where this path
// does not exist) fall back to Playwright's own installed browser.
const CONTAINER_CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const CHROME = existsSync(CONTAINER_CHROME) ? CONTAINER_CHROME : undefined;
const launchOptions = CHROME ? { executablePath: CHROME } : {};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: [["list"]],
  expect: {
    // Tolerate tiny rendering diffs (antialiasing) in visual snapshots.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled" },
  },
  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
    launchOptions,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions },
    },
  ],
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: BASE,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
