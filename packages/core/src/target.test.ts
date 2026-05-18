import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizePreviewUrl } from "./target.js";

void describe("normalizePreviewUrl", () => {
  void it("adds http to localhost targets", () => {
    assert.equal(normalizePreviewUrl("localhost:5173"), "http://localhost:5173/");
  });

  void it("keeps full https URLs", () => {
    assert.equal(normalizePreviewUrl("https://example.com/demo"), "https://example.com/demo");
  });
});
