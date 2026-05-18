export const CLI_VERSION = "0.4.1";

export function printHelp(): void {
  console.log(`Just-Preview v${CLI_VERSION}

Preview what your Agent built.

Usage:
  just-preview thumbnail --url <url> --out <file>
  just-preview thumbnail --file <html> --out <file>
  just-preview video --url <url> --out <file>
  just-preview video --file <html> --out <file>
  just-preview gif --url <url> --out <file>
  just-preview recipe <recipe.json>
  just-preview plan <thumbnail|video|gif|recipe> [...options]
  just-preview validate [--config <file>] [recipe.json]
  just-preview publish --manifest <manifest.json> --format <format> --out <file>
  just-preview init [--url <url>] [--force]
  just-preview doctor
  just-preview devices

Commands:
  thumbnail     Generate PNG/JPEG thumbnail from URL, file, or raw HTML.
  video         Generate WebM/MP4/MOV/GIF preview video from URL, file, or raw HTML.
  gif           Shortcut for video output as GIF.
  recipe        Run a preview.recipe.json file.
  plan          Show the resolved capture plan without launching a browser.
  validate      Validate config and recipe files before CI or Agent handoff.
  publish       Generate README snippets, PR comments, galleries, or release notes from manifests.
  init          Create just-preview.config.json, starter recipe, and example HTML.
  doctor        Check Node.js, FFmpeg, and Playwright Chromium readiness.
  devices       List viewport presets and Playwright device names.
  help          Show this help message.

Common options:
  --url <url>              URL to open. localhost:3000 is normalized to http://localhost:3000.
  --file <path>            Local HTML file to open.
  --html <string>          Raw HTML string to preview.
  --out <path>             Output file path.
  --output-dir <dir>       Output directory when --out is omitted.
  --viewport <preset>      desktop, mobile, tablet, wide, square, or WIDTHxHEIGHT.
  --width <number>         Custom viewport width.
  --height <number>        Custom viewport height.
  --device <name>          Playwright device name, e.g. "iPhone 15 Pro".
  --wait <ms>              Extra wait after page load.
  --wait-until <state>     load, domcontentloaded, networkidle, or commit.
  --timeout <ms>           Navigation timeout.
  --chromium-executable <path> Use a local Chromium/Chrome executable. Env fallback: JUST_PREVIEW_CHROMIUM_EXECUTABLE.
  --config <path>          Load options from a Just-Preview config file.
  --manifest <path>        Write a JSON artifact manifest for captures, a plan file for plan, or read manifests for publish.
  --cwd <path>             Resolve config, files, outputs, and serve commands from this directory.
  --json                   Print machine-readable JSON output.

Publish options:
  --manifest <paths>       Manifest path, comma-separated manifest paths, or one-level glob.
  --format <format>        pr-comment, readme, gallery, or release-note.
  --title <text>           Heading used in generated Markdown.
  --description <text>     Description used in generated Markdown.
  --base-url <url>         Base URL or relative path for artifact links.
  --asset-prefix <url>     Alias for --base-url.
  --repo <owner/name>      Repository name for PR comments.
  --branch <name>          Branch name for PR comments.
  --sha <sha>              Commit SHA for PR comments or release notes.
  --workflow-run-url <url> Link back to the GitHub Actions run.

Local app options:
  --serve <command>        Start a local app before capture, e.g. "pnpm dev".
  --serve-url <url>        URL to wait for and capture after --serve starts.
  --serve-cwd <path>       Working directory for the serve command.
  --serve-timeout <ms>     Maximum wait time for the local app to become ready.
  --serve-interval <ms>    Probe interval while waiting for the local app.
  --serve-probe <method>   GET or HEAD. Default: GET.
  --serve-silent           Capture serve logs and only show them on failure.
  --serve-grace-ms <ms>    Grace period before force-stopping the serve command.

Video options:
  --duration <seconds>     Recording duration. Default: 6.
  --auto-scroll            Scroll during recording.
  --scroll-by <pixels>     Auto-scroll distance per interval.
  --scroll-interval <ms>   Auto-scroll interval.
  --keep-webm              Keep raw Playwright WebM path in API result.
  --fps <number>           FFmpeg output FPS.
  --crf <number>           FFmpeg CRF quality value.
  --gif-fps <number>       GIF-specific FPS. Default: 12.
  --gif-width <number>     GIF-specific width. Keeps aspect ratio.

Thumbnail options:
  --full-page              Capture full page.
  --quality <number>       JPEG quality.

Examples:
  just-preview thumbnail --url https://example.com --out cover.png
  just-preview video --url http://localhost:3000 --out preview.mp4 --duration 10
  just-preview video --file ./dist/index.html --out preview.webm --viewport mobile
  just-preview gif --url localhost:3000 --out preview.gif --duration 6 --gif-width 960
  just-preview recipe ./recipes/landing-page.json
  just-preview plan video --config just-preview.config.json --manifest outputs/plan.json
  just-preview validate --config just-preview.config.json ./preview.recipe.json
  just-preview video --serve "pnpm dev" --serve-url localhost:3000 --out preview.mp4 --manifest outputs/preview.manifest.json
  just-preview publish --manifest outputs/cover.manifest.json,outputs/preview.manifest.json --format pr-comment --out outputs/pr-comment.md
  just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
  just-preview doctor
`);
}
