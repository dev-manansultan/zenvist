import { randomInt } from "node:crypto";
import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

import type { VisitJob } from "@/lib/types";

interface VisitAgentResult {
  status: "success" | "failed";
  startedAt: Date;
  endedAt: Date;
  durationSec: number;
  videoBuffer: Buffer | null;
  errorCode: string | null;
  errorMessage: string | null;
}

interface VideoLike {
  path: () => Promise<string>;
}

interface PageLike {
  goto: (url: string, options: { waitUntil: "domcontentloaded"; timeout: number }) => Promise<unknown>;
  waitForTimeout: (ms: number) => Promise<void>;
  mouse: { wheel: (deltaX: number, deltaY: number) => Promise<void> };
  video: () => VideoLike | null;
}

interface BrowserContextLike {
  newPage: () => Promise<PageLike>;
  close: () => Promise<void>;
}

interface BrowserLike {
  newContext: (options: {
    viewport: { width: number; height: number };
    recordVideo: { dir: string; size: { width: number; height: number } };
  }) => Promise<BrowserContextLike>;
  close: () => Promise<void>;
}

function toDurationSec(startedAt: Date, endedAt: Date) {
  return Math.max(1, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000));
}

function randomViewport() {
  const widths = [1280, 1366, 1440, 1536, 1600];
  const heights = [720, 768, 810, 864, 900];
  return {
    width: widths[randomInt(0, widths.length)],
    height: heights[randomInt(0, heights.length)],
  };
}

async function simulateHumanBehavior(page: {
  waitForTimeout: (ms: number) => Promise<void>;
  mouse: { wheel: (deltaX: number, deltaY: number) => Promise<void> };
}, durationSec: number) {
  const targetMs = Math.max(5, durationSec) * 1000;
  const started = Date.now();

  while (Date.now() - started < targetMs) {
    const pause = 1000 + randomInt(0, 2000);
    await page.waitForTimeout(pause);
    await page.mouse.wheel(0, randomInt(250, 1400));

    if (Date.now() - started >= targetMs) {
      break;
    }
  }
}

export async function runPlaywrightVisit(job: VisitJob, maxDurationSec: number): Promise<VisitAgentResult> {
  // Keep Playwright assets inside the deployed app bundle instead of ~/.cache.
  process.env.PLAYWRIGHT_BROWSERS_PATH = "0";

  const startedAt = new Date();
  const visitDuration = Math.max(5, Math.min(job.duration_sec ?? 45, maxDurationSec));

  const sessionDir = path.join("/tmp", `zenvist-${job.id}-${Date.now()}`);
  await mkdir(sessionDir, { recursive: true });

  let browser: BrowserLike | null = null;
  let context: BrowserContextLike | null = null;

  try {
    const [{ chromium }, chromiumBinary] = await Promise.all([
      import("playwright-core"),
      import("@sparticuz/chromium"),
    ]);

    const executablePath = await chromiumBinary.default.executablePath();

    browser = await chromium.launch({
      args: chromiumBinary.default.args,
      executablePath,
      headless: true,
    });

    context = await browser.newContext({
      viewport: randomViewport(),
      recordVideo: {
        dir: sessionDir,
        size: { width: 1280, height: 720 },
      },
    });

    const page = await context.newPage();
    await page.goto(job.url, {
      waitUntil: "domcontentloaded",
      timeout: visitDuration * 1000,
    });

    await simulateHumanBehavior(page, visitDuration);

    const video = page.video();

    await context.close();
    await browser.close();

    const videoPath = video ? await video.path() : null;
    const videoBuffer = videoPath ? await readFile(videoPath) : null;

    const endedAt = new Date();

    return {
      status: "success",
      startedAt,
      endedAt,
      durationSec: toDurationSec(startedAt, endedAt),
      videoBuffer,
      errorCode: null,
      errorMessage: null,
    };
  } catch (error) {
    const endedAt = new Date();

    if (context) {
      await context.close().catch(() => undefined);
    }

    if (browser) {
      await browser.close().catch(() => undefined);
    }

    return {
      status: "failed",
      startedAt,
      endedAt,
      durationSec: toDurationSec(startedAt, endedAt),
      videoBuffer: null,
      errorCode: "visit_failed",
      errorMessage: error instanceof Error ? error.message : "Visit execution failed",
    };
  } finally {
    await rm(sessionDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
