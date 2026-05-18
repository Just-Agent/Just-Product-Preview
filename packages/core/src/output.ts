import { extname, resolve } from "node:path";
import { ensureParentDir } from "./fs.js";

export function resolveOutputPath(options: {
  output?: string;
  outputDir?: string;
  defaultFilename: string;
  cwd?: string;
}): string {
  const cwd = options.cwd ?? process.cwd();
  const output = options.output
    ? options.output
    : resolve(options.outputDir ?? "outputs", options.defaultFilename);
  return resolve(cwd, output);
}

export async function prepareOutputFile(path: string): Promise<string> {
  await ensureParentDir(path);
  return path;
}

export function getLowerExtension(path: string): string {
  return extname(path).toLowerCase();
}
