# Publish Workflow Example

This example demonstrates the v0.4.0 publish workflow without needing Playwright or FFmpeg. It uses sample Just-Preview manifests to generate README snippets, PR comments, release note Markdown, and preview gallery Markdown.

## Generate a PR comment

```bash
pnpm just-preview publish \
  --manifest examples/publish-workflow/manifests/cover.manifest.json,examples/publish-workflow/manifests/preview.manifest.json \
  --format pr-comment \
  --out outputs/pr-comment.md
```

## Generate a README preview snippet

```bash
pnpm just-preview publish \
  --manifest examples/publish-workflow/manifests/cover.manifest.json,examples/publish-workflow/manifests/preview.manifest.json \
  --format readme \
  --base-url ./outputs \
  --out outputs/readme-preview.md
```

## Generate a gallery

```bash
pnpm just-preview publish \
  --manifest examples/publish-workflow/manifests/cover.manifest.json,examples/publish-workflow/manifests/preview.manifest.json \
  --format gallery \
  --out outputs/preview-gallery.md
```

This closes the product loop:

```txt
capture asset -> write manifest -> publish Markdown -> share in README / PR / release
```
