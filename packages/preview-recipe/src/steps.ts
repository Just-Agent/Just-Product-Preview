import type { Page } from "playwright";
import { prepareOutputFile, resolvePath } from "@just-agent/preview-core";
import type { PreviewRecipeStep } from "./types.js";

export async function runRecipeStep(page: Page, step: PreviewRecipeStep, cwd?: string): Promise<void> {
  switch (step.type) {
    case "wait":
      await page.waitForTimeout(step.ms);
      return;

    case "scroll":
      await runScrollStep(page, step);
      return;

    case "click":
      await page.locator(step.selector).click({ timeout: step.timeout });
      return;

    case "fill":
      await page.locator(step.selector).fill(step.text, { timeout: step.timeout });
      return;

    case "hover":
      await page.locator(step.selector).hover({ timeout: step.timeout });
      return;

    case "press":
      if (step.selector) {
        await page.locator(step.selector).press(step.key, { timeout: step.timeout });
      } else {
        await page.keyboard.press(step.key);
      }
      return;

    case "screenshot": {
      const output = resolvePath(cwd, step.output);
      await prepareOutputFile(output);
      await page.screenshot({ path: output, fullPage: step.fullPage ?? false });
      return;
    }
  }
}

async function runScrollStep(page: Page, step: Extract<PreviewRecipeStep, { type: "scroll" }>): Promise<void> {
  const duration = step.duration ?? 800;
  const frames = Math.max(1, Math.round(duration / 50));

  if (typeof step.to === "number") {
    const current = await page.evaluate(() => window.scrollY);
    const delta = step.to - current;
    for (let index = 1; index <= frames; index += 1) {
      const y = current + (delta * index) / frames;
      await page.evaluate((value: number) => window.scrollTo({ top: value }), y);
      await page.waitForTimeout(50);
    }
    return;
  }

  const by = step.by ?? 600;
  const perFrame = by / frames;
  for (let index = 0; index < frames; index += 1) {
    await page.mouse.wheel(0, perFrame);
    await page.waitForTimeout(50);
  }
}
