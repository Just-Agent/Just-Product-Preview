#!/usr/bin/env node
import { readdir, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { html2thumbnail, type Html2ThumbnailOptions } from "@just-agent/html2thumbnail";
import { html2video, type Html2VideoOptions } from "@just-agent/html2video";
import { runPreviewRecipe, validateRecipe, type PreviewRecipe } from "@just-agent/preview-recipe";
import { loadPreviewManifests, writePreviewPublishMarkdown, type PreviewPublishFormat } from "@just-agent/preview-publisher";
import {
  listPlaywrightDevices,
  listViewportPresets,
  loadJsonConfig,
  loadOptionalPreviewConfig,
  mergePreviewOptions,
  normalizePreviewUrl,
  prepareOutputFile,
  removeUndefinedValues,
  resolveOutputPath,
  resolvePath,
  resolveViewport,
  runPreviewDoctor,
  writePreviewManifest,
  type PreviewConfig,
  type PreviewConfigRecord,
  type PreviewResult,
  type ViewportSize
} from "@just-agent/preview-core";
import {
  getBooleanOption,
  getNumberOption,
  getStringOption,
  getViewportOption,
  getWaitUntilOption,
  parseArgs,
  type ParsedArgs
} from "./args.js";
import { CLI_VERSION, printHelp } from "./help.js";
import { initPreviewProject } from "./init.js";

type CaptureCommand = "thumbnail" | "video" | "gif";
type PlannedCommand = CaptureCommand | "recipe";

interface PreviewPlan {
  schemaVersion: "1";
  tool: "just-preview";
  version: string;
  command: PlannedCommand;
  createdAt: string;
  target: Record<string, unknown>;
  output: Record<string, unknown>;
  viewport: ViewportSize | { device: string };
  serve?: Record<string, unknown>;
  recipe?: Record<string, unknown>;
  options: Record<string, unknown>;
  warnings: string[];
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));
  const command = parsed.command;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "thumbnail") {
    const options = await buildThumbnailOptions(parsed);
    const result = await html2thumbnail(options);
    await finishPreviewCommand("thumbnail", result, parsed, summarizeOptions(options));
    return;
  }

  if (command === "video" || command === "gif") {
    const options = await buildVideoOptions(parsed, command);
    const result = await html2video(options);
    await finishPreviewCommand(command, result, parsed, summarizeOptions(options));
    return;
  }

  if (command === "recipe") {
    const recipePath = parsed.positional[0];
    if (!recipePath) {
      throw new Error("Missing recipe path. Usage: just-preview recipe ./recipes/landing-page.json");
    }

    const config = await loadCliConfig(parsed);
    const recipeDefaults = mergePreviewOptions<Record<string, unknown>>(
      config?.defaults,
      config?.recipe as PreviewConfigRecord | undefined
    ) as Partial<PreviewRecipe>;
    const overrides = buildBaseOptions(parsed, {}) as Partial<PreviewRecipe>;
    const result = await runPreviewRecipe(recipePath, overrides, recipeDefaults);
    await finishPreviewCommand("recipe", result, parsed, { recipePath });
    return;
  }

  if (command === "plan") {
    await runPlanCommand(parsed);
    return;
  }

  if (command === "validate") {
    await runValidateCommand(parsed);
    return;
  }

  if (command === "publish") {
    await runPublishCommand(parsed);
    return;
  }

  if (command === "init") {
    await runInitCommand(parsed);
    return;
  }

  if (command === "doctor") {
    await runDoctorCommand(parsed);
    return;
  }

  if (command === "devices") {
    runDevicesCommand(parsed);
    return;
  }

  throw new Error(`Unknown command: ${command}. Run just-preview help for available commands.`);
}

async function buildThumbnailOptions(parsed: ParsedArgs): Promise<Html2ThumbnailOptions> {
  const defaults = await loadCommandDefaults(parsed, "thumbnail");
  return mergePreviewOptions<Record<string, unknown>>(
    buildBaseOptions(parsed, defaults) as Record<string, unknown>,
    {
      fullPage: getBooleanOption(parsed.options, "full-page"),
      omitBackground: getBooleanOption(parsed.options, "omit-background"),
      quality: getNumberOption(parsed.options, "quality")
    }
  ) as Html2ThumbnailOptions;
}

async function buildVideoOptions(parsed: ParsedArgs, command: "video" | "gif"): Promise<Html2VideoOptions> {
  const defaults = await loadCommandDefaults(parsed, command);
  const baseOptions = buildBaseOptions(parsed, defaults);
  return mergePreviewOptions<Record<string, unknown>>(
    baseOptions as Record<string, unknown>,
    {
      output: command === "gif" ? baseOptions.output ?? getDefaultOutputFromDir(baseOptions.outputDir, "preview.gif") : baseOptions.output,
      duration: getNumberOption(parsed.options, "duration"),
      autoScroll: getBooleanOption(parsed.options, "auto-scroll"),
      scrollBy: getNumberOption(parsed.options, "scroll-by"),
      scrollIntervalMs: getNumberOption(parsed.options, "scroll-interval", "scroll-interval-ms"),
      keepRawWebm: getBooleanOption(parsed.options, "keep-webm"),
      fps: getNumberOption(parsed.options, "fps"),
      crf: getNumberOption(parsed.options, "crf"),
      gifFps: getNumberOption(parsed.options, "gif-fps"),
      gifWidth: getNumberOption(parsed.options, "gif-width")
    }
  ) as Html2VideoOptions;
}

function buildBaseOptions(parsed: ParsedArgs, defaults: PreviewConfigRecord = {}): Record<string, unknown> {
  return mergePreviewOptions<Record<string, unknown>>(
    defaults,
    {
      cwd: getStringOption(parsed.options, "cwd"),
      url: getStringOption(parsed.options, "url"),
      file: getStringOption(parsed.options, "file"),
      html: getStringOption(parsed.options, "html"),
      output: getStringOption(parsed.options, "out", "output"),
      outputDir: getStringOption(parsed.options, "output-dir"),
      viewport: getViewportOption(parsed.options),
      device: getStringOption(parsed.options, "device"),
      waitForTimeout: getNumberOption(parsed.options, "wait"),
      waitUntil: getWaitUntilOption(parsed.options),
      timeout: getNumberOption(parsed.options, "timeout"),
      userAgent: getStringOption(parsed.options, "user-agent"),
      executablePath: getStringOption(parsed.options, "chromium-executable", "executable-path"),
      serveCommand: getStringOption(parsed.options, "serve", "serve-command"),
      serveUrl: getStringOption(parsed.options, "serve-url"),
      serveCwd: getStringOption(parsed.options, "serve-cwd"),
      serveTimeout: getNumberOption(parsed.options, "serve-timeout"),
      serveInterval: getNumberOption(parsed.options, "serve-interval"),
      serveProbeMethod: getServeProbeMethod(parsed),
      serveSilent: getBooleanOption(parsed.options, "serve-silent"),
      serveGraceMs: getNumberOption(parsed.options, "serve-grace-ms")
    }
  );
}

async function loadCommandDefaults(
  parsed: ParsedArgs,
  command: "thumbnail" | "video" | "gif" | "recipe",
  options: { includeGlobalDefaults?: boolean } = {}
): Promise<PreviewConfigRecord> {
  const config = await loadCliConfig(parsed);
  if (!config) return {};

  const includeGlobalDefaults = options.includeGlobalDefaults ?? true;
  return mergePreviewOptions<Record<string, unknown>>(
    includeGlobalDefaults ? config.defaults : undefined,
    config[command] as PreviewConfigRecord | undefined
  );
}

async function loadCliConfig(parsed: ParsedArgs): Promise<PreviewConfig | undefined> {
  return loadOptionalPreviewConfig(getStringOption(parsed.options, "config"), getStringOption(parsed.options, "cwd") ?? process.cwd());
}

async function finishPreviewCommand(
  kind: string,
  result: PreviewResult,
  parsed: ParsedArgs,
  metadata?: Record<string, unknown>
): Promise<void> {
  const manifestOption = getStringOption(parsed.options, "manifest", "manifest-out");
  const manifestPath = manifestOption
    ? await writePreviewManifest({
        path: manifestOption,
        version: CLI_VERSION,
        command: kind,
        result,
        metadata
      })
    : undefined;

  printPreviewResult(kind, result, wantsJson(parsed), manifestPath);
}

async function runPlanCommand(parsed: ParsedArgs): Promise<void> {
  const planned = parsed.positional[0];
  if (!isPlannedCommand(planned)) {
    throw new Error("Missing plan target. Usage: just-preview plan <thumbnail|video|gif|recipe> [...options]");
  }

  const nested: ParsedArgs = {
    command: planned,
    positional: parsed.positional.slice(1),
    options: parsed.options
  };

  const plan = planned === "recipe"
    ? await buildRecipePlan(nested)
    : await buildCapturePlan(planned, planned === "thumbnail" ? await buildThumbnailOptions(nested) : await buildVideoOptions(nested, planned));

  const planOut = getStringOption(parsed.options, "plan-out", "manifest");
  if (planOut) {
    await writePlanFile(planOut, plan);
  }

  if (wantsJson(parsed)) {
    console.log(JSON.stringify(plan, null, 2));
    return;
  }

  printPlan(plan, planOut);
}

async function buildCapturePlan(command: CaptureCommand, options: Html2ThumbnailOptions | Html2VideoOptions): Promise<PreviewPlan> {
  const defaultFilename = command === "thumbnail" ? "cover.png" : command === "gif" ? "preview.gif" : "preview.mp4";
  const output = resolveOutputPath({
    output: options.output,
    outputDir: options.outputDir,
    defaultFilename,
    cwd: options.cwd
  });

  return {
    schemaVersion: "1",
    tool: "just-preview",
    version: CLI_VERSION,
    command,
    createdAt: new Date().toISOString(),
    target: describeTarget(options),
    output: {
      path: output,
      defaulted: !options.output
    },
    viewport: describeViewport(options),
    serve: describeServe(options),
    options: removeUndefinedValues(summarizeOptions(options)),
    warnings: buildPlanWarnings(options)
  };
}

async function buildRecipePlan(parsed: ParsedArgs): Promise<PreviewPlan> {
  const recipePath = parsed.positional[0];
  if (!recipePath) {
    throw new Error("Missing recipe path. Usage: just-preview plan recipe ./preview.recipe.json");
  }

  const config = await loadCliConfig(parsed);
  const recipeDefaults = mergePreviewOptions<Record<string, unknown>>(
    config?.defaults,
    config?.recipe as PreviewConfigRecord | undefined
  ) as Partial<PreviewRecipe>;
  const overrides = buildBaseOptions(parsed, {}) as Partial<PreviewRecipe>;
  const rawRecipe = await loadJsonConfig<PreviewRecipe>(recipePath, overrides.cwd ?? recipeDefaults.cwd);
  const recipe = validateRecipe({
    ...recipeDefaults,
    ...rawRecipe,
    ...removeUndefinedValues(overrides as Record<string, unknown>)
  });
  const defaultFilename = recipe.mode === "thumbnail" ? "cover.png" : "preview.mp4";
  const output = resolveOutputPath({
    output: recipe.output,
    outputDir: recipe.outputDir,
    defaultFilename,
    cwd: recipe.cwd
  });

  return {
    schemaVersion: "1",
    tool: "just-preview",
    version: CLI_VERSION,
    command: "recipe",
    createdAt: new Date().toISOString(),
    target: describeTarget(recipe),
    output: {
      path: output,
      defaulted: !recipe.output
    },
    viewport: describeViewport(recipe),
    serve: describeServe(recipe),
    recipe: {
      path: resolvePath(recipe.cwd, recipePath),
      mode: recipe.mode ?? "auto",
      steps: recipe.steps?.length ?? 0
    },
    options: removeUndefinedValues(summarizeOptions(recipe)),
    warnings: buildPlanWarnings(recipe)
  };
}

async function writePlanFile(path: string, plan: PreviewPlan): Promise<void> {
  const output = await prepareOutputFile(path);
  await writeFile(output, JSON.stringify(plan, null, 2) + "\n", "utf8");
}

async function runValidateCommand(parsed: ParsedArgs): Promise<void> {
  const checks: Array<{ name: string; status: "ok" | "error"; message: string }> = [];
  const recipePath = getStringOption(parsed.options, "recipe") ?? parsed.positional[0];
  const configPath = getStringOption(parsed.options, "config");

  if (configPath || !recipePath) {
    try {
      const config = await loadCliConfig(parsed);
      if (config) {
        validatePreviewConfig(config);
        checks.push({ name: "config", status: "ok", message: configPath ?? "auto-detected config is valid JSON with supported top-level keys" });
      } else if (configPath) {
        checks.push({ name: "config", status: "error", message: `Config file not found: ${configPath}` });
      }
    } catch (error) {
      checks.push({ name: "config", status: "error", message: describeError(error) });
    }
  }

  if (recipePath) {
    try {
      const config = await loadCliConfig(parsed);
      const recipeDefaults = mergePreviewOptions<Record<string, unknown>>(
        config?.defaults,
        config?.recipe as PreviewConfigRecord | undefined
      ) as Partial<PreviewRecipe>;
      const rawRecipe = await loadJsonConfig<PreviewRecipe>(recipePath, recipeDefaults.cwd);
      validateRecipe({ ...recipeDefaults, ...rawRecipe });
      checks.push({ name: "recipe", status: "ok", message: `${recipePath} is valid` });
    } catch (error) {
      checks.push({ name: "recipe", status: "error", message: describeError(error) });
    }
  }

  if (checks.length === 0) {
    throw new Error("Nothing to validate. Use --config <file> and/or pass a recipe path.");
  }

  const payload = {
    ok: checks.every((check) => check.status === "ok"),
    checks
  };

  if (wantsJson(parsed)) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log("Just-Preview validation\n");
    for (const check of checks) {
      const marker = check.status === "ok" ? "✓" : "✖";
      console.log(`${marker} ${check.name}: ${check.message}`);
    }
  }

  if (!payload.ok) {
    process.exitCode = 1;
  }
}

function validatePreviewConfig(config: PreviewConfig): void {
  if (!config || typeof config !== "object") {
    throw new Error("Config must be an object.");
  }

  const allowed = new Set(["defaults", "thumbnail", "video", "gif", "recipe", "publish"]);
  for (const key of Object.keys(config as Record<string, unknown>)) {
    if (key === "$schema") continue;
    if (!allowed.has(key)) {
      throw new Error(`Unsupported config key: ${key}`);
    }
  }

  for (const key of allowed) {
    const value = (config as Record<string, unknown>)[key];
    if (value !== undefined && (!value || typeof value !== "object" || Array.isArray(value))) {
      throw new Error(`Config section ${key} must be an object.`);
    }
  }
}


async function runPublishCommand(parsed: ParsedArgs): Promise<void> {
  const config = await loadCliConfig(parsed);
  const publishDefaults = mergePreviewOptions<Record<string, unknown>>(
    config?.publish as PreviewConfigRecord | undefined
  );

  const manifestPaths = await collectManifestPaths(parsed, publishDefaults);
  if (manifestPaths.length === 0) {
    throw new Error("Missing manifest path. Usage: just-preview publish --manifest outputs/preview.manifest.json --format pr-comment --out outputs/pr-comment.md");
  }

  const format = getPublishFormat(getStringOption(parsed.options, "format") ?? asString(publishDefaults.format) ?? "pr-comment");
  const output = getStringOption(parsed.options, "out", "output") ?? asString(publishDefaults.output) ?? defaultPublishOutput(format);
  const manifests = await loadPreviewManifests(manifestPaths);
  const result = await writePreviewPublishMarkdown({
    manifests,
    format,
    output,
    title: getStringOption(parsed.options, "title") ?? asString(publishDefaults.title),
    description: getStringOption(parsed.options, "description") ?? asString(publishDefaults.description),
    baseUrl: getStringOption(parsed.options, "base-url", "asset-base-url", "asset-prefix") ?? asString(publishDefaults.baseUrl),
    repository: getStringOption(parsed.options, "repo", "repository") ?? asString(publishDefaults.repository),
    branch: getStringOption(parsed.options, "branch") ?? asString(publishDefaults.branch),
    sha: getStringOption(parsed.options, "sha") ?? asString(publishDefaults.sha),
    workflowRunUrl: getStringOption(parsed.options, "workflow-run-url") ?? asString(publishDefaults.workflowRunUrl),
    includeTable: getBooleanOption(parsed.options, "include-table") ?? asBoolean(publishDefaults.includeTable),
    includeHtmlVideo: getBooleanOption(parsed.options, "include-html-video") ?? asBoolean(publishDefaults.includeHtmlVideo),
    headingLevel: getNumberOption(parsed.options, "heading-level") ?? asNumber(publishDefaults.headingLevel)
  });

  if (wantsJson(parsed)) {
    console.log(JSON.stringify({
      format: result.format,
      output: result.output,
      assetCount: result.assetCount,
      manifests: manifestPaths
    }, null, 2));
    return;
  }

  console.log("✓ publish markdown generated");
  console.log(`  format: ${result.format}`);
  console.log(`  output: ${result.output ?? "stdout"}`);
  console.log(`  assets: ${result.assetCount}`);
}

async function runInitCommand(parsed: ParsedArgs): Promise<void> {
  const force = getBooleanOption(parsed.options, "force") ?? false;
  const result = await initPreviewProject({
    force,
    targetUrl: getStringOption(parsed.options, "url")
  });

  if (wantsJson(parsed)) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (result.created.length > 0) {
    console.log("Created:");
    for (const file of result.created) console.log(`  ✓ ${file}`);
  }

  if (result.skipped.length > 0) {
    console.log("Kept existing files:");
    for (const file of result.skipped) console.log(`  • ${file}`);
    console.log("Use --force to overwrite starter files.");
  }

  console.log("\nNext commands:");
  console.log("  just-preview validate --config just-preview.config.json preview.recipe.json");
  console.log("  just-preview plan video --config just-preview.config.json");
  console.log("  just-preview thumbnail --config just-preview.config.json --manifest outputs/cover.manifest.json");
  console.log("  just-preview video --config just-preview.config.json --manifest outputs/video.manifest.json");
  console.log("  just-preview gif --config just-preview.config.json");
  console.log("  just-preview recipe ./preview.recipe.json");
  console.log("  just-preview publish --config just-preview.config.json");
}

async function runDoctorCommand(parsed: ParsedArgs): Promise<void> {
  const report = await runPreviewDoctor();

  if (wantsJson(parsed)) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log("Just-Preview doctor\n");
    for (const check of report.checks) {
      const marker = check.status === "ok" ? "✓" : check.status === "warn" ? "!" : "✖";
      console.log(`${marker} ${check.name}: ${check.message}`);
    }
  }

  if (!report.ok) {
    process.exitCode = 1;
  }
}

function runDevicesCommand(parsed: ParsedArgs): void {
  const all = getBooleanOption(parsed.options, "all") ?? false;
  const devices = listPlaywrightDevices();
  const shownDevices = all ? devices : devices.slice(0, 40);
  const payload = {
    viewportPresets: listViewportPresets(),
    devices: shownDevices,
    totalDevices: devices.length,
    truncated: !all && devices.length > shownDevices.length
  };

  if (wantsJson(parsed)) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log("Viewport presets:");
  for (const preset of payload.viewportPresets) {
    console.log(`  ${preset.name.padEnd(8)} ${preset.width}x${preset.height}`);
  }

  console.log("\nPlaywright devices:");
  for (const name of shownDevices) {
    console.log(`  ${name}`);
  }

  if (payload.truncated) {
    console.log(`\nShowing ${shownDevices.length}/${devices.length}. Run just-preview devices --all to list every device.`);
  }
}


async function collectManifestPaths(parsed: ParsedArgs, defaults: PreviewConfigRecord = {}): Promise<string[]> {
  const cwd = getStringOption(parsed.options, "cwd") ?? process.cwd();
  const values = [
    getStringOption(parsed.options, "manifest", "manifests"),
    asString(defaults.manifest),
    asString(defaults.manifests),
    ...parsed.positional
  ].filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  const expanded: string[] = [];
  for (const value of values.flatMap((entry) => entry.split(",")).map((entry) => entry.trim()).filter(Boolean)) {
    if (value.includes("*")) {
      expanded.push(...await expandManifestGlob(value, cwd));
    } else {
      expanded.push(value);
    }
  }

  return [...new Set(expanded)];
}

async function expandManifestGlob(pattern: string, cwd: string): Promise<string[]> {
  if (pattern.includes("**")) {
    throw new Error("Recursive manifest globs are not supported yet. Use a one-level pattern such as outputs/*.manifest.json.");
  }
  const absolutePattern = resolve(cwd, pattern);
  const dir = dirname(absolutePattern);
  const name = basename(absolutePattern);
  const regex = new RegExp(`^${name.split("*").map(escapeRegex).join(".*")}$`);
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && regex.test(entry.name))
    .map((entry) => resolve(dir, entry.name))
    .sort();
}

function getPublishFormat(value: string): PreviewPublishFormat {
  if (value === "pr-comment" || value === "readme" || value === "gallery" || value === "release-note") {
    return value;
  }
  throw new Error("Invalid publish --format. Use pr-comment, readme, gallery, or release-note.");
}

function defaultPublishOutput(format: PreviewPublishFormat): string {
  switch (format) {
    case "pr-comment":
      return "outputs/pr-comment.md";
    case "readme":
      return "outputs/readme-preview.md";
    case "gallery":
      return "outputs/preview-gallery.md";
    case "release-note":
      return "outputs/release-preview.md";
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function escapeRegex(value: string): string {
  return value.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}

function getDefaultOutputFromDir(outputDir: unknown, filename: string): string {
  const dir = typeof outputDir === "string" && outputDir.length > 0 ? outputDir : "outputs";
  return `${dir.replace(/\/$/, "")}/${filename}`;
}

function getServeProbeMethod(parsed: ParsedArgs): "GET" | "HEAD" | undefined {
  const value = getStringOption(parsed.options, "serve-probe", "serve-probe-method");
  if (!value) return undefined;
  const upper = value.toUpperCase();
  if (upper === "GET" || upper === "HEAD") return upper;
  throw new Error("Invalid --serve-probe value. Use GET or HEAD.");
}

function wantsJson(parsed: ParsedArgs): boolean {
  return getBooleanOption(parsed.options, "json") ?? false;
}

function printPreviewResult(kind: string, result: PreviewResult, json: boolean, manifestPath?: string): void {
  if (json) {
    console.log(JSON.stringify(manifestPath ? { ...result, manifest: manifestPath } : result, null, 2));
    return;
  }

  console.log(`✓ ${kind} generated`);
  console.log(`  output: ${result.output}`);
  console.log(`  source: ${result.url}`);
  console.log(`  viewport: ${result.viewport.width}x${result.viewport.height}`);
  if (result.rawOutput) {
    console.log(`  raw: ${result.rawOutput}`);
  }
  if (manifestPath) {
    console.log(`  manifest: ${manifestPath}`);
  }
}

function printPlan(plan: PreviewPlan, writtenPath?: string): void {
  console.log(`Just-Preview plan: ${plan.command}\n`);
  console.log(`target: ${String(plan.target.value ?? plan.target.type ?? "not provided")}`);
  console.log(`output: ${String(plan.output.path)}`);
  if ("device" in plan.viewport) {
    console.log(`viewport: device ${plan.viewport.device}`);
  } else {
    console.log(`viewport: ${plan.viewport.width}x${plan.viewport.height}`);
  }
  if (plan.serve) {
    console.log(`serve: ${String(plan.serve.command)}`);
  }
  if (plan.recipe) {
    console.log(`recipe: ${String(plan.recipe.path)} (${String(plan.recipe.steps)} steps)`);
  }
  if (plan.warnings.length > 0) {
    console.log("\nwarnings:");
    for (const warning of plan.warnings) console.log(`  ! ${warning}`);
  }
  if (writtenPath) {
    console.log(`\nplan written: ${writtenPath}`);
  }
}

function describeTarget(options: Partial<PreviewRecipe> | Html2ThumbnailOptions | Html2VideoOptions): Record<string, unknown> {
  const provided = [options.url, options.file, options.html].filter((value) => value !== undefined && value !== "");
  if (options.url) {
    return { type: "url", value: normalizePreviewUrl(options.url), providedCount: provided.length };
  }
  if (options.file) {
    return { type: "file", value: resolvePath(options.cwd, options.file), providedCount: provided.length };
  }
  if (options.html) {
    return { type: "html", value: "inline html", bytes: options.html.length, providedCount: provided.length };
  }
  if (options.serveCommand) {
    return { type: "serve", value: normalizePreviewUrl(options.serveUrl ?? "http://localhost:3000"), providedCount: provided.length };
  }
  return { type: "missing", providedCount: provided.length };
}

function describeViewport(options: Partial<PreviewRecipe> | Html2ThumbnailOptions | Html2VideoOptions): ViewportSize | { device: string } {
  if (options.device) return { device: options.device };
  return resolveViewport(options.viewport);
}

function describeServe(options: Partial<PreviewRecipe> | Html2ThumbnailOptions | Html2VideoOptions): Record<string, unknown> | undefined {
  if (!options.serveCommand) return undefined;
  return removeUndefinedValues({
    command: options.serveCommand,
    url: normalizePreviewUrl(options.serveUrl ?? options.url ?? "http://localhost:3000"),
    cwd: options.serveCwd,
    timeout: options.serveTimeout,
    interval: options.serveInterval,
    probe: options.serveProbeMethod,
    silent: options.serveSilent
  });
}

function buildPlanWarnings(options: Partial<PreviewRecipe> | Html2ThumbnailOptions | Html2VideoOptions): string[] {
  const warnings: string[] = [];
  const provided = [options.url, options.file, options.html].filter((value) => value !== undefined && value !== "");
  if (provided.length === 0 && !options.serveCommand) {
    warnings.push("No preview target is provided. Add --url, --file, --html, or --serve.");
  }
  if (provided.length > 1) {
    warnings.push("More than one preview target is provided. Runtime capture accepts only one of url, file, or html.");
  }
  if (options.output === undefined) {
    warnings.push("Output path is defaulted. Use --out for stable CI artifact names.");
  }
  return warnings;
}

function summarizeOptions(options: object): Record<string, unknown> {
  const value = options as Record<string, unknown>;
  return removeUndefinedValues({
    url: value.url,
    file: value.file,
    output: value.output,
    outputDir: value.outputDir,
    viewport: value.viewport,
    device: value.device,
    waitUntil: value.waitUntil,
    waitForTimeout: value.waitForTimeout,
    timeout: value.timeout,
    userAgent: value.userAgent,
    executablePath: value.executablePath,
    duration: value.duration,
    autoScroll: value.autoScroll,
    fullPage: value.fullPage,
    fps: value.fps,
    crf: value.crf,
    gifFps: value.gifFps,
    gifWidth: value.gifWidth,
    serveCommand: value.serveCommand,
    serveUrl: value.serveUrl,
    serveCwd: value.serveCwd,
    serveTimeout: value.serveTimeout,
    serveSilent: value.serveSilent,
    serveGraceMs: value.serveGraceMs
  });
}

function isPlannedCommand(value: string | undefined): value is PlannedCommand {
  return value === "thumbnail" || value === "video" || value === "gif" || value === "recipe";
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

main().catch((error) => {
  console.error(`✖ ${describeError(error)}`);
  console.error("Run just-preview help for usage examples.");
  process.exitCode = 1;
});
