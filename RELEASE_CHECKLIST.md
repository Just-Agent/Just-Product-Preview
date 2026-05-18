# Release Checklist

Just-Preview release readiness checklist for zip, GitHub Release, GitHub Action, and npm package publishing.

## Required before every versioned zip

- [x] Version is incremented in `VERSION`, root `package.json`, publishable package `package.json` files, docs package, and examples.
- [x] Zip filename includes the numeric version, for example `Just-Preview-v0.4.1.zip`.
- [x] `CHANGELOG.md` includes an entry for the current version.
- [x] `RELEASE_NOTES.md` describes the current version.
- [x] `logs/iteration-log.md`, `logs/file-manifest.md`, and `logs/version-history.md` are updated.
- [x] README states: `This repository uses a monorepo architecture.`
- [x] Chinese README states that Just-Preview uses `monorepo 单仓多包架构`.
- [x] The archive includes `.github`, `action.yml`, examples, recipes, docs, packages, scripts, schema, and logs.

## Engineering checks

Run these before publishing:

```bash
pnpm install --frozen-lockfile
pnpm validate:json
pnpm release:check
pnpm release:checklist
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

For browser smoke tests, install Playwright browser assets first:

```bash
pnpm exec playwright install chromium ffmpeg
pnpm smoke:publish
pnpm smoke:action-inputs
pnpm smoke:local-html
```

In constrained environments where Playwright browser downloads are unavailable but a local Chromium exists, use:

```bash
JUST_PREVIEW_CHROMIUM_EXECUTABLE=/path/to/chromium pnpm smoke:local-html
```

## npm package readiness

Every publishable package should include:

- `license`
- `homepage`
- `bugs`
- `repository.directory`
- `keywords`
- `publishConfig.access = public`
- `files` limited to `dist` and `README.md`
- no `latest` dependency specifiers

Publishable packages:

- `@just-agent/preview-core`
- `@just-agent/html2thumbnail`
- `@just-agent/html2video`
- `@just-agent/preview-recipe`
- `@just-agent/preview-publisher`
- `@just-agent/preview-cli`

## GitHub Action readiness

- [x] Uses `pnpm install --frozen-lockfile`.
- [x] Installs `chromium ffmpeg` for video recording.
- [x] Computes command-aware defaults instead of forcing `outputs/preview.mp4` for every command.
- [x] Exposes resolved `output` and `manifest` outputs.

## v1.0.0 gate

Do not call the project v1.0.0 until:

- external clone install/build/test succeeds in CI
- thumbnail, video, GIF, recipe, manifest, and publish workflows have green smoke tests
- GitHub Action works in a separate consumer repository
- at least the CLI package is installable from npm
- docs are deployable and linked from README
