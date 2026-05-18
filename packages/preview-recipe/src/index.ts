import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  closeBrowserContext,
  createBrowserContext,
  loadJsonConfig,
  prepareOutputFile,
  removeUndefinedValues,
  resolveOutputPath,
  resolvePreviewTarget,
  safeRemoveFile,
  startPreviewServer,
  type CreatedBrowserContext,
  type PreviewResult
} from "@just-agent/preview-core";
import { convertRecordedVideo } from "@just-agent/html2video";
import { runRecipeStep } from "./steps.js";
import type { PreviewRecipe } from "./types.js";
import { validateRecipe } from "./validate.js";

export type { PreviewRecipe, PreviewRecipeMode, PreviewRecipeStep } from "./types.js";
export { validateRecipe } from "./validate.js";

export async function runPreviewRecipe(
  recipeInput: string | PreviewRecipe,
  overrides: Partial<PreviewRecipe> = {},
  defaults: Partial<PreviewRecipe> = {}
): Promise<PreviewResult> {
  const cleanDefaults = removeUndefinedValues(defaults as Record<string, unknown>) as Partial<PreviewRecipe>;
  const cleanOverrides = removeUndefinedValues(overrides as Record<string, unknown>) as Partial<PreviewRecipe>;
  const recipe = validateRecipe({
    ...cleanDefaults,
    ...(typeof recipeInput === "string" ? await loadJsonConfig<PreviewRecipe>(recipeInput, cleanOverrides.cwd ?? cleanDefaults.cwd) : recipeInput),
    ...cleanOverrides
  });

  const mode = recipe.mode ?? inferModeFromOutput(recipe.output ?? "preview.mp4");
  const output = await prepareOutputFile(
    resolveOutputPath({
      output: recipe.output,
      outputDir: recipe.outputDir,
      defaultFilename: mode === "thumbnail" ? "cover.png" : "preview.mp4",
      cwd: recipe.cwd
    })
  );

  const server = await startPreviewServer(recipe);
  try {
    const target = await resolvePreviewTarget({ ...recipe, url: recipe.url ?? (!recipe.file && !recipe.html ? server?.url : undefined) }, recipe.cwd);
    const cleanup = async (): Promise<void> => {
      await target.cleanup?.();
      await server?.stop();
    };

    if (mode === "thumbnail") {
      return runThumbnailRecipe(recipe, target.url, output, cleanup);
    }

    return runVideoRecipe(recipe, target.url, output, cleanup);
  } catch (error) {
    await server?.stop();
    throw error;
  }
}

async function runThumbnailRecipe(recipe: PreviewRecipe, url: string, output: string, cleanup?: () => Promise<void>): Promise<PreviewResult> {
  let browserResource: CreatedBrowserContext | undefined;
  try {
    browserResource = await createBrowserContext(recipe);
    const page = await browserResource.context.newPage();
    await page.goto(url, {
      waitUntil: recipe.waitUntil ?? "networkidle",
      timeout: recipe.timeout ?? 30_000
    });

    if (recipe.waitForTimeout && recipe.waitForTimeout > 0) {
      await page.waitForTimeout(recipe.waitForTimeout);
    }

    for (const step of recipe.steps ?? []) {
      await runRecipeStep(page, step, recipe.cwd);
    }

    await page.screenshot({ path: output, fullPage: recipe.fullPage ?? false });

    return {
      output,
      url,
      viewport: browserResource.viewport
    };
  } finally {
    if (browserResource) await closeBrowserContext(browserResource);
    await cleanup?.();
  }
}

async function runVideoRecipe(recipe: PreviewRecipe, url: string, output: string, cleanup?: () => Promise<void>): Promise<PreviewResult> {
  const recordingsDir = resolve(recipe.cwd ?? process.cwd(), recipe.recordingsDir ?? "recordings");
  await mkdir(recordingsDir, { recursive: true });

  let browserResource: CreatedBrowserContext | undefined;
  let rawVideoPath: string | undefined;

  try {
    browserResource = await createBrowserContext({
      ...recipe,
      recordVideo: true,
      recordVideoDir: recordingsDir
    });
    const page = await browserResource.context.newPage();
    await page.goto(url, {
      waitUntil: recipe.waitUntil ?? "networkidle",
      timeout: recipe.timeout ?? 30_000
    });

    if (recipe.waitForTimeout && recipe.waitForTimeout > 0) {
      await page.waitForTimeout(recipe.waitForTimeout);
    }

    const video = page.video();

    for (const step of recipe.steps ?? []) {
      await runRecipeStep(page, step, recipe.cwd);
    }

    if (recipe.duration && recipe.duration > 0) {
      await page.waitForTimeout(recipe.duration * 1000);
    }

    await page.close();
    rawVideoPath = await video?.path();
  } finally {
    if (browserResource) await closeBrowserContext(browserResource);
    await cleanup?.();
  }

  if (!rawVideoPath) {
    throw new Error("Playwright did not produce a video file for the recipe.");
  }

  const viewport = browserResource?.viewport;
  if (!viewport) {
    throw new Error("Playwright did not report a viewport for the recipe recording.");
  }

  await convertRecordedVideo({
    input: rawVideoPath,
    output,
    fps: recipe.fps,
    crf: recipe.crf,
    gifFps: recipe.gifFps,
    gifWidth: recipe.gifWidth
  });

  if (!recipe.keepRawWebm) {
    await safeRemoveFile(rawVideoPath);
  }

  return {
    output,
    rawOutput: recipe.keepRawWebm ? rawVideoPath : undefined,
    url,
    viewport
  };
}

function inferModeFromOutput(output: string): "video" | "thumbnail" {
  const lower = output.toLowerCase();
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return "thumbnail";
  }
  return "video";
}
