import { copyFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getLowerExtension, prepareOutputFile, resolveFfmpegExecutable } from "@just-agent/preview-core";

const execFileAsync = promisify(execFile);

export interface ConvertVideoOptions {
  input: string;
  output: string;
  fps?: number;
  crf?: number;
  preset?: "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium" | "slow" | "slower" | "veryslow";
  /** GIF export FPS. Used only when output ends with .gif. */
  gifFps?: number;
  /** GIF export width. Height is auto-calculated. Used only when output ends with .gif. */
  gifWidth?: number;
}

export async function convertRecordedVideo(options: ConvertVideoOptions): Promise<void> {
  await prepareOutputFile(options.output);
  const ext = getLowerExtension(options.output);

  if (ext === ".webm") {
    await copyFile(options.input, options.output);
    return;
  }

  if (ext === ".gif") {
    await convertToGif(options);
    return;
  }

  if (ext !== ".mp4" && ext !== ".mov") {
    throw new Error(`Unsupported video output extension: ${ext}. Use .webm, .mp4, .mov, or .gif.`);
  }

  const args = [
    "-y",
    "-i",
    options.input,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-preset",
    options.preset ?? "veryfast",
    "-crf",
    String(options.crf ?? 23)
  ];

  if (options.fps) {
    args.push("-r", String(options.fps));
  }

  args.push(options.output);

  await runFfmpeg(args, ext);
}

async function convertToGif(options: ConvertVideoOptions): Promise<void> {
  const fps = options.gifFps ?? options.fps ?? 15;
  const width = options.gifWidth ?? 960;
  const filter = `fps=${fps},scale=${width}:-1:flags=lanczos`;

  await runFfmpeg([
    "-y",
    "-i",
    options.input,
    "-vf",
    filter,
    "-loop",
    "0",
    options.output
  ], ".gif");
}

async function runFfmpeg(args: string[], ext: string): Promise<void> {
  const executable = await resolveFfmpegExecutable();
  if (!executable) {
    throw new Error(
      `Failed to convert recorded WebM to ${ext}. Install FFmpeg, run pnpm browsers:install, set JUST_PREVIEW_FFMPEG_EXECUTABLE, or output .webm instead.`
    );
  }

  try {
    await execFileAsync(executable, args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to convert recorded WebM to ${ext}. Install FFmpeg or output .webm instead. Details: ${message}`
    );
  }
}
