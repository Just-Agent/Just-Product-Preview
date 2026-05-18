# @just-agent/preview-recipe

Recipe-based recording for Just-Preview.

A recipe turns a preview into a reproducible script that an Agent or CI workflow can run repeatedly.

```json
{
  "url": "http://localhost:3000",
  "output": "outputs/recipe-preview.mp4",
  "viewport": "desktop",
  "steps": [
    { "type": "wait", "ms": 1000 },
    { "type": "scroll", "to": 600, "duration": 1200 },
    { "type": "click", "selector": "[data-preview='demo-button']" }
  ]
}
```

Supported steps: `wait`, `scroll`, `click`, `fill`, `hover`, `press`, and `screenshot`.

Recipe output can be `.mp4`, `.webm`, `.mov`, `.gif`, `.png`, `.jpg`, or `.jpeg` depending on recipe mode and output extension.

## Recipe with local app serving

```json
{
  "serveCommand": "pnpm dev",
  "serveUrl": "http://localhost:5173",
  "serveSilent": true,
  "output": "outputs/recipe-preview.mp4",
  "steps": [
    { "type": "wait", "ms": 800 },
    { "type": "scroll", "to": 600, "duration": 1000 }
  ]
}
```

## CLI manifest integration

When this package is used through the `just-preview` CLI, pass `--manifest <path>` to write a JSON artifact manifest that records the source, output, format, viewport, command, and metadata for downstream Agent or CI usage.
