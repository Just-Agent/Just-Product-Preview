## Validation attempts
Mon May 18 06:33:50 UTC 2026

$ node --version
v22.16.0

$ pnpm --version
! Corepack is about to download https://registry.npmjs.org/pnpm/-/pnpm-10.0.0.tgz
/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22051
    throw new Error(
          ^

Error: Error when performing the request to https://registry.npmjs.org/pnpm/-/pnpm-10.0.0.tgz; for troubleshooting help, see https://github.com/nodejs/corepack#troubleshooting
    at fetch (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22051:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async fetchUrlStream (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22081:20)
    ... 4 lines matching cause stack trace ...
    at async Object.runMain (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23648:7) {
  [cause]: TypeError: fetch failed
      at node:internal/deps/undici/undici:13510:13
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async fetch (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22045:16)
      at async fetchUrlStream (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22081:20)
      at async download (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22204:18)
      at async installVersion (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22296:55)
      at async Engine.ensurePackageManager (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22847:32)
      at async Engine.executePackageManagerRequest (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22958:25)
      at async Object.runMain (/opt/nvm/versions/node/v22.16.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23648:7) {
    [cause]: Error: getaddrinfo EAI_AGAIN registry.npmjs.org
        at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
      errno: -3001,
      code: 'EAI_AGAIN',
      syscall: 'getaddrinfo',
      hostname: 'registry.npmjs.org'
    }
  }
}

Node.js v22.16.0

$ npm --version
10.9.2

$ ffmpeg -version
ffmpeg version 7.1.3-0+deb13u1 Copyright (c) 2000-2025 the FFmpeg developers

$ python parse JSON
Parsed 30 JSON files successfully.

$ tsc -p packages/core/tsconfig.json --noEmit
packages/core/src/browser.ts(1,98): error TS2307: Cannot find module 'playwright' or its corresponding type declarations.
packages/core/src/config.ts(1,34): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
packages/core/src/config.ts(2,27): error TS2307: Cannot find module 'node:fs' or its corresponding type declarations.
packages/core/src/config.ts(3,37): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
packages/core/src/config.ts(28,47): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
packages/core/src/config.ts(41,70): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
packages/core/src/device.ts(1,25): error TS2307: Cannot find module 'playwright' or its corresponding type declarations.
packages/core/src/doctor.ts(1,26): error TS2307: Cannot find module 'node:child_process' or its corresponding type declarations.
packages/core/src/doctor.ts(2,24): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
packages/core/src/doctor.ts(3,27): error TS2307: Cannot find module 'node:util' or its corresponding type declarations.
packages/core/src/doctor.ts(4,26): error TS2307: Cannot find module 'playwright' or its corresponding type declarations.
packages/core/src/doctor.ts(35,33): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
packages/core/src/doctor.ts(40,27): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
packages/core/src/doctor.ts(47,25): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
packages/core/src/fs.ts(1,55): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
packages/core/src/fs.ts(2,24): error TS2307: Cannot find module 'node:os' or its corresponding type declarations.
packages/core/src/fs.ts(3,34): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
packages/core/src/fs.ts(14,25): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
packages/core/src/output.ts(1,34): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
packages/core/src/output.ts(10,30): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
packages/core/src/target.ts(1,24): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
packages/core/src/target.ts(2,31): error TS2307: Cannot find module 'node:url' or its corresponding type declarations.

$ python relative TypeScript import check
relative TS imports ok

$ final JSON / relative import / package version check
Package versions: ['0.2.0']
Zip target: Just-Preview-v0.2.0.zip
