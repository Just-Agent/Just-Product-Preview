# Validation Notes for v0.4.1

Date: 2026-05-18
Version: 0.4.1
Zip filename: `Just-Preview-v0.4.1.zip`

## Commands run

Passed in this container:

```bash
npm install -g pnpm@10.33.4
pnpm install
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm smoke:publish
pnpm smoke:action-inputs
JUST_PREVIEW_CHROMIUM_EXECUTABLE=/usr/bin/chromium pnpm smoke:local-html
```

Also passed as part of release validation:

```bash
pnpm validate:json
pnpm release:check
pnpm release:checklist
```

## Browser asset note

`pnpm exec playwright install chromium ffmpeg` was attempted, but Playwright CDN DNS resolution failed in this container with `getaddrinfo EAI_AGAIN` for the Playwright CDN hosts. Because `/usr/bin/chromium` was available locally, browser smoke validation used:

```bash
JUST_PREVIEW_CHROMIUM_EXECUTABLE=/usr/bin/chromium
```

The container's system Chromium originally had managed URL-block policies, so validation used the local environment only after confirming the policy issue was environment-specific. CI workflows in the project now install Playwright `chromium ffmpeg` explicitly and should not need the local executable override.

Playwright's own FFmpeg browser asset could not be downloaded for the same DNS reason. For this container-only validation, a local system FFmpeg shim was used to satisfy Playwright's recorder path. The project workflows install Playwright FFmpeg through:

```bash
pnpm exec playwright install chromium ffmpeg
```

## Results

- Dependency lockfile exists: `pnpm-lock.yaml`.
- No package manifests use `latest` dependency specifiers.
- Package tests no longer use `|| true`.
- Full build, typecheck, lint, and test passed.
- Publish smoke generated PR comment, README, gallery, and release-note Markdown.
- Action-input smoke confirmed command-aware output defaults.
- Local capture smoke generated thumbnail, WebM video, GIF, and manifest outputs.

## Remaining release gates

- Run GitHub Action in a separate consumer repository.
- Add npm publish dry-run workflow.
- Add external CI proof after pushing to GitHub.
