import { access } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { createTempHtmlFile, resolvePath } from "./fs.js";
import type { PreviewTarget, ResolvedPreviewTarget } from "./types.js";

export async function resolvePreviewTarget(target: PreviewTarget, cwd?: string): Promise<ResolvedPreviewTarget> {
  const provided = [target.url, target.file, target.html].filter((value) => value !== undefined && value !== "");

  if (provided.length > 1) {
    throw new Error("Provide only one preview target: --url, --file, or --html.");
  }

  if (target.url) {
    return { url: normalizePreviewUrl(target.url) };
  }

  if (target.file) {
    const filePath = resolvePath(cwd, target.file);
    try {
      await access(filePath);
    } catch {
      throw new Error(`HTML file not found: ${filePath}`);
    }
    return { url: pathToFileURL(filePath).toString() };
  }

  if (target.html) {
    const temp = await createTempHtmlFile(target.html);
    return {
      url: pathToFileURL(temp.path).toString(),
      cleanup: temp.cleanup
    };
  }

  throw new Error("No preview target provided. Provide one of: --url, --file, or --html.");
}

export function normalizePreviewUrl(input: string): string {
  const trimmed = input.trim();
  const looksLikeLocalhost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/.*)?$/i.test(trimmed);
  const value = looksLikeLocalhost ? `http://${trimmed}` : trimmed;

  try {
    const parsed = new URL(value);
    if (!["http:", "https:", "file:"].includes(parsed.protocol)) {
      throw new Error("unsupported protocol");
    }
    return parsed.toString();
  } catch {
    throw new Error(`Invalid URL: ${input}. Use a full URL such as https://example.com or http://localhost:3000.`);
  }
}
