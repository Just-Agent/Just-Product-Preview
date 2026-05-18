# Release Manifest

This file records every source zip delivered for Just-Preview.

## Zip Naming Rule

Every zip file must include a numeric version:

```txt
Just-Preview-v{MAJOR}.{MINOR}.{PATCH}.zip
```

Examples:

```txt
Just-Preview-v0.1.0.zip
Just-Preview-v0.2.0.zip
Just-Preview-v0.3.0.zip
Just-Preview-v0.4.0.zip
Just-Preview-v0.4.1.zip
```

## Releases

| Version | Zip Filename | Date | Summary |
|---|---|---|---|
| 0.4.1 | `Just-Preview-v0.4.1.zip` | 2026-05-18 | Release-hardening patch with locked dependencies, frozen-lockfile CI, no-fake-pass tests, dynamic Action defaults, npm package metadata, smoke scripts, and release checklist. |
| 0.4.0 | `Just-Preview-v0.4.0.zip` | 2026-05-18 | Publishing release with manifest-to-Markdown outputs, `@just-agent/preview-publisher`, `just-preview publish`, README/PR/gallery/release-note generation, reusable action metadata, docs, examples, workflows, and logs. |
| 0.3.0 | `Just-Preview-v0.3.0.zip` | 2026-05-18 | Local app serving release with `--serve-command`, readiness waiting, automatic cleanup, served app examples, config/recipe serving support, GitHub PR Preview served app artifacts, docs, and logs. |
| 0.2.0 | `Just-Preview-v0.2.0.zip` | 2026-05-18 | Product-surface iteration with GIF output, config support, init, doctor, devices, docs, schema, configured example, release workflow, and structured logs. |
| 0.1.0 | `Just-Preview-v0.1.0.zip` | 2026-05-18 | Initial monorepo MVP with core, html2video, html2thumbnail, preview-recipe, CLI, README, logs, and changelog. |

## Required Files Per Zip

- `README.md`
- `README.zh-CN.md`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `LOGS.md`
- `RELEASE_MANIFEST.md`
- `SOURCE_MANIFEST.md`
- `VERSION`
- `logs/iteration-log.md`
- `logs/file-manifest.md`
- `logs/version-history.md`
- `logs/validation-v0.4.1.md`
- `logs/validation-v0.4.0.md`
- `logs/validation-v0.3.0.md`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `turbo.json`
- `tsconfig.base.json`
- `schema/*`
- `packages/*`
- `apps/*`
- `docs/*`
- `examples/*`
- `recipes/*`
- `.github/workflows/*`
- `action.yml`
- `RELEASE_CHECKLIST.md`
