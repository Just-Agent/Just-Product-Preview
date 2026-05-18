#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const action = await readFile(resolve(root, "action.yml"), "utf8");
const nested = await readFile(resolve(root, ".github/actions/just-preview/action.yml"), "utf8");

for (const [label, text] of [["root action.yml", action], ["nested action.yml", nested]]) {
  assert(text.includes("resolved_out="), `${label} should compute dynamic default output paths.`);
  assert(text.includes("outputs/cover.png"), `${label} should default thumbnail output to outputs/cover.png.`);
  assert(text.includes("outputs/preview.gif"), `${label} should default GIF output to outputs/preview.gif.`);
  assert(!/default:\s*outputs\/preview\.mp4/.test(text), `${label} should not force preview.mp4 for every command.`);
  assert(text.includes("pnpm install --frozen-lockfile"), `${label} should install with the generated lockfile.`);
}

console.log("Smoke action input defaults passed.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
