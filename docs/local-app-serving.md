# Local App Serving

Just-Preview v0.3.0 adds first-class local app serving. This turns the tool from a static file recorder into a practical preview pipeline for Vite, Next.js, Astro, React, Vue, Svelte, docs sites, dashboards, and Agent-generated web apps.

The CLI can start a local server, wait until the URL responds, capture the thumbnail/video/GIF/recipe output, and stop the server automatically.

```bash
just-preview video \
  --serve-command "pnpm dev" \
  --serve-url http://localhost:5173 \
  --out outputs/preview.mp4 \
  --duration 8
```

You can omit `--url` when `--serve-url` is the page you want to capture:

```bash
just-preview thumbnail \
  --serve-command "npm run dev" \
  --serve-url localhost:3000 \
  --out outputs/cover.png
```

Use a different working directory for monorepo apps:

```bash
just-preview video \
  --serve-command "pnpm dev" \
  --serve-cwd apps/web \
  --serve-url http://localhost:3000 \
  --out outputs/web-preview.webm
```

Use `--serve-silent` in CI and Agent workflows to hide app logs unless startup fails:

```bash
just-preview gif \
  --serve-command "pnpm preview" \
  --serve-url http://127.0.0.1:4173 \
  --serve-silent \
  --out outputs/preview.gif
```

## Config example

```json
{
  "defaults": {
    "viewport": "desktop",
    "outputDir": "outputs",
    "serveCommand": "pnpm dev",
    "serveUrl": "http://localhost:5173",
    "serveTimeout": 30000,
    "serveSilent": true
  },
  "video": {
    "output": "outputs/preview.mp4",
    "duration": 8
  },
  "thumbnail": {
    "output": "outputs/cover.png"
  }
}
```

## Agent workflow

This is the recommended Agent-native workflow:

```txt
Agent edits frontend code
        ↓
Just-Preview starts the local app
        ↓
Just-Preview waits for the app URL
        ↓
Just-Preview records README Preview Assets
        ↓
Agent returns preview.mp4 and cover.png
```

Local serving makes **Preview what your Agent built** real for projects that are not deployed yet.
