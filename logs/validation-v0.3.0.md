# Validation Notes for v0.3.0

Date: 2026-05-18
Version: 0.3.0
Zip target: `Just-Preview-v0.3.0.zip`

## Completed checks

### JSON validation

Command:

```bash
node scripts/validate-json.mjs
```

Result:

```txt
Validated 36 JSON files.
```

Status: passed.

### Docs build smoke test

Command:

```bash
cd apps/docs
node scripts/build.mjs
```

Result:

```txt
docs-build-ok
```

Status: passed. Generated `apps/docs/dist` was removed after the smoke test to keep the zip source-only.


### Release file check

Command:

```bash
node scripts/check-release.mjs
```

Result:

```txt
Release check passed for v0.3.0.
```

Status: passed.


### Local app server smoke test

Command:

```bash
cd examples/local-app
node server.mjs
curl -fsS http://127.0.0.1:4177
```

Result:

```txt
local-app-server-ok
```

Status: passed.


### TypeScript syntax transpile smoke test

Command:

```bash
node <typescript-transpile-smoke-test>
```

Result:

```txt
ts-transpile-syntax-ok (26 files)
```

Status: passed. This check validates TypeScript syntax without requiring installed npm dependencies.

## Checks attempted but blocked by environment

### pnpm install

Command:

```bash
pnpm install --ignore-scripts
```

Result: failed before dependency installation because Corepack attempted to download pnpm from `registry.npmjs.org` and DNS/network resolution failed with `EAI_AGAIN`.

Impact:

- Full dependency installation could not be completed in this container.
- Full monorepo build, typecheck, lint, test, and browser CLI smoke tests require a normal networked Node/pnpm environment.
- Playwright Chromium installation was not attempted after pnpm installation failed.

## Recommended validation after unzip

```bash
pnpm install
pnpm exec playwright install chromium
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm validate
pnpm just-preview doctor
pnpm just-preview plan video --config just-preview.config.example.json --json
pnpm just-preview thumbnail --file ./examples/local-html/index.html --out outputs/cover.png
pnpm just-preview thumbnail --serve-command "node server.mjs" --serve-cwd examples/local-app --serve-url http://127.0.0.1:4177 --serve-silent --out outputs/local-app-cover.png
```
