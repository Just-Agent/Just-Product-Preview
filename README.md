<div align="center">
  <img src="./docs/readme-assets/logo.svg" alt="Just-Product-Preview logo" width="340" />
  <h1>Just-Product-Preview</h1>
  <p><strong>Agent-native preview assets for README, PR, release, and docs workflows.</strong></p>
  <p>Turn local apps, URLs, and HTML files into screenshots, videos, GIFs, manifests, and publish-ready Markdown.</p>
  <p>
    <a href="./README.zh-CN.md">中文</a>
    ·
    <a href="./docs/quick-start.md">Quick Start</a>
    ·
    <a href="./docs/cli.md">CLI</a>
    ·
    <a href="./docs/github-actions.md">GitHub Actions</a>
    ·
    <a href="./docs/recipes.md">Recipes</a>
    ·
    <a href="./examples">Examples</a>
    ·
    <a href="./CHANGELOG.md">Changelog</a>
  </p>
  <p>
    <a href="https://github.com/Just-Agent/Just-Product-Preview/actions/workflows/ci.yml"><img src="https://github.com/Just-Agent/Just-Product-Preview/actions/workflows/ci.yml/badge.svg" alt="CI status" /></a>
    <img src="https://img.shields.io/badge/version-0.4.1-2563EB" alt="version 0.4.1" />
    <img src="https://img.shields.io/badge/license-MIT-10B981" alt="MIT license" />
    <img src="https://img.shields.io/badge/node-%3E%3D18-111827" alt="Node 18 or newer" />
    <img src="https://img.shields.io/badge/pnpm-10.33.4-F97316" alt="pnpm 10.33.4" />
    <img src="https://img.shields.io/badge/Playwright-Chromium-2F6FED" alt="Playwright Chromium" />
  </p>
</div>

<p align="center">
  <img src="./docs/assets/just-product-preview-flow.svg" alt="Just-Product-Preview workflow preview" style="max-width:960px;width:100%;" />
</p>

> Preview what your Agent built.

Just-Product-Preview is the public repository for **Just-Preview**, a capture and publishing toolkit for agent-built web work. It can open a deployed URL, a local HTML file, or an app started by a serve command, then produce the artifacts reviewers expect: cover images, walkthrough video, lightweight GIFs, structured manifests, GitHub PR Preview comments, README snippets, galleries, and release-note Markdown.

## Contents

- [Why It Exists](#why-it-exists)
- [What It Generates](#what-it-generates)
- [Fastest Path](#fastest-path)
- [Capture Local Apps](#capture-local-apps)
- [Recipe-based Recording](#recipe-based-recording)
- [Publish Markdown](#publish-markdown)
- [GitHub Action](#github-action)
- [Monorepo Architecture](#monorepo-architecture)
- [Validation](#validation)
- [Roadmap](#roadmap)

## Why It Exists

AI agents and frontend tools can create UI faster than humans can review it. The missing handoff is visual proof that works before deployment, inside pull requests, and inside release notes.

Just-Preview gives that handoff a repeatable shape:

| Workflow | What Just-Preview does | Why it helps |
| --- | --- | --- |
| Local feature review | Starts the app, waits for a URL, captures media, and stops the process. | Reviewers can inspect UI changes before a preview deployment exists. |
| README showcase | Creates cover images, videos, GIFs, and Markdown snippets. | Public repos get visual proof without hand-made asset plumbing. |
| Agent handoff | Writes artifact manifests with paths, metadata, command type, and source target. | Agents can return structured outputs instead of loose filenames. |
| CI preview | Runs the same capture commands in GitHub Actions. | Pull requests can carry generated preview assets. |
| Release proof | Publishes manifest groups into release-note Markdown. | Release notes can show what changed, not only describe it. |

## What It Generates

| Need | Command surface | Output |
| --- | --- | --- |
| README cover image | `just-preview thumbnail` | PNG or JPEG thumbnail. |
| Product walkthrough | `just-preview video` | HTML to Video output as WebM, MP4, or MOV. |
| Lightweight animated proof | `just-preview gif` | GIF preview with FPS and width controls. |
| Scripted capture | `just-preview recipe` | Recipe-based Recording with wait, scroll, click, fill, hover, press, and screenshot steps. |
| Agent handoff | `--manifest` | JSON artifact manifest for CI, agents, and release scripts. |
| Publishing loop | `just-preview publish` | README snippet, GitHub PR Preview comment, gallery, or release-note Markdown. |
| Preflight check | `just-preview plan` / `just-preview validate` | Resolved capture plan and schema validation before opening a browser. |

## Fastest Path

Clone, install, build, and check the local environment:

```bash
git clone https://github.com/Just-Agent/Just-Product-Preview.git
cd Just-Product-Preview
pnpm install
pnpm browsers:install
pnpm build
pnpm just-preview doctor
```

For MP4, MOV, and GIF conversion, install a full system FFmpeg binary. Ubuntu runners can use:

```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
```

Generate a preview from the bundled static HTML example:

```bash
pnpm just-preview thumbnail --file ./examples/local-html/index.html --out outputs/cover.png
pnpm just-preview video --file ./examples/local-html/index.html --out outputs/preview.webm --duration 3
pnpm just-preview gif --file ./examples/local-html/index.html --out outputs/preview.gif --duration 3 --gif-width 720
```

Capture any URL:

```bash
pnpm just-preview thumbnail --url https://example.com --out outputs/cover.png
pnpm just-preview video --url https://example.com --out outputs/preview.mp4 --duration 8
```

## Capture Local Apps

The core agent workflow is to capture a frontend app that is not deployed yet.

```bash
pnpm just-preview video \
  --serve-command "pnpm dev" \
  --serve-url http://localhost:5173 \
  --out outputs/preview.mp4 \
  --duration 8 \
  --manifest outputs/preview.manifest.json
```

For monorepos, point the serve command at the frontend package:

```bash
pnpm just-preview thumbnail \
  --serve-command "pnpm dev" \
  --serve-cwd apps/web \
  --serve-url http://localhost:3000 \
  --serve-silent \
  --out outputs/cover.png \
  --manifest outputs/cover.manifest.json
```

Try the included local app example:

```bash
pnpm just-preview video \
  --serve-command "node server.mjs" \
  --serve-cwd examples/local-app \
  --serve-url http://127.0.0.1:4177 \
  --serve-silent \
  --out outputs/local-app-preview.webm \
  --duration 5 \
  --manifest outputs/local-app-preview.manifest.json
```

## Recipe-based Recording

Recipes make capture reproducible across agents, machines, and CI runs. They are useful for scroll walkthroughs, stateful UI, mobile previews, docs pages, dashboards, and PR demonstrations.

```json
{
  "serveCommand": "pnpm dev",
  "serveUrl": "http://localhost:5173",
  "serveSilent": true,
  "output": "outputs/preview.mp4",
  "viewport": "desktop",
  "steps": [
    { "type": "wait", "ms": 800 },
    { "type": "scroll", "to": 600, "duration": 1200 },
    { "type": "click", "selector": "[data-preview='demo-button']" }
  ]
}
```

Run and validate recipes:

```bash
pnpm just-preview validate --config just-preview.config.example.json recipes/landing-page.json
pnpm just-preview plan video --config just-preview.config.example.json --manifest outputs/video-plan.json
pnpm just-preview recipe recipes/landing-page.json
```

Supported recipe steps:

| Step | Purpose |
| --- | --- |
| `wait` | Pause for animations, data, or route transitions. |
| `scroll` | Record long pages and reveal lower sections. |
| `click` | Trigger UI states. |
| `fill` | Enter form content. |
| `hover` | Show hover states. |
| `press` | Exercise keyboard flows. |
| `screenshot` | Capture still frames during a recipe. |

## Publish Markdown

Capture commands can write manifests. The publisher turns those manifests into Markdown surfaces that humans can read immediately.

```bash
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format pr-comment --out outputs/pr-comment.md
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format gallery --out outputs/preview-gallery.md
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format release-note --out outputs/release-preview.md
```

Use `--base-url` or `--asset-prefix` when assets are hosted on GitHub Pages, release assets, or an artifact proxy:

```bash
pnpm just-preview publish \
  --manifest "outputs/*.manifest.json" \
  --format pr-comment \
  --repo Just-Agent/Just-Product-Preview \
  --branch main \
  --sha "$GITHUB_SHA" \
  --workflow-run-url "$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" \
  --base-url https://just-agent.github.io/Just-Product-Preview/previews/pr-123 \
  --out outputs/pr-comment.md
```

## GitHub Action

The repository includes a reusable composite action. Before the first version tag is cut, pin `@main` or a commit SHA. After a `v0.4.1` tag exists, switch the example to that tag.

```yaml
name: Generate Preview

on:
  pull_request:
  workflow_dispatch:

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Just-Agent/Just-Product-Preview@main
        with:
          command: video
          url: https://example.com
          out: outputs/preview.mp4
      - uses: actions/upload-artifact@v4
        with:
          name: just-preview-assets
          path: outputs/*
```

For a full workflow that installs browsers, installs FFmpeg, captures static HTML, captures a served local app, and publishes Markdown, see [docs/github-actions.md](./docs/github-actions.md) and [.github/workflows/preview.yml](./.github/workflows/preview.yml).

## Monorepo Architecture

This repository uses a monorepo architecture.

The CLI, reusable packages, docs, recipes, examples, GitHub Action, release checks, and validation logs are versioned together so capture behavior and publishing behavior stay aligned.

```txt
Just-Product-Preview/
  apps/
    cli/                  # just-preview command
    docs/                 # documentation builder
  packages/
    core/                 # browser, config, devices, server lifecycle, manifests, diagnostics
    html2thumbnail/       # HTML to Thumbnail
    html2video/           # HTML to Video, WebM, MP4, MOV, GIF
    preview-recipe/       # Recipe-based Recording
    preview-publisher/    # README, PR, gallery, and release-note Markdown
  docs/                   # user documentation
  examples/               # URL, HTML, local app, publish workflow, GitHub Action examples
  recipes/                # reusable capture recipes
  schema/                 # JSON schema for config
  scripts/                # validation, release, and smoke checks
  action.yml              # reusable composite GitHub Action
```

## Package Map

| Package | Purpose |
| --- | --- |
| `@just-agent/preview-core` | Shared browser automation, device presets, local server lifecycle, config, output paths, manifests, diagnostics, FFmpeg resolution, and filesystem utilities. |
| `@just-agent/html2thumbnail` | Convert HTML, URLs, and local frontend output into PNG or JPEG thumbnails. |
| `@just-agent/html2video` | Convert HTML, URLs, and local frontend output into WebM, MP4, MOV, or GIF previews. |
| `@just-agent/preview-recipe` | Run scripted recordings with reproducible interaction steps. |
| `@just-agent/preview-publisher` | Convert artifact manifests into README snippets, PR comments, galleries, and release-note Markdown. |
| `@just-agent/preview-cli` | Command line interface exposed as `just-preview`. |

## Agent Workflow

```mermaid
flowchart LR
    A["Agent or developer changes a web UI"] --> B["just-preview opens or serves the target"]
    B --> C["Capture PNG, video, GIF, or recipe output"]
    C --> D["Write artifact manifest"]
    D --> E["Publish README, PR, gallery, or release-note Markdown"]
    E --> F["Reviewer sees what changed"]
```

## Validation

Local release checks:

```bash
pnpm validate:json
pnpm release:check
pnpm release:checklist
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm smoke:publish
pnpm smoke:action-inputs
pnpm smoke:local-html
```

CI runs the same release checks, installs Playwright Chromium and system FFmpeg, runs `doctor`, validates config and recipes, writes a plan manifest, and exercises smoke preview flows.

## Requirements

| Requirement | Notes |
| --- | --- |
| Node.js | 18 or newer. CI uses Node 22. |
| pnpm | `10.33.4` is pinned in `packageManager`. |
| Playwright Chromium | Required for browser capture. Install with `pnpm browsers:install`. |
| FFmpeg | Required for MP4, MOV, and GIF conversion. Use system FFmpeg for GIF output. |

## README Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Product wordmark | [docs/readme-assets/logo.svg](./docs/readme-assets/logo.svg) | First-viewport project identity. |
| Workflow preview | [docs/assets/just-product-preview-flow.svg](./docs/assets/just-product-preview-flow.svg) | Visual explanation of inputs, CLI commands, and outputs. |

## Release Status

The current source version is `0.4.1`.

v0.4.1 focuses on release hardening:

- Locked dependency graph with `pnpm-lock.yaml`.
- Package versions are pinned instead of using `latest`.
- Test scripts fail when compiled Node tests fail.
- Composite action chooses command-aware default outputs.
- Publishable packages include license, repository, homepage, bugs, keywords, and public publish metadata.
- Smoke scripts cover publish Markdown, action inputs, local HTML capture, thumbnail, video, GIF, and manifest output.
- Chromium can be overridden with `--chromium-executable` or `JUST_PREVIEW_CHROMIUM_EXECUTABLE`.

Release references:

- [CHANGELOG.md](./CHANGELOG.md)
- [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
- [RELEASE_MANIFEST.md](./RELEASE_MANIFEST.md)
- [LOGS.md](./LOGS.md)

## Roadmap

| Version | Focus | Status |
| --- | --- | --- |
| `v0.1.0` | Monorepo MVP with core, thumbnail, video, recipe, and CLI. | Done |
| `v0.2.0` | GIF, config, init, doctor, devices, docs, schema, and logs. | Done |
| `v0.3.0` | Local app serving, preflight plan, validation, and manifests. | Done |
| `v0.4.0` | Manifest-to-Markdown publishing and reusable GitHub Action. | Done |
| `v0.4.1` | Release hardening, smoke checks, package metadata, pinned deps. | Done |
| `v0.5.0` | Agent integration guides for Claude Code, Codex, Cursor, and Just-Agent. | Planned |
| `v0.6.0` | Preview Studio UI with device selector, history, and export controls. | Planned |

## License

MIT. See [LICENSE](./LICENSE).
