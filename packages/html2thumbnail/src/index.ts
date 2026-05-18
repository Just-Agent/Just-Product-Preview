import {
  closeBrowserContext,
  createBrowserContext,
  getLowerExtension,
  prepareOutputFile,
  resolveOutputPath,
  resolvePreviewTarget,
  startPreviewServer,
  type BasePreviewOptions,
  type PreviewResult
} from "@just-agent/preview-core";

export interface Html2ThumbnailOptions extends BasePreviewOptions {
  /** Capture full page instead of viewport only. */
  fullPage?: boolean;
  /** Omit default white background. Useful for transparent pages. */
  omitBackground?: boolean;
  /** JPEG quality. Only used for .jpg / .jpeg output. */
  quality?: number;
}

export async function html2thumbnail(options: Html2ThumbnailOptions): Promise<PreviewResult> {
  const output = await prepareOutputFile(
    resolveOutputPath({
      output: options.output,
      outputDir: options.outputDir,
      defaultFilename: "cover.png",
      cwd: options.cwd
    })
  );

  const type = resolveScreenshotType(output);
  const quality = normalizeJpegQuality(options.quality);
  const server = await startPreviewServer(options);

  try {
    const target = await resolvePreviewTarget({ ...options, url: options.url ?? server?.url }, options.cwd);
    let browserResource: Awaited<ReturnType<typeof createBrowserContext>> | undefined;

    try {
      browserResource = await createBrowserContext(options);
      const page = await browserResource.context.newPage();
      await page.goto(target.url, {
        waitUntil: options.waitUntil ?? "networkidle",
        timeout: options.timeout ?? 30_000
      });

      if (options.waitForTimeout && options.waitForTimeout > 0) {
        await page.waitForTimeout(options.waitForTimeout);
      }

      await page.screenshot({
        path: output,
        type,
        fullPage: options.fullPage ?? false,
        omitBackground: options.omitBackground ?? false,
        quality: type === "jpeg" ? quality : undefined
      });

      return {
        output,
        url: target.url,
        viewport: browserResource.viewport
      };
    } finally {
      if (browserResource) await closeBrowserContext(browserResource);
      await target.cleanup?.();
    }
  } finally {
    await server?.stop();
  }
}

function resolveScreenshotType(output: string): "png" | "jpeg" {
  const ext = getLowerExtension(output);
  if (ext === ".png") return "png";
  if (ext === ".jpg" || ext === ".jpeg") return "jpeg";
  throw new Error(`Unsupported thumbnail output extension: ${ext || "<none>"}. Use .png, .jpg, or .jpeg.`);
}

function normalizeJpegQuality(value: number | undefined): number {
  if (value === undefined) return 90;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error("JPEG quality must be a number between 0 and 100.");
  }
  return Math.round(value);
}

export default html2thumbnail;
