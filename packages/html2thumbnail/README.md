# @just-agent/html2thumbnail

Convert HTML, URLs, local frontend apps, and GitHub Pages sites into README-ready thumbnail images.

Supported output formats:

- `.png`
- `.jpg`
- `.jpeg`

```ts
import { html2thumbnail } from "@just-agent/html2thumbnail";

await html2thumbnail({
  url: "https://example.com",
  output: "cover.png",
  viewport: "desktop",
  fullPage: false
});
```

The package validates output extensions and gives clear errors before Playwright writes a mismatched screenshot file.

## Capture an app that is not running yet

```ts
await html2thumbnail({
  serveCommand: "pnpm dev",
  serveUrl: "http://localhost:5173",
  output: "outputs/cover.png",
  serveSilent: true
});
```

## CLI manifest integration

When this package is used through the `just-preview` CLI, pass `--manifest <path>` to write a JSON artifact manifest that records the source, output, format, viewport, command, and metadata for downstream Agent or CI usage.
