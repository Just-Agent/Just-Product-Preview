# just-preview CLI

The `just-preview` command is the primary product surface for Just-Preview.

```bash
just-preview thumbnail --url https://example.com --out cover.png
just-preview video --url http://localhost:3000 --out preview.mp4
just-preview gif --url localhost:3000 --out preview.gif --gif-width 960
just-preview recipe ./recipes/landing-page.json
just-preview plan video --config just-preview.config.json --manifest outputs/video-plan.json
just-preview validate --config just-preview.config.json ./preview.recipe.json
just-preview publish --manifest "outputs/*.manifest.json" --format pr-comment --out outputs/pr-comment.md
just-preview init --url http://localhost:3000
just-preview doctor
```

## Product-focused defaults

- Missing `http://` is normalized for localhost targets.
- `--out` is optional and falls back to `outputs/cover.png` or `outputs/preview.mp4`.
- `--json` switches the CLI to machine-readable output for Agent workflows.
- `just-preview doctor` checks whether the local system can generate deployable MP4/GIF preview assets.

## Config file

Create starter files with:

```bash
just-preview init --url http://localhost:3000
```

Then run:

```bash
just-preview video --config just-preview.config.json
```

## Local app serving

```bash
just-preview video \
  --serve-command "pnpm dev" \
  --serve-url http://localhost:5173 \
  --out outputs/preview.mp4
```

The CLI starts the app, waits for readiness, captures the preview asset, and stops the app automatically. This is the recommended workflow for Agent-generated frontend changes that are not deployed yet.

## Plan, validate, and manifest

```bash
just-preview validate --config just-preview.config.json ./preview.recipe.json
just-preview plan video --config just-preview.config.json --manifest outputs/video-plan.json
just-preview video --config just-preview.config.json --manifest outputs/video.manifest.json
```

`plan` and `validate` are designed for CI and Agent workflows. They make the command surface safer before launching browsers, and `--manifest` records the generated asset in a machine-readable JSON file.

## Publish Markdown from manifests

```bash
just-preview thumbnail --url http://localhost:3000 --out outputs/cover.png --manifest outputs/cover.manifest.json
just-preview video --url http://localhost:3000 --out outputs/preview.mp4 --manifest outputs/video.manifest.json
just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
just-preview publish --manifest "outputs/*.manifest.json" --format pr-comment --out outputs/pr-comment.md
```

`publish` turns generated manifests into README Preview Assets, GitHub PR Preview comments, preview galleries, and release-note Markdown. This closes the Agent-native loop: capture the UI, write structured metadata, then produce a shareable review surface.
