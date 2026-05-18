import { parseViewport, type ViewportPreset, type ViewportSize, type WaitUntilState } from "@just-agent/preview-core";

export interface ParsedArgs {
  command?: string;
  positional: string[];
  options: Record<string, string | boolean>;
}

const WAIT_UNTIL_VALUES = new Set<WaitUntilState>(["load", "domcontentloaded", "networkidle", "commit"]);

export function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const positional: string[] = [];
  const options: Record<string, string | boolean> = {};

  for (let index = 0; index < rest.length; index += 1) {
    const item = rest[index]!;

    if (!item.startsWith("--")) {
      positional.push(item);
      continue;
    }

    const withoutPrefix = item.slice(2);
    const equalIndex = withoutPrefix.indexOf("=");

    if (equalIndex >= 0) {
      const key = withoutPrefix.slice(0, equalIndex);
      const value = withoutPrefix.slice(equalIndex + 1);
      options[key] = value;
      continue;
    }

    const next = rest[index + 1];
    if (next && !next.startsWith("--")) {
      options[withoutPrefix] = next;
      index += 1;
    } else {
      options[withoutPrefix] = true;
    }
  }

  return { command, positional, options };
}

export function getStringOption(options: Record<string, string | boolean>, ...names: string[]): string | undefined {
  for (const name of names) {
    const value = options[name];
    if (typeof value === "string") return value;
  }
  return undefined;
}

export function getBooleanOption(options: Record<string, string | boolean>, ...names: string[]): boolean | undefined {
  for (const name of names) {
    const value = options[name];
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value === "true" || value === "1" || value === "yes";
  }
  return undefined;
}

export function getNumberOption(options: Record<string, string | boolean>, ...names: string[]): number | undefined {
  const raw = getStringOption(options, ...names);
  if (!raw) return undefined;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected numeric option for --${names[0]}, got ${raw}`);
  }
  return parsed;
}

export function getViewportOption(options: Record<string, string | boolean>): ViewportPreset | ViewportSize | undefined {
  const viewport = getStringOption(options, "viewport");
  const width = getNumberOption(options, "width");
  const height = getNumberOption(options, "height");

  if ((width !== undefined && height === undefined) || (width === undefined && height !== undefined)) {
    throw new Error("Both --width and --height are required when using a custom viewport size.");
  }

  if (width !== undefined && height !== undefined) return { width, height };
  return parseViewport(viewport);
}

export function getWaitUntilOption(options: Record<string, string | boolean>): WaitUntilState | undefined {
  const value = getStringOption(options, "wait-until");
  if (!value) return undefined;
  if (WAIT_UNTIL_VALUES.has(value as WaitUntilState)) return value as WaitUntilState;
  throw new Error(`Invalid --wait-until value: ${value}. Use load, domcontentloaded, networkidle, or commit.`);
}
