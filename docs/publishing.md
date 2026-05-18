# Publishing Preview Assets

Just-Preview v0.4.0 adds a publish layer. Captures can now become README snippets, GitHub PR comments, release note sections, and preview galleries.

The workflow is:

```txt
thumbnail / video / gif / recipe
        ↓
--manifest outputs/*.manifest.json
        ↓
just-preview publish
        ↓
README Preview Assets / GitHub PR Preview / release notes / gallery
```

## Generate a PR comment

```bash
just-preview publish \
  --manifest outputs/cover.manifest.json,outputs/preview.manifest.json \
  --format pr-comment \
  --repo Just-Agent/Just-Product-Preview \
  --branch main \
  --sha $GITHUB_SHA \
  --workflow-run-url $GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID \
  --out outputs/pr-comment.md
```

## Generate a README snippet

```bash
just-preview publish \
  --manifest outputs/cover.manifest.json,outputs/preview.manifest.json \
  --format readme \
  --base-url ./outputs \
  --title "Project preview" \
  --out outputs/readme-preview.md
```

## Generate a gallery

```bash
just-preview publish \
  --manifest outputs/cover.manifest.json,outputs/preview.manifest.json,outputs/mobile.manifest.json \
  --format gallery \
  --out outputs/preview-gallery.md
```

## Generate release-note Markdown

```bash
just-preview publish \
  --manifest outputs/release-cover.manifest.json,outputs/release-video.manifest.json \
  --format release-note \
  --out outputs/release-preview.md
```

## Config-first publishing

`just-preview.config.json` can define a reusable publish target:

```json
{
  "publish": {
    "manifest": "outputs/cover.manifest.json,outputs/preview.manifest.json",
    "format": "pr-comment",
    "output": "outputs/pr-comment.md",
    "title": "Just-Preview artifacts",
    "description": "Preview assets generated for this project."
  }
}
```

Then run:

```bash
just-preview publish --config just-preview.config.json
```

## Why this matters for Agents

Agent-generated frontend work needs a final delivery surface. `just-preview publish` gives the Agent a deterministic way to hand back not only media files, but also Markdown that can be pasted into a PR, README, release, or final response.
