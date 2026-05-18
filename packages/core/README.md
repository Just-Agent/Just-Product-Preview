# @just-agent/preview-core

Shared core utilities for the Just-Preview monorepo.

This package centralizes:

- target resolution for URL, local HTML file, and raw HTML input
- viewport presets and Playwright device listing
- browser context creation
- output path handling
- optional config loading from `just-preview.config.json`
- doctor checks for Node.js, FFmpeg, and Playwright Chromium

It exists so `@just-agent/html2video`, `@just-agent/html2thumbnail`, `@just-agent/preview-recipe`, and the `just-preview` CLI can evolve together inside the same monorepo.

## Local app serving

v0.3.0 adds shared serving utilities used by every capture package.

- `startPreviewServer()` starts a shell command such as `pnpm dev`.
- `waitForPreviewServer()` probes a readiness URL.
- `stopChildProcess()` shuts down the app after capture.

These utilities make local frontend previews reliable across `html2thumbnail`, `html2video`, `preview-recipe`, and the CLI.

## Artifact manifests

`createPreviewManifest()` and `writePreviewManifest()` create Agent-readable JSON metadata for generated preview assets. The CLI uses this for `--manifest`.

Manifest files help GitHub Actions, release workflows, and Agents understand which source URL, output file, format, viewport, and raw recording path were produced.
