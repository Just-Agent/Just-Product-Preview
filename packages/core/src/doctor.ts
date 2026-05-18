import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import { promisify } from "node:util";
import { chromium } from "playwright";
import { resolveFfmpegExecutable } from "./ffmpeg.js";

const execFileAsync = promisify(execFile);

export type DoctorStatus = "ok" | "warn" | "error";

export interface DoctorCheck {
  name: string;
  status: DoctorStatus;
  message: string;
}

export interface DoctorReport {
  ok: boolean;
  checks: DoctorCheck[];
}

export async function runPreviewDoctor(): Promise<DoctorReport> {
  const checks: DoctorCheck[] = [];

  checks.push(checkNodeVersion());
  checks.push(await checkFfmpeg());
  checks.push(await checkPlaywrightChromium());

  return {
    ok: checks.every((check) => check.status !== "error"),
    checks
  };
}

function checkNodeVersion(): DoctorCheck {
  const major = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
  if (major >= 18) {
    return {
      name: "Node.js",
      status: "ok",
      message: `Node.js ${process.version} is supported.`
    };
  }

  return {
    name: "Node.js",
    status: "error",
    message: `Node.js ${process.version} is too old. Use Node.js 18 or newer.`
  };
}

async function checkFfmpeg(): Promise<DoctorCheck> {
  const executable = await resolveFfmpegExecutable();
  if (!executable) {
    return {
      name: "FFmpeg",
      status: "warn",
      message: "FFmpeg was not found on PATH or in the Playwright browser cache. MP4, MOV, and GIF conversion will fail; WebM output can still work."
    };
  }

  try {
    const result = await execFileAsync(executable, ["-version"], { timeout: 5_000 });
    const firstLine = result.stdout.split("\n")[0] ?? "ffmpeg is available";
    return {
      name: "FFmpeg",
      status: "ok",
      message: executable === "ffmpeg" ? firstLine : `${firstLine} (${executable})`
    };
  } catch {
    return {
      name: "FFmpeg",
      status: "warn",
      message: `FFmpeg executable could not be run at ${executable}. MP4, MOV, and GIF conversion will fail; WebM output can still work.`
    };
  }
}

async function checkPlaywrightChromium(): Promise<DoctorCheck> {
  const override = process.env.JUST_PREVIEW_CHROMIUM_EXECUTABLE;
  if (override) {
    try {
      await access(override);
      return {
        name: "Chromium executable",
        status: "ok",
        message: `Using JUST_PREVIEW_CHROMIUM_EXECUTABLE at ${override}`
      };
    } catch {
      return {
        name: "Chromium executable",
        status: "error",
        message: `JUST_PREVIEW_CHROMIUM_EXECUTABLE points to a missing file: ${override}`
      };
    }
  }

  try {
    const executablePath = chromium.executablePath();
    await access(executablePath);
    return {
      name: "Playwright Chromium",
      status: "ok",
      message: `Chromium executable found at ${executablePath}`
    };
  } catch {
    return {
      name: "Playwright Chromium",
      status: "error",
      message: "Chromium browser binaries are missing. Run: pnpm --filter @just-agent/preview-core exec playwright install chromium, or set JUST_PREVIEW_CHROMIUM_EXECUTABLE to a local Chromium/Chrome binary."
    };
  }
}
