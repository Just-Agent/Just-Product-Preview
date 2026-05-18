# GitHub PR Preview

Use Just-Preview in CI to generate visual artifacts and publish-ready Markdown for pull requests.

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
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm browsers:install
      - run: pnpm build
      - run: pnpm just-preview doctor
      - run: pnpm just-preview validate --config just-preview.config.example.json recipes/landing-page.json
      - run: pnpm just-preview plan video --config just-preview.config.example.json --manifest outputs/video-plan.json
      - run: pnpm just-preview thumbnail --file ./examples/local-html/index.html --out outputs/cover.png --manifest outputs/cover.manifest.json
      - run: pnpm just-preview video --file ./examples/local-html/index.html --out outputs/preview.webm --duration 2 --manifest outputs/video.manifest.json
      - run: pnpm just-preview publish --manifest "outputs/*.manifest.json" --format pr-comment --out outputs/pr-comment.md
      - run: pnpm just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
      - run: pnpm just-preview publish --manifest "outputs/*.manifest.json" --format gallery --out outputs/preview-gallery.md
      - uses: actions/upload-artifact@v4
        with:
          name: just-preview-artifacts
          path: outputs/*
```

## GitHub Action with local app serving

For PR preview generation, Just-Preview can start an app directly inside CI and upload visual review artifacts.

```yaml
- name: Generate served app preview
  run: |
    pnpm just-preview thumbnail \
      --serve-command "pnpm dev" \
      --serve-url http://127.0.0.1:5173 \
      --serve-silent \
      --out outputs/pr-cover.png \
      --manifest outputs/pr-cover.manifest.json
    pnpm just-preview video \
      --serve-command "pnpm dev" \
      --serve-url http://127.0.0.1:5173 \
      --serve-silent \
      --out outputs/pr-preview.webm \
      --duration 4 \
      --manifest outputs/pr-preview.manifest.json
    pnpm just-preview publish \
      --manifest "outputs/*.manifest.json" \
      --format pr-comment \
      --repo $GITHUB_REPOSITORY \
      --branch $GITHUB_REF_NAME \
      --sha $GITHUB_SHA \
      --workflow-run-url $GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID \
      --out outputs/pr-comment.md
```

Use `.webm` for a dependency-light smoke test, or `.mp4` / `.gif` when FFmpeg is available.

## Reusable composite action

v0.4.1 includes a repository-level `action.yml` so downstream projects can wire Just-Preview into GitHub Actions with a smaller workflow.

```yaml
- uses: Just-Agent/Just-Product-Preview@v0.4.1
  with:
    command: video
    url: https://example.com
    out: outputs/preview.mp4
    manifest: outputs/preview.manifest.json
```

For publish-ready Markdown:

```yaml
- uses: Just-Agent/Just-Product-Preview@v0.4.1
  with:
    command: publish
    manifest: outputs/cover.manifest.json,outputs/preview.manifest.json
    format: pr-comment
    out: outputs/pr-comment.md
```
