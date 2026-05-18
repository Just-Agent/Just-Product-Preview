import { mkdir, mkdtemp, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function ensureParentDir(file: string): Promise<void> {
  await ensureDir(dirname(file));
}

export function resolvePath(cwd: string | undefined, file: string): string {
  return resolve(cwd ?? process.cwd(), file);
}

export async function safeRemoveFile(file: string | undefined): Promise<void> {
  if (!file) return;
  await unlink(file).catch(() => undefined);
}

export async function createTempHtmlFile(html: string): Promise<{ path: string; cleanup: () => Promise<void> }> {
  const dir = await mkdtemp(resolve(tmpdir(), "just-preview-html-"));
  const path = resolve(dir, "index.html");
  await writeFile(path, html, "utf8");
  return {
    path,
    cleanup: async () => {
      await rm(dir, { recursive: true, force: true });
    }
  };
}
