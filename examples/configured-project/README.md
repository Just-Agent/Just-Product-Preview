# Configured Project Example

This example shows the v0.2.0 config-first workflow.

```bash
just-preview thumbnail --config ./examples/configured-project/just-preview.config.json
just-preview video --config ./examples/configured-project/just-preview.config.json
just-preview gif --config ./examples/configured-project/just-preview.config.json
just-preview recipe ./examples/configured-project/recipes/landing-page.json
```

The config keeps defaults in one place, while CLI options can override any value.
