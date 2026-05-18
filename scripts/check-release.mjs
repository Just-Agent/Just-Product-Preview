import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = (await readFile(resolve(root, "VERSION"), "utf8")).trim();
const requiredFiles = [
  "README.md",
  "README.zh-CN.md",
  "CHANGELOG.md",
  "RELEASE_NOTES.md",
  "logs/iteration-log.md",
  "logs/file-manifest.md",
  "logs/version-history.md"
];
const packageFiles = [
  "package.json",
  "packages/core/package.json",
  "packages/html2thumbnail/package.json",
  "packages/html2video/package.json",
  "packages/preview-recipe/package.json",
  "packages/preview-publisher/package.json",
  "apps/cli/package.json",
  "apps/docs/package.json"
];
const failures = [];

for (const file of requiredFiles) {
  try {
    await readFile(resolve(root, file), "utf8");
  } catch {
    failures.push(`Missing required release file: ${file}`);
  }
}

for (const file of packageFiles) {
  const json = JSON.parse(await readFile(resolve(root, file), "utf8"));
  if (json.version !== version) {
    failures.push(`${file} version is ${json.version}, expected ${version}`);
  }
}

const readme = await readFile(resolve(root, "README.md"), "utf8");
const chineseReadme = await readFile(resolve(root, "README.zh-CN.md"), "utf8");
const changelog = await readFile(resolve(root, "CHANGELOG.md"), "utf8");

if (!readme.includes("This repository uses a monorepo architecture.")) failures.push("README.md does not emphasize the monorepo architecture in English.");
if (!chineseReadme.includes("Just-Preview 使用 monorepo 单仓多包架构")) failures.push("README.zh-CN.md does not emphasize the monorepo architecture in Chinese.");
if (!changelog.includes(`## [${version}]`)) failures.push(`CHANGELOG.md does not contain an entry for ${version}.`);

if (failures.length > 0) {
  console.error("Release check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Release check passed for v${version}.`);
}
