import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseArgs, getStringOption, getBooleanOption } from "./args.js";

void describe("CLI args", () => {
  void it("parses local serving flags", () => {
    const parsed = parseArgs([
      "video",
      "--serve-command",
      "pnpm dev",
      "--serve-url",
      "localhost:5173",
      "--serve-silent"
    ]);

    assert.equal(parsed.command, "video");
    assert.equal(getStringOption(parsed.options, "serve-command"), "pnpm dev");
    assert.equal(getStringOption(parsed.options, "serve-url"), "localhost:5173");
    assert.equal(getBooleanOption(parsed.options, "serve-silent"), true);
  });
});
