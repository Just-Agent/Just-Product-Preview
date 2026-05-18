# Versioning Policy

Just-Preview uses semantic versioning for source zip deliveries.

## Format

```txt
Just-Preview-vMAJOR.MINOR.PATCH.zip
```

## Current Version

```txt
0.4.1
```

## Rules

- Increase `PATCH` for bug fixes, small documentation updates, and minor product polish.
- Increase `MINOR` for new CLI commands, new export formats, new workflows, new packages, or major UX improvements.
- Increase `MAJOR` for breaking API, CLI, package, or monorepo structure changes.

## Required Release Files

Every version must update:

- `VERSION`
- root `package.json`
- package/app `package.json` versions
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `LOGS.md`
- `RELEASE_MANIFEST.md`
- `logs/iteration-log.md`
- `logs/file-manifest.md`
- `logs/version-history.md`
- `SOURCE_MANIFEST.md`
