# Recipe-based Recording

Recipes make previews reproducible. This is the key Agent-native workflow: an Agent can edit a frontend app, then run the same recipe to produce a video artifact.

```json
{
  "url": "http://localhost:3000",
  "output": "outputs/landing-page-preview.mp4",
  "viewport": "desktop",
  "steps": [
    { "type": "wait", "ms": 800 },
    { "type": "scroll", "to": 520, "duration": 1000 },
    { "type": "click", "selector": "[data-preview='demo-button']" },
    { "type": "wait", "ms": 600 }
  ]
}
```

Supported steps:

- `wait`
- `scroll`
- `click`
- `fill`
- `hover`
- `press`
- `screenshot`

## Recipe with local app serving

Recipes can also start an app before running scripted interactions:

```json
{
  "serveCommand": "pnpm dev",
  "serveUrl": "http://localhost:5173",
  "serveSilent": true,
  "output": "outputs/landing-page-preview.mp4",
  "viewport": "desktop",
  "steps": [
    { "type": "wait", "ms": 800 },
    { "type": "scroll", "to": 520, "duration": 1000 },
    { "type": "click", "selector": "[data-preview='demo-button']" }
  ]
}
```
