# Quick Start

Just-Preview turns a URL, local HTML file, or frontend app into README-ready preview assets.

```bash
pnpm install
pnpm browsers:install
sudo apt-get update && sudo apt-get install -y ffmpeg
pnpm build
pnpm just-preview doctor
```

Create starter files in any project:

```bash
just-preview init --url http://localhost:3000
```

Generate a cover image:

```bash
just-preview thumbnail --url https://example.com --out outputs/cover.png
```

Generate a video:

```bash
just-preview video --url https://example.com --out outputs/preview.mp4 --duration 8
```

Generate a GIF:

```bash
just-preview gif --url localhost:3000 --out outputs/preview.gif --duration 6 --gif-width 960
```

Run a recipe:

```bash
just-preview recipe ./recipes/landing-page.json
```

## Preflight before capture

Validate and resolve the capture plan before launching the browser:

```bash
just-preview validate --config just-preview.config.example.json recipes/landing-page.json
just-preview plan video --config just-preview.config.example.json --manifest outputs/video-plan.json
```

Write a manifest alongside a generated preview asset:

```bash
just-preview video --url localhost:3000 --out outputs/preview.mp4 --manifest outputs/video.manifest.json
```

## Capture a local frontend app

When the app is not running yet, let Just-Preview start it:

```bash
just-preview video \
  --serve-command "pnpm dev" \
  --serve-url http://localhost:5173 \
  --out outputs/preview.mp4 \
  --duration 8
```

Try the built-in local app example:

```bash
pnpm build
pnpm just-preview thumbnail \
  --serve-command "node server.mjs" \
  --serve-cwd examples/local-app \
  --serve-url http://127.0.0.1:4177 \
  --serve-silent \
  --out outputs/local-app-cover.png
```

## Publish generated artifacts

After writing manifests, generate copy-paste-ready Markdown for README files, PR comments, galleries, or release notes:

```bash
just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
just-preview publish --manifest "outputs/*.manifest.json" --format pr-comment --out outputs/pr-comment.md
just-preview publish --manifest "outputs/*.manifest.json" --format gallery --out outputs/preview-gallery.md
```

Try the no-browser publish sample:

```bash
pnpm publish:sample
pnpm readme:sample
pnpm gallery:sample
```
