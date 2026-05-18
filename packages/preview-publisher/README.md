# @just-agent/preview-publisher

Generate publish-ready Markdown from Just-Preview artifact manifests.

This package powers the `just-preview publish` command. It turns thumbnail, video, GIF, and recipe manifests into assets that can be pasted into README files, GitHub PR comments, release notes, docs pages, or Agent final responses.

## Why it exists

Capturing a preview is only half of the product workflow. A user still needs to show that preview in a place where reviewers, maintainers, and users can see it. `@just-agent/preview-publisher` closes that loop.

## Outputs

- `pr-comment` — Markdown for a GitHub PR comment.
- `readme` — README-ready preview asset snippet.
- `gallery` — Multi-asset preview gallery Markdown.
- `release-note` — Release note section for preview assets.

## Programmatic API

```ts
import { loadPreviewManifests, writePreviewPublishMarkdown } from "@just-agent/preview-publisher";

const manifests = await loadPreviewManifests([
  "outputs/cover.manifest.json",
  "outputs/preview.manifest.json"
]);

await writePreviewPublishMarkdown({
  manifests,
  format: "readme",
  output: "outputs/readme-preview.md",
  title: "Just-Preview demo",
  baseUrl: "./outputs"
});
```

## CLI

```bash
just-preview publish \
  --manifest outputs/cover.manifest.json,outputs/preview.manifest.json \
  --format pr-comment \
  --out outputs/pr-comment.md
```
