# CLI Reference

## Commands

### `just-preview init`

Creates starter assets for a preview-ready project:

- `just-preview.config.json`
- `recipes/landing-page.json`
- `examples/preview-ready/index.html`

Options:

```bash
just-preview init --url http://localhost:3000
just-preview init --force
just-preview init --json
```

### `just-preview doctor`

Checks whether the local environment can generate previews.

```bash
just-preview doctor
just-preview doctor --json
```

### `just-preview devices`

Lists viewport presets and Playwright device names.

```bash
just-preview devices
just-preview devices --all
```

### `just-preview thumbnail`

```bash
just-preview thumbnail --url https://example.com --out cover.png
just-preview thumbnail --file ./dist/index.html --out cover.png --full-page
```

### `just-preview video`

```bash
just-preview video --url https://example.com --out preview.mp4 --duration 8
just-preview video --file ./dist/index.html --out preview.webm --viewport mobile
```

### `just-preview gif`

```bash
just-preview gif --url localhost:3000 --out preview.gif --duration 6 --gif-width 960
```

### `just-preview recipe`

```bash
just-preview recipe ./recipes/landing-page.json
```

### `just-preview plan`

Resolve a capture plan without launching a browser.

```bash
just-preview plan video --config just-preview.config.json --manifest outputs/video-plan.json
just-preview plan recipe ./preview.recipe.json --json
```

### `just-preview validate`

Validate config and recipe files before CI or Agent execution.

```bash
just-preview validate --config just-preview.config.json ./preview.recipe.json
just-preview validate ./recipes/landing-page.json --json
```

### Artifact manifests

```bash
just-preview thumbnail --url https://example.com --out cover.png --manifest outputs/cover.manifest.json
just-preview video --url localhost:3000 --out preview.mp4 --manifest outputs/video.manifest.json
just-preview recipe ./recipes/landing-page.json --manifest outputs/recipe.manifest.json
```

### `just-preview publish`

Generate README snippets, GitHub PR comments, preview galleries, or release-note Markdown from Just-Preview manifests.

```bash
just-preview publish --manifest outputs/cover.manifest.json,outputs/preview.manifest.json --format pr-comment --out outputs/pr-comment.md
just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
just-preview publish --manifest "outputs/*.manifest.json" --format gallery --out outputs/preview-gallery.md
just-preview publish --manifest "outputs/*.manifest.json" --format release-note --out outputs/release-preview.md
```

Formats:

- `pr-comment` for GitHub PR Preview comments.
- `readme` for README Preview Assets.
- `gallery` for multi-asset preview gallery Markdown.
- `release-note` for release notes and changelog attachments.

The publish command accepts a single manifest, comma-separated manifests, positional manifests, or a one-level glob such as `outputs/*.manifest.json`.

## Local app serving options

v0.3.0 adds automatic local app serving so Just-Preview can capture a frontend app that is not already running.

```bash
just-preview video \
  --serve-command "pnpm dev" \
  --serve-url http://localhost:5173 \
  --out outputs/preview.mp4
```

Common serving flags:

- `--serve-command <cmd>` starts a local app before capture.
- `--serve-url <url>` waits for the app and becomes the capture target when `--url` is omitted.
- `--serve-cwd <dir>` runs the command from another directory.
- `--serve-timeout <ms>` controls how long to wait for readiness.
- `--serve-silent` hides server output unless startup fails.

Examples:

```bash
just-preview thumbnail --serve-command "npm run dev" --serve-url localhost:3000 --out cover.png
just-preview video --serve-command "pnpm dev" --serve-cwd apps/web --serve-url http://localhost:3000 --out preview.webm
just-preview recipe ./recipes/landing-page.json --serve-command "pnpm dev" --serve-url http://localhost:5173
```
