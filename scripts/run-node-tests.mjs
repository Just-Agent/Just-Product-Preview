#!/usr/bin/env node
import { readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const roots = process.argv.slice(2);
const searchRoots = roots.length > 0 ? roots : ["dist"];
const files = [];

for (const root of searchRoots) {
  await collectTestFiles(resolve(process.cwd(), root), files);
}

files.sort();

if (files.length === 0) {
  console.log("No compiled Node test files found. Skipping node --test.");
  process.exit(0);
}

console.log(`Running ${files.length} compiled Node test file(s).`);
const child = spawn(process.execPath, ["--test", ...files], {
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`node --test exited from signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});

async function collectTestFiles(path, output) {
  let info;
  try {
    info = await stat(path);
  } catch {
    return;
  }

  if (info.isFile()) {
    if (isTestFile(path)) output.push(path);
    return;
  }

  if (!info.isDirectory()) return;

  const entries = await readdir(path, { withFileTypes: true });
  for (const entry of entries) {
    await collectTestFiles(join(path, entry.name), output);
  }
}

function isTestFile(path) {
  return /(?:^|[./\\])[^/\\]+\.(?:test|spec)\.js$/i.test(path);
}
