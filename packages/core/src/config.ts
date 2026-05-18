import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { resolvePath } from "./fs.js";

export const DEFAULT_PREVIEW_CONFIG_FILES = [
  "just-preview.config.json",
  "preview.config.json",
  ".just-preview.json"
] as const;

export type PreviewConfigRecord = Record<string, unknown>;

export interface PreviewConfig {
  defaults?: PreviewConfigRecord;
  thumbnail?: PreviewConfigRecord;
  video?: PreviewConfigRecord;
  recipe?: PreviewConfigRecord;
  gif?: PreviewConfigRecord;
  publish?: PreviewConfigRecord;
}

export async function loadJsonConfig<T>(file: string, cwd?: string): Promise<T> {
  const path = resolvePath(cwd, file);
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as T;
}

export async function findPreviewConfig(cwd = process.cwd()): Promise<string | undefined> {
  for (const file of DEFAULT_PREVIEW_CONFIG_FILES) {
    const path = resolve(cwd, file);
    try {
      await access(path, constants.F_OK);
      return path;
    } catch {
      // Continue searching.
    }
  }
  return undefined;
}

export async function loadOptionalPreviewConfig(file?: string, cwd = process.cwd()): Promise<PreviewConfig | undefined> {
  const path = file ? (isAbsolute(file) ? file : resolve(cwd, file)) : await findPreviewConfig(cwd);
  if (!path) return undefined;
  return loadJsonConfig<PreviewConfig>(path);
}

export function mergePreviewOptions<T extends Record<string, unknown>>(...values: Array<Partial<T> | undefined>): Partial<T> {
  const merged: Record<string, unknown> = {};
  for (const value of values) {
    if (!value) continue;
    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) {
        merged[key] = entry;
      }
    }
  }
  return merged as Partial<T>;
}

export function removeUndefinedValues<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}
