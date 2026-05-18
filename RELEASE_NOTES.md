# Release Notes

## Just-Preview v0.4.1

Release date: 2026-05-18
Zip filename: `Just-Preview-v0.4.1.zip`

### Product focus

v0.4.1 is a release-hardening patch for the monorepo. It does not chase more feature surface; it makes Just-Preview easier to install, build, test, smoke-test, package, and ship. The release keeps the product positioning: **Preview what your Agent built.**

### Highlights

- Locked dependencies with `pnpm-lock.yaml` and pinned dependency versions.
- Replaced test scripts that used `|| true` with a real compiled Node test runner.
- Added `RELEASE_CHECKLIST.md` and a release checklist validator.
- Added smoke scripts for publish Markdown, GitHub Action defaults, and local capture outputs.
- Fixed local app serving cleanup by killing shell command process groups.
- Fixed GitHub Action defaults so thumbnail/video/GIF/publish commands each get sensible artifact names.
- Added npm publish metadata to all public packages.
- Added local Chromium executable override support for constrained environments.
- Updated CI workflows to use frozen lockfile installs and Playwright `chromium ffmpeg` installs.

### Validation

Completed in this environment:

- `pnpm install --frozen-lockfile`
- `pnpm build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm smoke:publish`
- `pnpm smoke:action-inputs`
- `pnpm smoke:local-html`

Browser smoke testing used `JUST_PREVIEW_CHROMIUM_EXECUTABLE=/usr/bin/chromium` because Playwright CDN DNS resolution was unavailable in this container. Playwright FFmpeg download also failed for the same DNS reason, so this environment used a local system FFmpeg shim for validation. CI workflows now install Playwright `chromium ffmpeg` explicitly.

### Next recommended version

Recommended next version: `v0.5.0`

Suggested focus:

- Add npm publish dry-run workflow.
- Add consumer-repository GitHub Action integration test.
- Add README snippet insertion/update command.
- Add HTML gallery generator.
- Add stronger recipe E2E tests after browser assets are available in CI.

## Just-Preview v0.4.0

Release date: 2026-05-18
Zip filename: `Just-Preview-v0.4.0.zip`

### Product focus

v0.4.0 turns Just-Preview from a capture tool into a capture-to-publish product surface. Generated thumbnails, GIFs, videos, and recipe outputs can now write manifests and then become README snippets, GitHub PR comments, preview galleries, and release-note Markdown.

The release keeps the required monorepo architecture and strengthens the Agent-native slogan: **Preview what your Agent built** now includes a ready-to-share review surface, not just raw media files.

### Highlights

- New `@just-agent/preview-publisher` package in the monorepo.
- New `just-preview publish` CLI command.
- Publish formats: `pr-comment`, `readme`, `gallery`, and `release-note`.
- Manifest glob support for `outputs/*.manifest.json`.
- Config-first publishing through `just-preview.config.json`.
- Reusable composite action entrypoint in `action.yml`.
- Publish workflow example with sample manifests.
- GitHub workflows now generate publish-ready Markdown artifacts.
- Publisher Markdown output includes unit-test coverage for README, PR comment, gallery, and release-note formats.
- Docs and README now cover README Preview Assets and GitHub PR Preview handoff.

### Validation

- JSON validation succeeded with `node scripts/validate-json.mjs`.
- Docs static build succeeded with `node apps/docs/scripts/build.mjs` from the docs app directory.
- Release consistency check succeeded with `node scripts/check-release.mjs`.
- `pnpm install` could not complete in this container because Corepack attempted to download pnpm from the npm registry and DNS/network resolution failed.
- Full monorepo build, typecheck, lint, test, and browser smoke tests should be run in a normal networked Node/pnpm environment.

### Next recommended version

Recommended next version: `v0.5.0`

Suggested focus:

- Add real PR comment posting helper guidance with `gh`/GitHub Script examples.
- Add append/replace README snippet workflows.
- Add an artifact gallery HTML page generator.
- Add deeper Agent integration guides for Claude Code, Codex, Cursor, and Just-Agent.
- Add tests for publisher Markdown output once dependencies are available.


## Just-Preview v0.3.0

Release date: 2026-05-18
Zip filename: `Just-Preview-v0.3.0.zip`

### Product focus

v0.3.0 turns Just-Preview into a more practical product for undeployed frontend apps. It can now start a local app, wait for the preview URL to become ready, capture thumbnails/videos/GIFs/recipes, and stop the app automatically.

The release keeps the required monorepo architecture and strengthens the Agent-native workflow: **Preview what your Agent built** now works even when the app only exists locally.

### Highlights

- `--serve-command` / `--serve` starts a local app before capture.
- `--serve-url` waits for readiness and becomes the capture target when `--url` is omitted.
- `--serve-cwd` supports frontend apps inside a monorepo subdirectory.
- `--serve-silent` hides app logs unless startup fails, which is useful for CI and Agents.
- `@just-agent/html2video`, `@just-agent/html2thumbnail`, and `@just-agent/preview-recipe` all support local serving.
- `examples/local-app` provides a dependency-free app for smoke testing.
- GitHub PR Preview workflow now demonstrates served local app preview artifacts.
- Docs, README, Chinese README, CLI help, config schema, and package READMEs document the new workflow.

### Validation

- JSON validation succeeded with `node scripts/validate-json.mjs`.
- Docs static build succeeded with `node apps/docs/scripts/build.mjs` from the docs app directory.
- `pnpm install` could not complete in this container because Corepack attempted to download pnpm from npm registry and DNS/network resolution failed.
- Full monorepo build, typecheck, lint, test, and browser smoke tests should be run in a normal networked Node/pnpm environment.

### Next recommended version

Recommended next version: `v0.4.0`

Suggested focus:

- Add a reusable GitHub Action package.
- Add generated PR comment Markdown from manifest files.
- Add preview gallery output.
- Add generated README embed snippets.
- Add deeper Agent usage guides for Claude Code, Codex, Cursor, and Just-Agent.
