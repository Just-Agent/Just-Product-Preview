# Just-Preview Implementation Logs

## 2026-05-18 / v0.4.1

### Current version

`0.4.1`

### Added features

- Added dependency lockfile `pnpm-lock.yaml`.
- Added release checklist file and validation script.
- Added compiled Node test runner without `|| true`.
- Added smoke scripts for publish outputs, Action defaults, and local capture outputs.
- Added static smoke server for dependency-free local HTML capture.
- Added Chromium executable override through CLI and `JUST_PREVIEW_CHROMIUM_EXECUTABLE`.

### Modified files

The full file list is recorded in `logs/file-manifest.md` and `SOURCE_MANIFEST.md`.

High-impact modified areas:

- `package.json` and all workspace package manifests
- `pnpm-lock.yaml`
- `turbo.json`
- `action.yml` and `.github/actions/just-preview/action.yml`
- `.github/workflows/*`
- `packages/core/src/browser.ts`
- `packages/core/src/server.ts`
- `packages/core/src/doctor.ts`
- `packages/core/src/types.ts`
- `apps/cli/src/index.ts`
- `apps/cli/src/help.ts`
- `schema/just-preview.config.schema.json`
- `scripts/*`
- `README.md`, `README.zh-CN.md`, docs, changelog, and release logs

### Fixed or improved

- Fixed CLI TypeScript compilation issue surfaced after dependency installation.
- Fixed `--serve-command` cleanup hanging by stopping process groups instead of only shell parents.
- Fixed reusable Action default output names for thumbnail, video, GIF, plan, recipe, and publish commands.
- Improved Action and workflow installs with frozen lockfile and Playwright `chromium ffmpeg`.
- Improved npm readiness with package metadata and public publish configuration.
- Improved CI trust by removing test scripts that masked failures.

### Product experience improvements

- New users get deterministic installs from the lockfile.
- Maintainers get a checklist that makes future zip releases repeatable.
- CI users get command-specific artifact names without surprising `.mp4` defaults for thumbnails.
- Agent workflows can use smoke scripts to prove artifacts were actually generated.
- Local serving is less likely to leave orphaned dev-server processes after capture.

### Validation status

Passed:

- `pnpm install --frozen-lockfile`
- `pnpm build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm smoke:publish`
- `pnpm smoke:action-inputs`
- `pnpm smoke:local-html`

Environment notes:

- `pnpm exec playwright install chromium ffmpeg` could not download browser assets because Playwright CDN DNS resolution failed in this container.
- Browser smoke validation used `JUST_PREVIEW_CHROMIUM_EXECUTABLE=/usr/bin/chromium`.
- Playwright FFmpeg validation used a local system FFmpeg shim because the Playwright FFmpeg download had the same DNS failure.

### Still incomplete

- No external consumer-repository GitHub Action test has been run yet.
- No npm publish dry-run workflow has been added yet.
- No automatic PR comment posting command is bundled yet.
- No README snippet insertion/update command exists yet.

### Next iteration recommendation

Move to `v0.5.0` and focus on npm publish dry-run, external GitHub Action consumer testing, README snippet insertion, and an HTML preview gallery generator.

## 2026-05-18 / v0.4.0

### Execution Summary

Continued iteration from `Just-Preview-v0.3.0.zip` and produced the next version: `Just-Preview-v0.4.0.zip`.

This release keeps the required monorepo architecture and improves the project toward a publishable, deployable, user-retaining open-source product by adding manifest-driven publishing surfaces.

### Requirements Preserved

- Repository remains `Just-Agent/Just-Product-Preview`.
- The project remains a monorepo single-repository / multi-package toolkit.
- README explicitly states: `This repository uses a monorepo architecture.`
- Chinese README explicitly states: `Just-Preview 使用 monorepo 单仓多包架构。`
- Core commands remain supported:
  - `just-preview thumbnail --url https://example.com --out cover.png`
  - `just-preview video --url https://example.com --out preview.mp4`
  - `just-preview video --file ./dist/index.html --out preview.mp4`
  - `just-preview recipe ./recipes/landing-page.json`

### Implemented in v0.4.0

- Added `@just-agent/preview-publisher`.
- Added `just-preview publish`.
- Added README, PR comment, gallery, and release-note Markdown generation from manifests.
- Added publish config schema and default init config.
- Added one-level manifest glob support.
- Added reusable composite action entrypoint.
- Added publish workflow example and docs.
- Added publisher Markdown tests for core publish formats, including release-note Markdown.
- Updated GitHub workflows to generate publish-ready Markdown.
- Updated README, Chinese README, CLI docs, Agent docs, quick start, and configuration docs.
- Added validation notes and updated manifests.

### Validation

- JSON parsing passed for all JSON files.
- Docs build smoke test passed.
- Release consistency check passed.
- `pnpm install` could not be used in this container because Corepack attempted to download pnpm from npm registry and DNS/network resolution failed.
- Full build, typecheck, lint, test, and CLI browser smoke tests require dependency installation and should be run in a normal Node/pnpm environment.

### Output Artifact

```txt
Just-Preview-v0.4.0.zip
```

### Next Recommended Version

```txt
Just-Preview-v0.5.0.zip
```

Recommended focus for v0.5.0:

- PR comment posting examples using GitHub Script or `gh`.
- README snippet insertion/update workflow.
- HTML preview gallery generation.
- Publisher unit tests.
- More Agent integration guides.

## 2026-05-18 / v0.3.0

### Execution Summary

Continued iteration from `Just-Preview-v0.2.0.zip` and produced the next version: `Just-Preview-v0.3.0.zip`.

This release keeps the required monorepo architecture and improves the project toward a publishable, deployable, user-retaining open-source product by adding local app serving.

### Requirements Preserved

- Repository remains `Just-Agent/Just-Product-Preview`.
- The project remains a monorepo single-repository / multi-package toolkit.
- README explicitly states: `This repository uses a monorepo architecture.`
- Chinese README explicitly states: `Just-Preview 使用 monorepo 单仓多包架构。`
- Core commands remain supported:
  - `just-preview thumbnail --url https://example.com --out cover.png`
  - `just-preview video --url https://example.com --out preview.mp4`
  - `just-preview video --file ./dist/index.html --out preview.mp4`
  - `just-preview recipe ./recipes/landing-page.json`

### Implemented in v0.3.0

- Added local app serving through `--serve` / `--serve-command`.
- Added `--serve-url` readiness waiting and capture target fallback.
- Added `--serve-cwd`, `--serve-timeout`, `--serve-interval`, `--serve-probe`, `--serve-silent`, and `--serve-grace-ms`.
- Added shared local server process utilities in `@just-agent/preview-core`.
- Added served app support to `@just-agent/html2thumbnail`, `@just-agent/html2video`, and `@just-agent/preview-recipe`.
- Added config schema and recipe validation for local serving.
- Added `examples/local-app` dependency-free local app smoke example.
- Added `recipes/local-app-serving.json`.
- Added local serving docs and README updates.
- Updated GitHub workflows to generate served app preview artifacts.
- Added validation notes and updated manifests.

### Validation

- JSON parsing passed for all JSON files.
- Docs build smoke test passed.
- `pnpm install` could not be used in this container because Corepack attempted to download pnpm from npm registry and DNS/network resolution failed.
- Full build, typecheck, lint, test, and CLI browser smoke tests require dependency installation and should be run in a normal Node/pnpm environment.

### Output Artifact

```txt
Just-Preview-v0.3.0.zip
```

### Next Recommended Version

```txt
Just-Preview-v0.4.0.zip
```

Recommended focus for v0.4.0:

- Reusable GitHub Action package.
- PR comment preview snippets generated from manifest JSON.
- Artifact naming convention.
- Preview gallery output.
- README embed snippet generation.
- More Agent integration guides.

## 2026-05-18 / v0.2.0

### Execution Summary

Continued iteration from `Just-Preview-v0.1.0.zip` and produced the next version: `Just-Preview-v0.2.0.zip`.

This release kept the required monorepo architecture and improved the project toward a publishable, deployable, user-retaining open-source product.

### Implemented in v0.2.0

- Added GIF output and `just-preview gif`.
- Added config-first workflow with `just-preview.config.json`.
- Added `just-preview init`.
- Added `just-preview doctor`.
- Added `just-preview devices`.
- Added config JSON schema.
- Added docs and configured-project example.
- Added release workflow template.
- Added logs directory with iteration, validation, file manifest, and version history.
- Updated README, Chinese README, CHANGELOG, release notes, release manifest, and package versions.

### Output Artifact

```txt
Just-Preview-v0.2.0.zip
```

## 2026-05-18 / v0.1.0

### Execution Summary

Initial source package created for `Just-Agent/Just-Product-Preview`.

### Output Artifact

```txt
Just-Preview-v0.1.0.zip
```
