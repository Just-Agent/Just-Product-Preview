# Configuration

Just-Preview can load defaults from `just-preview.config.json`, `preview.config.json`, or `.just-preview.json`.

The CLI reads the `defaults` section first, then merges command-specific options such as `thumbnail`, `video`, `gif`, and `recipe`. CLI flags always win.

```json
{
  "$schema": "https://just-agent.github.io/Just-Product-Preview/schema/just-preview.config.schema.json",
  "defaults": {
    "outputDir": "outputs",
    "viewport": "desktop",
    "waitUntil": "networkidle",
    "timeout": 30000,
    "waitForTimeout": 500
  },
  "thumbnail": {
    "output": "outputs/cover.png",
    "fullPage": false,
    "quality": 90
  },
  "video": {
    "output": "outputs/preview.mp4",
    "duration": 8,
    "autoScroll": false,
    "recordingsDir": "recordings",
    "fps": 30,
    "crf": 23
  },
  "gif": {
    "output": "outputs/preview.gif",
    "duration": 6,
    "gifFps": 12,
    "gifWidth": 960
  }
}
```

Use config defaults:

```bash
just-preview thumbnail --config ./just-preview.config.json --url https://example.com
just-preview video --config ./just-preview.config.json --url http://localhost:3000
just-preview gif --config ./just-preview.config.json --url http://localhost:3000
```

Override any config value from the CLI:

```bash
just-preview video --config ./just-preview.config.json --url http://localhost:3000 --out outputs/demo.mp4 --duration 12
```

## Local app serving config

`defaults`, `thumbnail`, `video`, `gif`, and `recipe` can include serving options.

```json
{
  "defaults": {
    "serveCommand": "pnpm dev",
    "serveUrl": "http://localhost:5173",
    "serveTimeout": 30000,
    "serveSilent": true,
    "outputDir": "outputs",
    "viewport": "desktop"
  },
  "thumbnail": {
    "output": "outputs/cover.png"
  },
  "video": {
    "output": "outputs/preview.mp4",
    "duration": 8
  }
}
```

Run it with:

```bash
just-preview thumbnail --config just-preview.config.json
just-preview video --config just-preview.config.json
```

Use `serveCwd` when the app lives inside a monorepo subdirectory:

```json
{
  "defaults": {
    "serveCommand": "pnpm dev",
    "serveCwd": "apps/web",
    "serveUrl": "http://localhost:3000",
    "serveSilent": true
  }
}
```


## Publish config

The `publish` section defines how manifest files become README Preview Assets, GitHub PR Preview comments, galleries, or release-note Markdown.

```json
{
  "publish": {
    "manifest": "outputs/cover.manifest.json,outputs/video.manifest.json,outputs/gif.manifest.json",
    "format": "pr-comment",
    "output": "outputs/pr-comment.md",
    "title": "Just-Preview artifacts",
    "description": "Preview assets generated for this project.",
    "baseUrl": "./outputs"
  }
}
```

Run it with:

```bash
just-preview publish --config just-preview.config.json
```

Use `format` values `pr-comment`, `readme`, `gallery`, or `release-note`.
