#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredFiles = [
  "README.md",
  "README.zh-CN.md",
  "CHANGELOG.md",
  "RELEASE_NOTES.md",
  "RELEASE_CHECKLIST.md",
  "logs/iteration-log.md",
  "logs/file-manifest.md",
  "logs/version-history.md",
  "scripts/smoke-local-html.mjs",
  "scripts/smoke-publish.mjs",
  "scripts/smoke-action-inputs.mjs",
  "pnpm-lock.yaml",
  "action.yml",
  ".github/workflows/ci.yml"
];

const root = process.cwd();
const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
if (missing.length > 0) {
  console.error("Release checklist failed. Missing files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const readme = readFileSync(resolve(root, "README.md"), "utf8");
const chineseReadme = readFileSync(resolve(root, "README.zh-CN.md"), "utf8");
const packageJson = readFileSync(resolve(root, "package.json"), "utf8");

for (const phrase of [
  "This repository uses a monorepo architecture.",
  "Agent-native",
  "HTML to Video",
  "HTML to Thumbnail",
  "GitHub PR Preview",
  "Recipe-based Recording",
  "Preview what your Agent built"
]) {
  if (!readme.includes(phrase)) {
    console.error(`README release checklist failed. Missing phrase: ${phrase}`);
    process.exit(1);
  }
}

if (!chineseReadme.includes("Just-Preview 使用 monorepo 单仓多包架构")) {
  console.error("Chinese README release checklist failed. Missing monorepo wording.");
  process.exit(1);
}

if (/"latest"/.test(packageJson)) {
  console.error("Root package.json still contains latest dependency versions.");
  process.exit(1);
}

console.log("Release checklist passed.");
