import { execFile } from "node:child_process";
import { constants } from "node:fs";
import { access, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function resolveFfmpegExecutable(): Promise<string | undefined> {
  const override = process.env.JUST_PREVIEW_FFMPEG_EXECUTABLE;
  if (override) {
    return (await executableExists(override)) ? override : undefined;
  }

  if (await commandExists("ffmpeg")) {
    return "ffmpeg";
  }

  for (const candidate of await playwrightFfmpegCandidates()) {
    if (await executableExists(candidate)) return candidate;
  }

  return undefined;
}

async function commandExists(command: string): Promise<boolean> {
  try {
    await execFileAsync(command, ["-version"], { timeout: 5_000 });
    return true;
  } catch {
    return false;
  }
}

async function executableExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }
}

async function playwrightFfmpegCandidates(): Promise<string[]> {
  const roots = new Set<string>();
  const configured = process.env.PLAYWRIGHT_BROWSERS_PATH;

  if (configured && configured !== "0") {
    roots.add(resolve(configured));
  }

  roots.add(defaultPlaywrightBrowserRoot());

  const names = ffmpegExecutableNames();
  const candidates: string[] = [];

  for (const root of roots) {
    let entries;
    try {
      entries = await readdir(root, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || !entry.name.startsWith("ffmpeg-")) continue;
      for (const name of names) {
        candidates.push(join(root, entry.name, name));
      }
    }
  }

  return candidates;
}

function defaultPlaywrightBrowserRoot(): string {
  if (process.platform === "win32") {
    return join(process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"), "ms-playwright");
  }

  if (process.platform === "darwin") {
    return join(homedir(), "Library", "Caches", "ms-playwright");
  }

  return join(homedir(), ".cache", "ms-playwright");
}

function ffmpegExecutableNames(): string[] {
  if (process.platform === "win32") return ["ffmpeg-win64.exe"];
  if (process.platform === "darwin") return ["ffmpeg-mac"];
  return ["ffmpeg-linux"];
}
