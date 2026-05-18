import type { BasePreviewOptions } from "@just-agent/preview-core";

export type PreviewRecipeMode = "video" | "thumbnail";

export type PreviewRecipeStep =
  | { type: "wait"; ms: number }
  | { type: "scroll"; to?: number; by?: number; duration?: number }
  | { type: "click"; selector: string; timeout?: number }
  | { type: "fill"; selector: string; text: string; timeout?: number }
  | { type: "hover"; selector: string; timeout?: number }
  | { type: "press"; selector?: string; key: string; timeout?: number }
  | { type: "screenshot"; output: string; fullPage?: boolean };

export interface PreviewRecipe extends BasePreviewOptions {
  mode?: PreviewRecipeMode;
  steps?: PreviewRecipeStep[];
  duration?: number;
  recordingsDir?: string;
  keepRawWebm?: boolean;
  fps?: number;
  crf?: number;
  gifFps?: number;
  gifWidth?: number;
  fullPage?: boolean;
}
