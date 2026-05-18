import { access, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface InitOptions {
  cwd?: string;
  force?: boolean;
  targetUrl?: string;
}

export interface InitResult {
  created: string[];
  skipped: string[];
}

export async function initPreviewProject(options: InitOptions = {}): Promise<InitResult> {
  const cwd = options.cwd ?? process.cwd();
  const targetUrl = options.targetUrl ?? "http://localhost:3000";
  const created: string[] = [];
  const skipped: string[] = [];

  await writeIfMissing(
    resolve(cwd, "just-preview.config.json"),
    JSON.stringify(createDefaultConfig(targetUrl), null, 2) + "\n",
    options.force,
    created,
    skipped
  );

  await writeIfMissing(
    resolve(cwd, "preview.recipe.json"),
    JSON.stringify(createLandingPageRecipe(targetUrl), null, 2) + "\n",
    options.force,
    created,
    skipped
  );

  await mkdir(resolve(cwd, "recipes"), { recursive: true });
  await writeIfMissing(
    resolve(cwd, "recipes", "landing-page.json"),
    JSON.stringify(createLandingPageRecipe(targetUrl), null, 2) + "\n",
    options.force,
    created,
    skipped
  );

  await mkdir(resolve(cwd, "examples", "preview-ready"), { recursive: true });
  await writeIfMissing(
    resolve(cwd, "examples", "preview-ready", "index.html"),
    createPreviewReadyHtml(),
    options.force,
    created,
    skipped
  );

  return { created, skipped };
}

async function writeIfMissing(path: string, content: string, force: boolean | undefined, created: string[], skipped: string[]): Promise<void> {
  if (!force) {
    try {
      await access(path);
      skipped.push(path);
      return;
    } catch {
      // File does not exist yet.
    }
  }

  await writeFile(path, content, "utf8");
  created.push(path);
}

function createDefaultConfig(targetUrl: string): Record<string, unknown> {
  return {
    $schema: "https://just-agent.github.io/Just-Product-Preview/schema/just-preview.config.schema.json",
    defaults: {
      viewport: "desktop",
      waitUntil: "networkidle",
      outputDir: "outputs",
      timeout: 30000,
      waitForTimeout: 500
    },
    thumbnail: {
      url: targetUrl,
      output: "outputs/cover.png",
      fullPage: false,
      quality: 90
    },
    video: {
      url: targetUrl,
      output: "outputs/preview.mp4",
      duration: 8,
      autoScroll: false,
      fps: 30,
      crf: 23
    },
    gif: {
      url: targetUrl,
      output: "outputs/preview.gif",
      duration: 6,
      gifFps: 12,
      gifWidth: 960
    },
    recipe: {
      output: "outputs/recipe-preview.mp4"
    },
    publish: {
      manifest: "outputs/cover.manifest.json,outputs/video.manifest.json,outputs/gif.manifest.json",
      format: "pr-comment",
      output: "outputs/pr-comment.md",
      title: "Just-Preview artifacts",
      description: "Preview assets generated for this project."
    }
  };
}

function createLandingPageRecipe(targetUrl: string): Record<string, unknown> {
  return {
    url: targetUrl,
    output: "outputs/landing-page-preview.mp4",
    viewport: "desktop",
    duration: 1,
    steps: [
      { type: "wait", ms: 800 },
      { type: "scroll", to: 520, duration: 1000 },
      { type: "wait", ms: 600 },
      { type: "scroll", to: 0, duration: 800 }
    ]
  };
}

function createPreviewReadyHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Just-Preview Ready Example</title>
  <style>
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #111827; color: white; }
    main { min-height: 140vh; display: grid; place-items: center; padding: 48px; }
    section { max-width: 860px; border: 1px solid rgba(255,255,255,.14); border-radius: 32px; padding: 48px; background: rgba(17,24,39,.72); }
    h1 { font-size: clamp(44px, 8vw, 88px); line-height: 0.95; margin: 0 0 24px; letter-spacing: -0.06em; }
    p { font-size: 22px; line-height: 1.6; color: #d1d5db; }
    button { margin-top: 28px; border: 0; border-radius: 999px; padding: 16px 24px; font-size: 16px; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <section>
      <p>Just-Preview starter page</p>
      <h1>Preview what your Agent built.</h1>
      <p>Use this HTML page to smoke-test thumbnails, videos, recipes, mobile viewports, and README preview assets.</p>
      <button data-preview="demo-button">Generate preview</button>
    </section>
  </main>
</body>
</html>
`;
}
