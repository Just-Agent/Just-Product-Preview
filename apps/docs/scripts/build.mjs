import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const docs = [
  "quick-start.md",
  "cli.md",
  "configuration.md",
  "recipes.md",
  "local-app-serving.md",
  "manifest-and-plan.md",
  "publishing.md",
  "github-actions.md",
  "agent-workflow.md"
];

await mkdir("dist", { recursive: true });

const cards = [];
for (const file of docs) {
  const path = join("..", "..", "docs", file);
  let raw = "";
  try {
    raw = await readFile(path, "utf8");
  } catch {
    raw = `# ${basename(file, ".md")}`;
  }
  const title = raw.match(/^#\s+(.+)$/m)?.[1] ?? basename(file, ".md");
  const excerpt = raw
    .replace(/^#.+$/m, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("```"))[0] ?? "Just-Preview documentation.";
  cards.push(`<article><h2>${escapeHtml(title)}</h2><p>${escapeHtml(excerpt)}</p><code>docs/${escapeHtml(file)}</code></article>`);
}

await writeFile(
  "dist/index.html",
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Just-Preview Docs</title>
    <style>
      body { margin: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f172a; color: #f8fafc; }
      main { max-width: 1120px; margin: 0 auto; padding: 72px 24px; }
      h1 { font-size: clamp(42px, 8vw, 84px); line-height: .95; letter-spacing: -0.06em; margin: 0 0 20px; }
      p { color: #cbd5e1; font-size: 18px; line-height: 1.7; }
      .badge { display: inline-flex; border: 1px solid rgba(147, 197, 253, .35); color: #bfdbfe; border-radius: 999px; padding: 8px 14px; margin-bottom: 24px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 48px; }
      article { border: 1px solid rgba(148, 163, 184, .2); background: rgba(15, 23, 42, .74); border-radius: 22px; padding: 24px; }
      h2 { margin: 0 0 12px; }
      code { color: #93c5fd; }
    </style>
  </head>
  <body>
    <main>
      <div class="badge">monorepo · Agent-native · HTML to Video</div>
      <h1>Preview what your Agent built.</h1>
      <p>Just-Preview is a monorepo-based toolkit for HTML to Video, HTML to Thumbnail, URL to Preview, README Preview Assets, GitHub PR Preview, and Recipe-based Recording.</p>
      <div class="grid">${cards.join("\n")}</div>
    </main>
  </body>
</html>`
);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
