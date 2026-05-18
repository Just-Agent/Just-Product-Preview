# Validation Notes for v0.4.0

Date: 2026-05-18
Version: 0.4.0
Zip filename: `Just-Preview-v0.4.0.zip`

## Commands attempted

### JSON validation

```bash
node scripts/validate-json.mjs
```

Result: passed.

```txt
Validated 41 JSON files.
```

### Docs static build

```bash
cd apps/docs
node scripts/build.mjs
```

Result: passed. The docs app generated `apps/docs/dist/index.html`.

### YAML / workflow parse check

```bash
python - <<'PY'
from pathlib import Path
import yaml, json
for p in list(Path('.github/workflows').glob('*.yml'))+[Path('action.yml'), Path('.github/actions/just-preview/action.yml'), Path('pnpm-workspace.yaml'), Path('turbo.json')]:
    if p.suffix == '.json':
        json.loads(p.read_text())
    else:
        yaml.safe_load(p.read_text())
    print('ok', p)
PY
```

Result: passed for GitHub workflows, composite action metadata, pnpm workspace, and Turborepo config.

### Release consistency check

```bash
node scripts/check-release.mjs
```

Result: passed.

```txt
Release check passed for v0.4.0.
```

### Dependency installation

```bash
pnpm --version && pnpm install --frozen-lockfile=false
```

Result: failed because Corepack attempted to download pnpm from the npm registry and DNS/network resolution failed in this container.

Relevant error:

```txt
Error when performing the request to https://registry.npmjs.org/pnpm/-/pnpm-10.0.0.tgz
getaddrinfo EAI_AGAIN registry.npmjs.org
```


### Direct TypeScript syntax/typecheck attempt

```bash
tsc -p packages/preview-publisher/tsconfig.json --noEmit
```

Result: incomplete because dependencies and Node type declarations were not installed.

Relevant errors:

```txt
Cannot find module 'node:fs/promises' or its corresponding type declarations.
Cannot find module 'node:path' or its corresponding type declarations.
Cannot find module '@just-agent/preview-core' or its corresponding type declarations.
```

## Commands not fully completed

The following commands require dependency installation and should be run in a normal networked Node/pnpm environment:

```bash
pnpm install
pnpm exec playwright install chromium
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm just-preview doctor
pnpm publish:sample
pnpm readme:sample
pnpm gallery:sample
```

## Notes

- The repository remains a monorepo single-repository / multi-package project.
- README still explicitly states: `This repository uses a monorepo architecture.`
- Chinese README still explicitly states: `Just-Preview 使用 monorepo 单仓多包架构。`
- v0.4.0 adds `@just-agent/preview-publisher` and the `just-preview publish` command for README snippets, PR comments, preview galleries, and release-note Markdown.
