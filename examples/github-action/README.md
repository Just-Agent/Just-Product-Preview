# GitHub Action Example

This example shows how a project can generate preview artifacts during pull requests.

```yaml
name: Just-Preview PR Assets

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
      - run: sudo apt-get update && sudo apt-get install -y ffmpeg
      - run: pnpm build
      - run: pnpm just-preview thumbnail --url https://example.com --out artifacts/cover.png
      - run: pnpm just-preview video --url https://example.com --out artifacts/preview.mp4 --duration 8
      - uses: actions/upload-artifact@v4
        with:
          name: just-preview-assets
          path: artifacts
```
