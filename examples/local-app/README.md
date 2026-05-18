# Local App Example

This example demonstrates the v0.3.0 local app workflow.

```bash
pnpm just-preview plan video \
  --serve "node server.mjs" \
  --serve-cwd examples/local-app \
  --serve-url http://127.0.0.1:4177 \
  --out outputs/local-app-preview.webm \
  --manifest outputs/local-app-plan.json
```

Capture it:

```bash
pnpm just-preview video \
  --serve "node server.mjs" \
  --serve-cwd examples/local-app \
  --serve-url http://127.0.0.1:4177 \
  --serve-silent \
  --out outputs/local-app-preview.webm \
  --duration 3 \
  --manifest outputs/local-app-preview.manifest.json
```

Use `.webm` for a lightweight smoke test that does not require FFmpeg conversion.
