#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const name = process.argv[2];

if (!name || !/^[a-z0-9-]+$/.test(name)) {
  throw new Error("Usage: node ../../scripts/write-example-dist.mjs <example-name>");
}

const outputDir = resolve(process.cwd(), "dist");
await mkdir(outputDir, { recursive: true });
await writeFile(resolve(outputDir, "README.txt"), `${name} example\n`, "utf8");
