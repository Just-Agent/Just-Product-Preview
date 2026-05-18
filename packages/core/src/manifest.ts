import { writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { prepareOutputFile } from "./output.js";
import type { PreviewResult, ViewportSize } from "./types.js";

export interface PreviewArtifactManifest {
  schemaVersion: "1";
  tool: "just-preview";
  version: string;
  command: string;
  generatedAt: string;
  source: {
    url: string;
  };
  output: {
    path: string;
    filename: string;
    format: string;
    rawPath?: string;
  };
  viewport: ViewportSize;
  metadata?: Record<string, unknown>;
}

export interface WritePreviewManifestOptions {
  path: string;
  version: string;
  command: string;
  result: PreviewResult;
  metadata?: Record<string, unknown>;
}

export function createPreviewManifest(options: Omit<WritePreviewManifestOptions, "path">): PreviewArtifactManifest {
  return {
    schemaVersion: "1",
    tool: "just-preview",
    version: options.version,
    command: options.command,
    generatedAt: new Date().toISOString(),
    source: {
      url: options.result.url
    },
    output: {
      path: options.result.output,
      filename: basename(options.result.output),
      format: formatFromPath(options.result.output),
      rawPath: options.result.rawOutput
    },
    viewport: options.result.viewport,
    metadata: options.metadata
  };
}

export async function writePreviewManifest(options: WritePreviewManifestOptions): Promise<string> {
  const path = await prepareOutputFile(options.path);
  const manifest = createPreviewManifest(options);
  await writeFile(path, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return path;
}

export function formatFromPath(path: string): string {
  const ext = extname(path).replace(/^\./, "").toLowerCase();
  return ext || "unknown";
}
