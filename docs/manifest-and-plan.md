# Manifest and Plan Workflows

Just-Preview v0.3.0 adds two product-quality workflows for Agents, CI, and PR automation: **preflight plans** and **artifact manifests**.

## Preflight plan

`just-preview plan` resolves what a capture will do without launching Playwright, starting a browser, or writing the final preview asset.

```bash
just-preview plan video --config just-preview.config.json --manifest outputs/video-plan.json
just-preview plan thumbnail --url https://example.com --out outputs/cover.png --json
just-preview plan recipe ./preview.recipe.json --json
```

The plan includes:

- command type
- resolved target
- resolved output path
- viewport or Playwright device
- local app serving configuration
- recipe path and step count
- warnings for missing targets or defaulted output paths

This is useful when an Agent needs to explain the capture before executing it, or when CI needs a fast preflight check before installing browsers.

## Artifact manifest

Captures can write a manifest next to the preview asset:

```bash
just-preview thumbnail --url https://example.com --out outputs/cover.png --manifest outputs/cover.manifest.json
just-preview video --url localhost:3000 --out outputs/preview.mp4 --manifest outputs/video.manifest.json
just-preview recipe ./recipes/landing-page.json --manifest outputs/recipe.manifest.json
```

A manifest includes:

- Just-Preview version
- command name
- generated timestamp
- source URL
- output path
- output filename and format
- raw WebM path when `--keep-webm` is used
- final viewport size
- command metadata

## Recommended PR artifact bundle

```txt
outputs/
  cover.png
  preview.webm
  cover.manifest.json
  video.manifest.json
  video-plan.json
```

Upload the full `outputs/` directory as a GitHub Action artifact so reviewers and Agents can understand what was generated.


## Publish from manifests

v0.4.0 adds `just-preview publish`, which consumes one or more artifact manifests and writes Markdown for downstream surfaces.

```bash
just-preview publish --manifest "outputs/*.manifest.json" --format pr-comment --out outputs/pr-comment.md
just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
just-preview publish --manifest "outputs/*.manifest.json" --format gallery --out outputs/preview-gallery.md
just-preview publish --manifest "outputs/*.manifest.json" --format release-note --out outputs/release-preview.md
```

This turns the recommended artifact bundle into README Preview Assets, GitHub PR Preview comments, release notes, and Agent final-response snippets.
