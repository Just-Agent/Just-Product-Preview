import { chromium, devices, type Browser, type BrowserContext, type BrowserContextOptions } from "playwright";
import { resolveViewport } from "./device.js";
import { ensureDir } from "./fs.js";
import type { BrowserSetupOptions, ViewportSize } from "./types.js";

export interface CreatedBrowserContext {
  browser: Browser;
  context: BrowserContext;
  viewport: ViewportSize;
}

export async function createBrowserContext(options: BrowserSetupOptions = {}): Promise<CreatedBrowserContext> {
  let viewport = resolveViewport(options.viewport);
  const contextOptions: BrowserContextOptions = {};

  if (options.device) {
    const preset = devices[options.device];
    if (!preset) {
      const known = Object.keys(devices).slice(0, 20).join(", ");
      throw new Error(`Unknown Playwright device: ${options.device}. Example devices: ${known}`);
    }
    Object.assign(contextOptions, preset);
    if (preset.viewport) {
      viewport = preset.viewport;
    }
  } else {
    contextOptions.viewport = viewport;
  }

  if (options.userAgent) contextOptions.userAgent = options.userAgent;
  if (typeof options.deviceScaleFactor === "number") contextOptions.deviceScaleFactor = options.deviceScaleFactor;
  if (typeof options.hasTouch === "boolean") contextOptions.hasTouch = options.hasTouch;
  if (typeof options.isMobile === "boolean") contextOptions.isMobile = options.isMobile;

  if (options.recordVideo) {
    const dir = options.recordVideoDir ?? "recordings";
    await ensureDir(dir);
    contextOptions.recordVideo = {
      dir,
      size: options.recordVideoSize ?? viewport
    };
  }

  const executablePath = options.executablePath ?? process.env.JUST_PREVIEW_CHROMIUM_EXECUTABLE;
  const browser = await chromium.launch({
    headless: true,
    executablePath
  });
  const context = await browser.newContext(contextOptions);

  return { browser, context, viewport };
}

export async function closeBrowserContext(resource: CreatedBrowserContext): Promise<void> {
  await resource.context.close().catch(() => undefined);
  await resource.browser.close().catch(() => undefined);
}
