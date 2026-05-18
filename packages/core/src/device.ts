import { devices } from "playwright";
import type { ViewportPreset, ViewportSize } from "./types.js";

export const VIEWPORT_PRESETS: Record<ViewportPreset, ViewportSize> = {
  desktop: { width: 1280, height: 720 },
  mobile: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  wide: { width: 1920, height: 1080 },
  square: { width: 1080, height: 1080 }
};

export function isViewportSize(value: unknown): value is ViewportSize {
  if (!value || typeof value !== "object") return false;
  const maybe = value as Partial<ViewportSize>;
  return typeof maybe.width === "number" && Number.isFinite(maybe.width) && typeof maybe.height === "number" && Number.isFinite(maybe.height);
}

export function resolveViewport(viewport?: ViewportPreset | ViewportSize): ViewportSize {
  if (!viewport) return VIEWPORT_PRESETS.desktop;
  if (typeof viewport === "string") {
    const preset = VIEWPORT_PRESETS[viewport];
    if (!preset) {
      throw new Error(`Unknown viewport preset: ${viewport}`);
    }
    return preset;
  }
  if (!isViewportSize(viewport)) {
    throw new Error("Invalid viewport. Expected preset string or { width, height }.");
  }
  return {
    width: Math.round(viewport.width),
    height: Math.round(viewport.height)
  };
}

export function parseViewport(value: string | undefined): ViewportPreset | ViewportSize | undefined {
  if (!value) return undefined;
  if (value in VIEWPORT_PRESETS) return value as ViewportPreset;

  const match = value.match(/^(\d+)x(\d+)$/i);
  if (match) {
    const width = Number.parseInt(match[1]!, 10);
    const height = Number.parseInt(match[2]!, 10);
    if (width <= 0 || height <= 0) {
      throw new Error(`Invalid viewport value: ${value}. Width and height must be greater than 0.`);
    }
    return { width, height };
  }

  throw new Error(`Invalid viewport value: ${value}. Use a preset or WIDTHxHEIGHT, for example 1280x720.`);
}

export function listViewportPresets(): Array<{ name: ViewportPreset; width: number; height: number }> {
  return Object.entries(VIEWPORT_PRESETS).map(([name, viewport]) => ({
    name: name as ViewportPreset,
    width: viewport.width,
    height: viewport.height
  }));
}

export function listPlaywrightDevices(): string[] {
  return Object.keys(devices).sort((a, b) => a.localeCompare(b));
}
