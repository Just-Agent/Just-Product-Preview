# Iteration Log

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

### Current version

`0.4.0`

### Added features

- Added `@just-agent/preview-publisher` package.
- Added `just-preview publish` command.
- Added Markdown outputs for PR comments, README snippets, preview galleries, and release notes.
- Added publish config support in `just-preview.config.json` and the JSON schema.
- Added one-level manifest glob expansion for publish workflows.
- Added root and local composite action metadata.
- Added `docs/publishing.md` and `examples/publish-workflow`.
- Added publish sample scripts.
- Added source-level publisher tests for README, PR comment, gallery, and release-note Markdown.

### Modified files

The full file list is recorded in `logs/file-manifest.md` and `SOURCE_MANIFEST.md`.

High-impact modified areas:

- `README.md`
- `README.zh-CN.md`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `LOGS.md`
- `packages/preview-publisher/*`
- `packages/core/src/config.ts`
- `apps/cli/src/*`
- `apps/cli/README.md`
- `docs/*`
- `examples/publish-workflow/*`
- `.github/workflows/*`
- `action.yml`
- `schema/just-preview.config.schema.json`
- `scripts/check-release.mjs`

### Fixed or improved

- Improved the post-capture workflow by generating ready-to-share Markdown from manifests.
- Improved CLI UX by adding `publish` help, defaults, config support, and glob-friendly manifest loading.
- Improved GitHub Action usability by adding a reusable composite action entrypoint.
- Improved product retention by making output artifacts easier to embed in READMEs, PRs, and releases.
- Improved docs with concrete publish and Agent final-response workflows.

### Product experience improvements

- A user can now capture assets, write manifests, and create README/PR/release Markdown without manual copywriting.
- A maintainer can upload the full `outputs/` directory and include generated PR comment Markdown as an artifact.
- An Agent can produce visual proof plus a final Markdown handoff in one deterministic flow.
- A repository can adopt Just-Preview as a reusable preview action rather than only a CLI script.

### Validation status

- JSON parsing passed for all JSON files.
- Docs static build passed.
- Release consistency check passed.
- `pnpm install` failed in this container because Corepack attempted to download pnpm from the npm registry and DNS resolution failed.
- Full build, typecheck, lint, tests, and browser smoke tests still need a normal networked Node/pnpm environment.

### Still incomplete

- Full dependency-based build validation could not be completed in this container.
- No automatic GitHub PR comment posting step is bundled yet.
- No README snippet insertion/update command exists yet.
- No HTML gallery output exists yet.
- Publisher Markdown unit tests still need to be added after dependency installation is available.

### Next iteration recommendation

Move to `v0.5.0` and focus on publishing automation: PR comment posting examples, README snippet insertion, HTML gallery generation, stronger publisher tests, and deeper Agent integration docs.

## 2026-05-18 / v0.3.0

### Current version

`0.3.0`

### Added features

- Added `just-preview plan` for no-browser capture planning.
- Added `just-preview validate` for config and recipe validation.
- Added `--manifest` to capture commands for Agent-readable artifact metadata.
- Added manifest helpers in `@just-agent/preview-core`.
- Added local app serving lifecycle integration in thumbnail, video, and recipe capture flows.
- Added `PreviewServeOptions` to the core type surface.
- Added `examples/local-app` with server, config, recipe, README, and product-style HTML page.
- Added `docs/manifest-and-plan.md`.
- Added no-dependency release validation scripts.
- Added PR preview recipe.

### Modified files

The full file list is recorded in `logs/file-manifest.md` and `SOURCE_MANIFEST.md`.

High-impact modified areas:

- `README.md`
- `README.zh-CN.md`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `LOGS.md`
- `packages/core/src/*`
- `packages/html2video/src/index.ts`
- `packages/html2thumbnail/src/index.ts`
- `packages/preview-recipe/src/index.ts`
- `apps/cli/src/*`
- `docs/*`
- `examples/local-app/*`
- `recipes/*`
- `.github/workflows/*`
- `scripts/*`

### Fixed or improved

- Fixed missing serve option typing by defining `PreviewServeOptions`.
- Connected existing server utilities to the capture packages.
- Improved CLI UX with plan, validate, manifest, local app serving, and cwd flags.
- Improved GitHub Actions with plan and manifest artifacts.
- Improved release quality with JSON validation and version consistency checks.
- Improved docs and README copy for Agent-native preflight workflows.

### Product experience improvements

- A user can now preflight a capture before starting Playwright.
- An Agent can generate a structured manifest that describes the exact artifact it produced.
- A CI workflow can validate recipes, create a plan, and then upload preview assets and manifests together.
- A local frontend app can be started, captured, and stopped automatically.

### Validation status

- JSON parsing passed for all JSON files.
- Node.js and FFmpeg were detected.
- `pnpm install` failed in this container because Corepack attempted to download pnpm from the npm registry and DNS resolution failed.
- Direct TypeScript checking was attempted but could not complete without installed dependencies such as Playwright and `@types/node`.
- Release check passed after v0.3.0 file manifests were generated.

### Still incomplete

- Full build, typecheck, lint, test, and CLI smoke tests still need to be run in a normal Node/pnpm environment with dependencies installed.
- No reusable GitHub Action package exists yet.
- No PR comment Markdown generator exists yet.
- No preview gallery output exists yet.
- No README embed snippet generator exists yet.

### Next iteration recommendation

Move to `v0.4.0` and focus on GitHub Action polish: reusable action package, manifest-driven PR comment Markdown, artifact naming, preview gallery output, and README embed snippet generation.

## 2026-05-18 / v0.2.0

### Current version

`0.2.0`

### Added features

- Added GIF output support through `@just-agent/html2video`.
- Added `just-preview gif` CLI command.
- Added `just-preview init` starter workflow.
- Added `just-preview doctor` environment diagnostics.
- Added `just-preview devices` viewport and Playwright device discovery.
- Added config-file workflow through `just-preview.config.json`.
- Added JSON schema for config files.
- Added docs pages and a static docs builder.
- Added configured-project example.
- Added release workflow template.

### Modified files

The full file list is recorded in `logs/file-manifest.md` and `SOURCE_MANIFEST.md`.

High-impact modified areas:

- `README.md`
- `README.zh-CN.md`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `packages/core/src/*`
- `packages/html2video/src/*`
- `packages/html2thumbnail/src/*`
- `packages/preview-recipe/src/*`
- `apps/cli/src/*`
- `docs/*`
- `examples/configured-project/*`
- `.github/workflows/*`

### Fixed or improved

- Better target validation for URL, file, and raw HTML inputs.
- Localhost URL normalization.
- Thumbnail extension and JPEG quality validation.
- Raw WebM cleanup after conversion unless explicitly kept.
- More complete recipe validation.
- Better CLI help and Agent-friendly JSON output.
- Better README product positioning around monorepo and Agent-native preview workflows.

### Product experience improvements

- A new user can run `just-preview init`, inspect generated files, and immediately understand the config-first workflow.
- A CI user can run `just-preview doctor` before generating artifacts.
- An Agent can call the CLI with `--json` and parse output paths.
- README and docs now make the “Preview what your Agent built” value proposition clearer.

### Validation status

- JSON parsing passed for all JSON files.
- Node.js and FFmpeg were detected.
- `pnpm` could not be used in the container because Corepack attempted to download pnpm from npm registry and network resolution failed, so dependency installation, monorepo build, typecheck, lint, tests, and CLI smoke tests could not be fully executed.
- A direct TypeScript attempt failed because dependencies were not installed. Details are in `logs/validation-v0.2.0.md`.

### Still incomplete

- No generated preview media assets are bundled yet.
- No reusable GitHub Action package exists yet.
- No PR comment automation exists yet.
- No preview gallery output exists yet.
- Full build should be verified after running `pnpm install` and `pnpm exec playwright install chromium`.

### Next iteration recommendation

Move to `v0.3.0` and focus on GitHub Action polish: reusable action package, artifact naming, PR comment Markdown, generated README snippets, and preview gallery output.

## 2026-05-18 / v0.1.0

Initial monorepo MVP delivered as `Just-Preview-v0.1.0.zip`.
