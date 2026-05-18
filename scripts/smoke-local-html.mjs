#!/usr/bin/env node
import { existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(root, "apps/cli/dist/index.js");
const smokeUrl = "http://127.0.0.1:4199";
const serveArgs = ["--serve-command", "node scripts/static-smoke-server.mjs", "--serve-url", smokeUrl, "--serve-silent"];
const outputs = join(root, "outputs/smoke");
const cover = join(outputs, "local-html-cover.png");
const preview = join(outputs, "local-html-preview.webm");
const gif = join(outputs, "local-html-preview.gif");
const manifest = join(outputs, "local-html-video.manifest.json");

await mkdir(outputs, { recursive: true });

if (!existsSync(cli)) {
  throw new Error("CLI is not built. Run pnpm build before pnpm smoke:local-html.");
}

await run("thumbnail", ["thumbnail", ...serveArgs, "--out", cover, "--wait", "100"]);
await assertFile(cover, 1000);

await run("video", ["video", ...serveArgs, "--out", preview, "--duration", "1", "--wait", "100", "--manifest", manifest]);
await assertFile(preview, 1000);
await assertFile(manifest, 100);

await run("gif", ["gif", ...serveArgs, "--out", gif, "--duration", "1", "--wait", "100", "--gif-width", "640"]);
await assertFile(gif, 1000);

console.log("Smoke local HTML capture passed.");

async function run(label, args) {
  console.log(`Running smoke ${label}: just-preview ${args.join(" ")}`);
  await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd: root,
      stdio: "inherit",
      env: process.env
    });
    child.on("exit", (code, signal) => {
      if (signal) reject(new Error(`${label} smoke exited from signal ${signal}`));
      else if (code !== 0) reject(new Error(`${label} smoke failed with exit code ${code}`));
      else resolvePromise();
    });
  });
}

async function assertFile(path, minBytes) {
  const info = await stat(path);
  if (info.size < minBytes) {
    throw new Error(`Smoke artifact is too small: ${path} (${info.size} bytes)`);
  }
}
