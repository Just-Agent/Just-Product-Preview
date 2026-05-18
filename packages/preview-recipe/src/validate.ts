import { isViewportSize, VIEWPORT_PRESETS } from "@just-agent/preview-core";
import type { PreviewRecipe, PreviewRecipeStep } from "./types.js";

export function validateRecipe(recipe: PreviewRecipe): PreviewRecipe {
  if (!recipe || typeof recipe !== "object") {
    throw new Error("Recipe must be an object.");
  }

  if (!recipe.url && !recipe.file && !recipe.html && !recipe.serveCommand) {
    throw new Error("Recipe must provide one of: url, file, html, or serveCommand with serveUrl.");
  }

  if (recipe.serveCommand && !recipe.serveUrl && !recipe.url && !recipe.file && !recipe.html) {
    throw new Error("Recipe serveCommand requires serveUrl unless url, file, or html is also provided.");
  }

  if (!recipe.output) {
    throw new Error("Recipe must provide an output path.");
  }

  if (recipe.mode && recipe.mode !== "video" && recipe.mode !== "thumbnail") {
    throw new Error("Recipe mode must be either video or thumbnail.");
  }

  if (recipe.viewport) validateViewport(recipe.viewport);
  if (recipe.duration !== undefined) assertNonNegativeNumber(recipe.duration, "duration");
  if (recipe.timeout !== undefined) assertPositiveNumber(recipe.timeout, "timeout");
  if (recipe.waitForTimeout !== undefined) assertNonNegativeNumber(recipe.waitForTimeout, "waitForTimeout");
  if (recipe.fps !== undefined) assertPositiveNumber(recipe.fps, "fps");
  if (recipe.crf !== undefined) assertRange(recipe.crf, "crf", 0, 51);
  if (recipe.gifFps !== undefined) assertPositiveNumber(recipe.gifFps, "gifFps");
  if (recipe.gifWidth !== undefined) assertPositiveNumber(recipe.gifWidth, "gifWidth");
  if (recipe.serveTimeout !== undefined) assertPositiveNumber(recipe.serveTimeout, "serveTimeout");
  if (recipe.serveInterval !== undefined) assertPositiveNumber(recipe.serveInterval, "serveInterval");
  if (recipe.serveGraceMs !== undefined) assertPositiveNumber(recipe.serveGraceMs, "serveGraceMs");
  if (recipe.serveCommand !== undefined) assertString(recipe.serveCommand, "serveCommand");
  if (recipe.serveUrl !== undefined) assertString(recipe.serveUrl, "serveUrl");
  if (recipe.serveCwd !== undefined) assertString(recipe.serveCwd, "serveCwd");
  if (recipe.serveProbeMethod !== undefined && recipe.serveProbeMethod !== "GET" && recipe.serveProbeMethod !== "HEAD") {
    throw new Error("serveProbeMethod must be GET or HEAD.");
  }

  for (const step of recipe.steps ?? []) {
    validateStep(step);
  }

  return recipe;
}

function validateStep(step: PreviewRecipeStep): void {
  if (!step || typeof step !== "object" || !("type" in step)) {
    throw new Error("Invalid recipe step.");
  }

  switch (step.type) {
    case "wait":
      assertNonNegativeNumber(step.ms, "wait.ms");
      break;
    case "scroll":
      if (step.to !== undefined) assertNumber(step.to, "scroll.to");
      if (step.by !== undefined) assertNumber(step.by, "scroll.by");
      if (step.duration !== undefined) assertPositiveNumber(step.duration, "scroll.duration");
      break;
    case "click":
    case "hover":
      assertString(step.selector, `${step.type}.selector`);
      if (step.timeout !== undefined) assertPositiveNumber(step.timeout, `${step.type}.timeout`);
      break;
    case "fill":
      assertString(step.selector, "fill.selector");
      assertString(step.text, "fill.text");
      if (step.timeout !== undefined) assertPositiveNumber(step.timeout, "fill.timeout");
      break;
    case "press":
      assertString(step.key, "press.key");
      if (step.selector !== undefined) assertString(step.selector, "press.selector");
      if (step.timeout !== undefined) assertPositiveNumber(step.timeout, "press.timeout");
      break;
    case "screenshot":
      assertString(step.output, "screenshot.output");
      break;
    default:
      throw new Error(`Unsupported recipe step: ${(step as { type?: string }).type}`);
  }
}

function validateViewport(viewport: PreviewRecipe["viewport"]): void {
  if (typeof viewport === "string") {
    if (!(viewport in VIEWPORT_PRESETS)) throw new Error(`Unknown viewport preset in recipe: ${viewport}`);
    return;
  }
  if (!isViewportSize(viewport)) {
    throw new Error("Recipe viewport must be a preset or { width, height }.");
  }
}

function assertNumber(value: unknown, name: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Expected ${name} to be a number.`);
}

function assertPositiveNumber(value: unknown, name: string): asserts value is number {
  assertNumber(value, name);
  if (value <= 0) throw new Error(`Expected ${name} to be greater than 0.`);
}

function assertNonNegativeNumber(value: unknown, name: string): asserts value is number {
  assertNumber(value, name);
  if (value < 0) throw new Error(`Expected ${name} to be 0 or greater.`);
}


function assertRange(value: unknown, name: string, min: number, max: number): asserts value is number {
  assertNumber(value, name);
  if (value < min || value > max) throw new Error(`Expected ${name} to be between ${min} and ${max}.`);
}

function assertString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`Expected ${name} to be a non-empty string.`);
}
