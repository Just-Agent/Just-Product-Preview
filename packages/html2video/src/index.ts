import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  closeBrowserContext,
  createBrowserContext,
  prepareOutputFile,
  resolveOutputPath,
  resolvePreviewTarget,
  startPreviewServer,
  safeRemoveFile,
  type BasePreviewOptions,
  type PreviewResult
} from "@just-agent/preview-core";
import { convertRecordedVideo } from "./convert.js";

export interface Html2VideoOptions extends BasePreviewOptions {
  /** Recording duration in seconds. */
  duration?: number;
  /** Recording duration in milliseconds. Overrides duration. */
  durationMs?: number;
  /** Scroll down while recording. */
  autoScroll?: boolean;
  /** Scroll distance for autoScroll. */
  scrollBy?: number;
  /** Scroll interval in milliseconds. */
  scrollIntervalMs?: number;
  /** Raw recording directory. */
  recordingsDir?: string;
  /** Keep raw Playwright WebM recording after conversion. */
  keepRawWebm?: boolean;
  /** MP4 frames per second. */
  fps?: number;
  /** FFmpeg CRF value. */
  crf?: number;
  /** GIF export FPS when output ends with .gif. */
  gifFps?: number;
  /** GIF export width when output ends with .gif. */
  gifWidth?: number;
}

export async function html2video(options: Html2VideoOptions): Promise<PreviewResult> {
  const output = await prepareOutputFile(
    resolveOutputPath({
      output: options.output,
      outputDir: options.outputDir,
      defaultFilename: "preview.mp4",
      cwd: options.cwd
    })
  );

  const recordingsDir = resolve(options.cwd ?? process.cwd(), options.recordingsDir ?? "recordings");
  await mkdir(recordingsDir, { recursive: true });

  const server = await startPreviewServer(options);
  let rawVideoPath: string | undefined;
  let resultUrl = "";
  let resultViewport: PreviewResult["viewport"] | undefined;

  try {
    const target = await resolvePreviewTarget({ ...options, url: options.url ?? server?.url }, options.cwd);
    let browserResource: Awaited<ReturnType<typeof createBrowserContext>> | undefined;

    try {
      browserResource = await createBrowserContext({
        ...options,
        recordVideo: true,
        recordVideoDir: recordingsDir
      });
      const page = await browserResource.context.newPage();
      await page.goto(target.url, {
        waitUntil: options.waitUntil ?? "networkidle",
        timeout: options.timeout ?? 30_000
      });

      if (options.waitForTimeout && options.waitForTimeout > 0) {
        await page.waitForTimeout(options.waitForTimeout);
      }

      const video = page.video();
      const durationMs = options.durationMs ?? Math.max(1, options.duration ?? 6) * 1000;

      if (options.autoScroll) {
        await recordWithAutoScroll(page, durationMs, options.scrollBy ?? 500, Math.max(1, options.scrollIntervalMs ?? 800));
      } else {
        await page.waitForTimeout(durationMs);
      }

      await page.close();
      rawVideoPath = await video?.path();
      resultUrl = target.url;
      resultViewport = browserResource.viewport;
    } finally {
      if (browserResource) await closeBrowserContext(browserResource);
      await target.cleanup?.();
    }
  } finally {
    await server?.stop();
  }

  if (!rawVideoPath) {
    throw new Error("Playwright did not produce a video file.");
  }

  if (!resultViewport) {
    throw new Error("Playwright did not report a viewport for the recording.");
  }

  await convertRecordedVideo({
    input: rawVideoPath,
    output,
    fps: options.fps,
    crf: options.crf,
    gifFps: options.gifFps,
    gifWidth: options.gifWidth
  });

  if (!options.keepRawWebm) {
    await safeRemoveFile(rawVideoPath);
  }

  return {
    output,
    rawOutput: options.keepRawWebm ? rawVideoPath : undefined,
    url: resultUrl,
    viewport: resultViewport
  };
}

async function recordWithAutoScroll(page: { waitForTimeout(ms: number): Promise<void>; mouse: { wheel(x: number, y: number): Promise<void> } }, durationMs: number, scrollBy: number, intervalMs: number): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < durationMs) {
    await page.mouse.wheel(0, scrollBy);
    await page.waitForTimeout(intervalMs);
  }
}

export { convertRecordedVideo } from "./convert.js";
export default html2video;
