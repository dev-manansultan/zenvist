import { execSync } from "node:child_process";

// Force Playwright assets into project-local folder so Next/Vercel can trace and bundle them.
process.env.PLAYWRIGHT_BROWSERS_PATH = "0";

try {
  execSync("npx playwright-core install ffmpeg", {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  console.error("Failed to install Playwright FFmpeg asset:", error);
  process.exit(1);
}
