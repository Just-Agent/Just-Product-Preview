import { chmod } from "node:fs/promises";

const file = process.argv[2];
if (file) {
  await chmod(file, 0o755).catch(() => undefined);
}
