# Agent Workflow

Slogan: **Preview what your Agent built.**

The product workflow is simple:

1. An Agent modifies a frontend app.
2. The app is started locally or deployed to a preview URL.
3. Just-Preview generates a thumbnail and video.
4. The final answer includes visual assets instead of only text.

Recommended command sequence:

```bash
just-preview doctor
just-preview validate --config just-preview.config.json ./preview.recipe.json
just-preview plan video --config just-preview.config.json --manifest outputs/video-plan.json
just-preview thumbnail --url http://localhost:3000 --out outputs/cover.png --manifest outputs/cover.manifest.json
just-preview video --url http://localhost:3000 --out outputs/preview.mp4 --duration 8 --manifest outputs/video.manifest.json
just-preview recipe ./recipes/landing-page.json --manifest outputs/recipe.manifest.json
```

This makes generated UI visible, reviewable, and shareable.

## Recommended Agent command for undeployed apps

When an Agent has just created or modified a frontend project, it usually has a local dev command but no deployed URL yet. v0.3.0 supports this directly:

```bash
just-preview video \
  --serve-command "pnpm dev" \
  --serve-url http://localhost:5173 \
  --serve-silent \
  --out outputs/agent-preview.mp4 \
  --duration 8 \
  --manifest outputs/agent-preview.manifest.json
```

This lets the Agent return the changed code plus visual proof: `outputs/agent-preview.mp4`, `outputs/cover.png`, and machine-readable manifest files.


## Agent final-response publishing

After capture, an Agent can generate Markdown that is immediately usable in a PR comment, README, release note, or final response:

```bash
just-preview publish \
  --manifest "outputs/*.manifest.json" \
  --format pr-comment \
  --title "Agent-generated preview" \
  --description "Visual proof for the latest frontend changes." \
  --out outputs/agent-pr-comment.md
```

The Agent can return the code diff, the media files, the manifests, and `outputs/agent-pr-comment.md`. This makes the result visible and reviewable instead of only textual.
