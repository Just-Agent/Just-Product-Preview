# @just-agent/html2video

Convert HTML, URLs, local frontend apps, and GitHub Pages sites into preview videos.

Supported output formats:

- `.webm` raw Playwright recording copy
- `.mp4` FFmpeg H.264 preview video
- `.mov` FFmpeg H.264 preview video
- `.gif` lightweight looping preview for README and social sharing

```ts
import { html2video } from "@just-agent/html2video";

await html2video({
  url: "http://localhost:3000",
  output: "preview.mp4",
  viewport: "desktop",
  duration: 8
});
```

GIF output:

```ts
await html2video({
  url: "http://localhost:3000",
  output: "preview.gif",
  duration: 6,
  gifFps: 12,
  gifWidth: 960
});
```

MP4, MOV, and GIF conversion require FFmpeg. WebM output can be generated without FFmpeg conversion.

## Record an app that is not running yet

```ts
await html2video({
  serveCommand: "pnpm dev",
  serveUrl: "http://localhost:5173",
  output: "outputs/preview.mp4",
  duration: 8,
  serveSilent: true
});
```

This starts the app, waits for the URL, records the browser session, and stops the app automatically.

## CLI manifest integration

When this package is used through the `just-preview` CLI, pass `--manifest <path>` to write a JSON artifact manifest that records the source, output, format, viewport, command, and metadata for downstream Agent or CI usage.
