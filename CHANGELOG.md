# Changelog

All notable changes to Just-Preview will be documented in this file.

The project follows a versioned zip release policy. Every delivered source archive must include a numeric version in the zip filename.

## [0.4.1] - 2026-05-18

### Added

- Added `pnpm-lock.yaml` and pinned dependency versions for release-stable installs.
- Added `RELEASE_CHECKLIST.md` and `scripts/check-release-checklist.mjs` for repeatable release readiness checks.
- Added `scripts/run-node-tests.mjs` so packages can skip missing tests safely without masking real failures.
- Added smoke scripts for local capture, publish Markdown generation, and GitHub Action input defaults.
- Added `scripts/static-smoke-server.mjs` for dependency-free smoke capture of local HTML through a local HTTP server.
- Added `--chromium-executable` / `--executable-path` and `JUST_PREVIEW_CHROMIUM_EXECUTABLE` support for constrained CI environments.

### Improved

- Removed `|| true` from package test scripts so test failures fail CI.
- Updated the reusable GitHub Action to use command-aware default outputs instead of forcing every command to `outputs/preview.mp4`.
- Updated the reusable GitHub Action to install Playwright Chromium and Playwright FFmpeg for video recording.
- Updated CI workflows to use `pnpm install --frozen-lockfile`, Node.js 22, fixed pnpm version, release checklist checks, and smoke scripts.
- Added npm publish metadata to all publishable packages, including license, homepage, bugs, repository directory, keywords, and public publish config.
- Improved local app serving cleanup by stopping shell command process groups, which prevents orphaned dev-server processes after capture.
- Updated docs, README, Chinese README, config schema, examples, and release logs for release-hardening behavior.

### Fixed

- Fixed a TypeScript compile issue in CLI option summarization exposed by full dependency installation.
- Fixed local server shutdown hanging when `--serve-command` starts a shell command that spawns a child process.
- Fixed Action defaults so `thumbnail`, `video`, `gif`, `recipe`, `plan`, and `publish` resolve better output and manifest paths.

### Validation

- `pnpm install --frozen-lockfile` passed.
- `pnpm build` passed.
- `pnpm typecheck` passed.
- `pnpm lint` passed.
- `pnpm test` passed with real compiled Node tests and without `|| true`.
- `pnpm smoke:publish` passed.
- `pnpm smoke:action-inputs` passed.
- `pnpm smoke:local-html` passed using local Chromium through `JUST_PREVIEW_CHROMIUM_EXECUTABLE=/usr/bin/chromium` and a local Playwright FFmpeg shim because Playwright CDN DNS resolution was unavailable in this container.

### Notes

- This is a release-hardening patch. It is appropriate for an Alpha source release and is much closer to npm beta readiness, but v1.0.0 should still wait for external consumer-repo Action testing and npm publish dry-runs.

## [0.4.0] - 2026-05-18

### Added

- Added `@just-agent/preview-publisher`, a new monorepo package that turns Just-Preview artifact manifests into publish-ready Markdown.
- Added `just-preview publish` with `pr-comment`, `readme`, `gallery`, and `release-note` output formats.
- Added one-level manifest glob support such as `--manifest "outputs/*.manifest.json"` for publish workflows.
- Added config-driven publishing through the `publish` section in `just-preview.config.json` and the config schema.
- Added a reusable composite GitHub Action entrypoint in `action.yml`.
- Added `docs/publishing.md` and `examples/publish-workflow` with sample manifests for no-browser publish smoke tests.
- Added root scripts for `publish:sample`, `readme:sample`, and `gallery:sample`.
- Added publisher Markdown unit-test coverage for README, PR comment, gallery, and release-note output.

### Improved

- Updated README and Chinese README to emphasize the new manifest-to-publishing loop for README Preview Assets and GitHub PR Preview.
- Updated CLI help, CLI README, quick start, configuration, Agent workflow, GitHub Actions, and manifest docs with publish examples.
- Updated GitHub workflows to generate PR comment Markdown, README snippets, preview galleries, and release-note Markdown from generated manifests.
- Updated `just-preview init` so starter projects include a default `publish` config section.
- Updated release checks to verify the new `@just-agent/preview-publisher` package version.

### Notes

- This release closes the loop from capture to distribution: generated preview media can now become user-facing Markdown for PRs, READMEs, release notes, docs pages, and Agent final responses.
- Dependency installation still could not be completed in this container because Corepack attempted to download pnpm from the npm registry and DNS resolution failed.
- JSON validation, docs build, and release checks were run successfully; full TypeScript/build/browser smoke tests should be run in a normal networked Node/pnpm environment. Details are recorded in `logs/validation-v0.4.0.md`.

## [0.3.0] - 2026-05-18

### Added

- Added `just-preview plan` to generate preflight capture plans without launching Playwright.
- Added `just-preview validate` to validate config and recipe files before CI or Agent execution.
- Added `--manifest` for thumbnail, video, GIF, and recipe commands to write Agent-readable artifact metadata.
- Added manifest helpers in `@just-agent/preview-core`.
- Added local app serving support across `html2thumbnail`, `html2video`, and `preview-recipe` through `serveCommand`, `serveUrl`, `serveCwd`, `serveTimeout`, `serveSilent`, and related options.
- Added `examples/local-app` with a tiny Node.js server, config, recipe, and product-style preview page.
- Added `docs/manifest-and-plan.md` and expanded CLI, GitHub Actions, quick-start, configuration, and Agent workflow docs.
- Added `scripts/validate-json.mjs` and `scripts/check-release.mjs` for no-dependency release validation.
- Added `recipes/pr-preview.json` for PR-oriented scripted captures.

### Improved

- Strengthened CLI help with plan, validate, manifest, local app serving, and cwd options.
- Updated GitHub Actions to run validation, preflight plans, and manifest-producing smoke captures.
- Updated README and Chinese README to emphasize monorepo, Agent-native workflows, README Preview Assets, GitHub PR Preview, Recipe-based Recording, and manifests.
- Updated package READMEs to document local app serving and manifest workflows.
- Fixed the missing `PreviewServeOptions` type surface so the existing server utilities are exported and usable by packages.
- Added root scripts for JSON validation, release checks, plan smoke output, and manifest smoke output.

### Notes

- This release moves Just-Preview closer to a deployable product by adding preflight safety, structured artifact metadata, local app lifecycle management, and CI-friendly release checks.
- Dependency installation still could not be completed in this container because Corepack attempted to download pnpm from the npm registry and DNS resolution failed.
- TypeScript validation was attempted but could not complete without installed dependencies such as Playwright and `@types/node`. Details are recorded in `logs/validation-v0.3.0.md`.

## [0.2.0] - 2026-05-18

### Added

- Added a more product-ready CLI surface with `just-preview init`, `just-preview doctor`, `just-preview devices`, and `just-preview gif`.
- Added GIF export support through `@just-agent/html2video` using FFmpeg.
- Added config-file loading from `just-preview.config.json`, `preview.config.json`, or `.just-preview.json`.
- Added `just-preview.config.example.json` and a JSON schema for config authoring.
- Added a configured-project example that demonstrates a config-first workflow.
- Added documentation pages for quick start, CLI usage, configuration, recipes, GitHub Actions, and Agent workflows.
- Added a lightweight docs app that generates a static docs landing page from the `/docs` directory.
- Added a release workflow template for smoke-test preview asset generation.
- Added structured logs under `logs/` including iteration log, file manifest, version history, and validation notes.
- Added `VERSION` file for archive-level version tracking.

### Improved

- Strengthened URL and local HTML file target validation.
- Normalized localhost-style URLs such as `localhost:3000` to `http://localhost:3000`.
- Added thumbnail output extension validation for `.png`, `.jpg`, and `.jpeg`.
- Added JPEG quality validation.
- Added raw WebM cleanup by default after MP4/MOV/GIF conversion unless `keepRawWebm` / `--keep-webm` is requested.
- Expanded recipe validation for viewport, timing, selector, and quality-related options.
- Improved README positioning around monorepo, Agent-native workflows, README Preview Assets, and GitHub PR Preview.
- Expanded Chinese README with v0.2.0 product-surface changes.
- Improved GitHub workflow templates with `doctor`, GIF smoke output, and release smoke assets.

### Notes

- This release moves the project from initial MVP toward a reusable product surface.
- Full build validation was not completed in this container because pnpm could not be downloaded through Corepack and Playwright / `@types/node` dependencies were not installed.
- JSON files were parsed successfully and validation limitations are recorded in `logs/validation-v0.2.0.md`.

## [0.1.0] - 2026-05-18

### Added

- Created the initial Just-Preview monorepo.
- Added pnpm workspace configuration.
- Added Turborepo task configuration.
- Added TypeScript base configuration.
- Added `@just-agent/preview-core` package.
- Added `@just-agent/html2video` package.
- Added `@just-agent/html2thumbnail` package.
- Added `@just-agent/preview-recipe` package.
- Added `just-preview` CLI app.
- Added URL to thumbnail support.
- Added local HTML file to thumbnail support.
- Added URL to video support.
- Added local HTML file to video support.
- Added WebM output support.
- Added FFmpeg-based MP4 conversion helper.
- Added Playwright device support through device names.
- Added viewport presets: `desktop`, `mobile`, `tablet`, `wide`, and `square`.
- Added recipe mode with wait, scroll, click, fill, hover, press, and screenshot steps.
- Added example recipes.
- Added GitHub Actions CI and preview workflow templates.
- Added README sections emphasizing monorepo architecture.
- Added Chinese README explanation.
- Added release manifest and implementation log.

### Notes

- This was the initial MVP source package.
- Runtime video generation requires Chromium browser binaries installed by Playwright.
- MP4 conversion requires FFmpeg available on the system path.
