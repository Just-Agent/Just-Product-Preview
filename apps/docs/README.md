# Just-Preview Docs App

The docs app is a lightweight static documentation builder for the monorepo.

It reads Markdown files from the root `docs/` directory and generates `apps/docs/dist/index.html`.

```bash
pnpm --filter @just-agent/preview-docs build
```

The generated page highlights the core product message:

```txt
Preview what your Agent built.
```

## v0.4.0 docs additions

- `docs/publishing.md` explains how manifests become README snippets, GitHub PR comments, preview galleries, and release-note Markdown.
- CLI docs now cover the `publish` command and publish-ready Markdown outputs.
- GitHub Actions docs now include reusable action and publish artifact examples.

## v0.3.0 docs additions

- `docs/manifest-and-plan.md` explains preflight plan files and Agent-readable artifact manifests.
- CLI docs now cover `plan`, `validate`, `--manifest`, and local app serving.
