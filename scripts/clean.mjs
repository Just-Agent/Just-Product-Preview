import { rm } from "node:fs/promises";

const paths = ["dist", "outputs", "recordings", ".turbo"];

for (const path of paths) {
  await rm(path, { recursive: true, force: true }).catch(() => undefined);
}
