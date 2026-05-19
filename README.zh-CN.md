<div align="center">
  <img src="./docs/readme-assets/logo.svg" alt="Just-Product-Preview logo" width="340" />
  <h1>Just-Product-Preview</h1>
  <p><strong>面向 README、PR、Release 和文档工作流的 Agent-native 预览资产生成工具。</strong></p>
  <p>把本地 App、URL 和 HTML 文件转成截图、视频、GIF、manifest 和可发布 Markdown。</p>
  <p>
    <a href="./README.md">English</a>
    ·
    <a href="./docs/quick-start.md">快速开始</a>
    ·
    <a href="./docs/cli.md">CLI</a>
    ·
    <a href="./docs/github-actions.md">GitHub Actions</a>
    ·
    <a href="./docs/recipes.md">Recipes</a>
    ·
    <a href="./examples">示例</a>
    ·
    <a href="./CHANGELOG.md">更新日志</a>
  </p>
  <p>
    <a href="https://github.com/Just-Agent/Just-Product-Preview/actions/workflows/ci.yml"><img src="https://github.com/Just-Agent/Just-Product-Preview/actions/workflows/ci.yml/badge.svg" alt="CI status" /></a>
    <img src="https://img.shields.io/badge/version-0.4.1-2563EB" alt="version 0.4.1" />
    <img src="https://img.shields.io/badge/license-MIT-10B981" alt="MIT license" />
    <img src="https://img.shields.io/badge/node-%3E%3D18-111827" alt="Node 18 or newer" />
    <img src="https://img.shields.io/badge/pnpm-10.33.4-F97316" alt="pnpm 10.33.4" />
    <img src="https://img.shields.io/badge/Playwright-Chromium-2F6FED" alt="Playwright Chromium" />
  </p>
</div>

<p align="center">
  <img src="./docs/assets/just-product-preview-flow.svg" alt="Just-Product-Preview workflow preview" style="max-width:960px;width:100%;" />
</p>

> Preview what your Agent built.

Just-Product-Preview 是 **Just-Preview** 的公开仓库。它用于捕获 Agent 生成或开发者构建的 Web 工作：可以打开线上 URL、本地 HTML 文件，或自动启动本地前端服务，然后产出评审者需要的封面图、演示视频、轻量 GIF、结构化 manifest、GitHub PR Preview 评论、README 片段、Gallery 和 Release Note Markdown。

## 目录

- [为什么需要它](#为什么需要它)
- [它能生成什么](#它能生成什么)
- [最快上手](#最快上手)
- [录制本地 App](#录制本地-app)
- [Recipe 录制](#recipe-录制)
- [发布 Markdown](#发布-markdown)
- [GitHub Action](#github-action)
- [Monorepo 架构](#monorepo-架构)
- [验证](#验证)
- [路线图](#路线图)

## 为什么需要它

AI Agent 和前端工具已经能很快生成 UI，但评审、交付和发布仍然需要看见真实效果。截图、视频、GIF 和 PR 评论不应该靠人工临时拼接，而应该成为可复现的工程流程。

Just-Preview 把这件事收敛成一条稳定链路：

| 工作流 | Just-Preview 做什么 | 价值 |
| --- | --- | --- |
| 本地功能评审 | 启动 App、等待 URL、捕获媒体、停止进程。 | 没有 preview deployment 时也能看见 UI。 |
| README 展示 | 生成封面图、视频、GIF 和 Markdown 片段。 | 公开仓库有可视化证明，不只是一段描述。 |
| Agent 交接 | 写入带路径、元数据、命令类型和来源目标的 manifest。 | Agent 可以交付结构化结果，而不是散落文件名。 |
| CI Preview | 在 GitHub Actions 中运行同一套 capture 命令。 | Pull Request 可以自动附带预览资产。 |
| Release Proof | 把 manifest 组合发布成 Release Note Markdown。 | 发布说明能展示变化，而不是只描述变化。 |

## 它能生成什么

| 场景 | 命令入口 | 输出 |
| --- | --- | --- |
| README 封面图 | `just-preview thumbnail` | PNG 或 JPEG 缩略图。 |
| 产品演示视频 | `just-preview video` | HTML to Video，输出 WebM、MP4 或 MOV。 |
| 轻量动图 | `just-preview gif` | 可控制 FPS 和宽度的 GIF 预览。 |
| 脚本化录制 | `just-preview recipe` | Recipe-based Recording，支持 wait、scroll、click、fill、hover、press、screenshot。 |
| Agent 交接 | `--manifest` | 给 CI、Agent 和 release scripts 使用的 JSON artifact manifest。 |
| 发布闭环 | `just-preview publish` | README 片段、GitHub PR Preview 评论、Gallery 或 Release Note Markdown。 |
| 预检 | `just-preview plan` / `just-preview validate` | 打开浏览器前解析 capture plan，并校验 schema。 |

## 最快上手

克隆、安装、构建并检查本地环境：

```bash
git clone https://github.com/Just-Agent/Just-Product-Preview.git
cd Just-Product-Preview
pnpm install
pnpm browsers:install
pnpm build
pnpm just-preview doctor
```

如果要生成 MP4、MOV 或 GIF，需要安装完整系统 FFmpeg。Ubuntu runner 示例：

```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
```

用内置静态 HTML 示例生成预览：

```bash
pnpm just-preview thumbnail --file ./examples/local-html/index.html --out outputs/cover.png
pnpm just-preview video --file ./examples/local-html/index.html --out outputs/preview.webm --duration 3
pnpm just-preview gif --file ./examples/local-html/index.html --out outputs/preview.gif --duration 3 --gif-width 720
```

录制任意 URL：

```bash
pnpm just-preview thumbnail --url https://example.com --out outputs/cover.png
pnpm just-preview video --url https://example.com --out outputs/preview.mp4 --duration 8
```

## 录制本地 App

这是最适合 Agent 的工作流：前端尚未部署时，由 Just-Preview 启动本地服务并捕获真实页面。

```bash
pnpm just-preview video \
  --serve-command "pnpm dev" \
  --serve-url http://localhost:5173 \
  --out outputs/preview.mp4 \
  --duration 8 \
  --manifest outputs/preview.manifest.json
```

如果前端在 monorepo 子目录中：

```bash
pnpm just-preview thumbnail \
  --serve-command "pnpm dev" \
  --serve-cwd apps/web \
  --serve-url http://localhost:3000 \
  --serve-silent \
  --out outputs/cover.png \
  --manifest outputs/cover.manifest.json
```

运行仓库内置本地 App 示例：

```bash
pnpm just-preview video \
  --serve-command "node server.mjs" \
  --serve-cwd examples/local-app \
  --serve-url http://127.0.0.1:4177 \
  --serve-silent \
  --out outputs/local-app-preview.webm \
  --duration 5 \
  --manifest outputs/local-app-preview.manifest.json
```

## Recipe 录制

Recipe 用来把录制步骤固定下来，适合滚动演示、状态切换、移动端预览、文档站、Dashboard 和 PR 演示。

```json
{
  "serveCommand": "pnpm dev",
  "serveUrl": "http://localhost:5173",
  "serveSilent": true,
  "output": "outputs/preview.mp4",
  "viewport": "desktop",
  "steps": [
    { "type": "wait", "ms": 800 },
    { "type": "scroll", "to": 600, "duration": 1200 },
    { "type": "click", "selector": "[data-preview='demo-button']" }
  ]
}
```

运行和校验 recipe：

```bash
pnpm just-preview validate --config just-preview.config.example.json recipes/landing-page.json
pnpm just-preview plan video --config just-preview.config.example.json --manifest outputs/video-plan.json
pnpm just-preview recipe recipes/landing-page.json
```

支持的步骤：

| Step | 用途 |
| --- | --- |
| `wait` | 等待动画、数据或路由切换。 |
| `scroll` | 录制长页面并展示下方内容。 |
| `click` | 触发 UI 状态。 |
| `fill` | 输入表单内容。 |
| `hover` | 展示 hover 状态。 |
| `press` | 触发键盘流程。 |
| `screenshot` | 在 recipe 中额外截取静态帧。 |

## 发布 Markdown

Capture 命令可以写入 manifest。Publisher 会把这些 manifest 转成可直接阅读、粘贴或上传的 Markdown。

```bash
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format readme --base-url ./outputs --out outputs/readme-preview.md
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format pr-comment --out outputs/pr-comment.md
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format gallery --out outputs/preview-gallery.md
pnpm just-preview publish --manifest "outputs/*.manifest.json" --format release-note --out outputs/release-preview.md
```

如果产物会托管在 GitHub Pages、Release assets 或 artifact proxy 上，可以设置 `--base-url` 或 `--asset-prefix`：

```bash
pnpm just-preview publish \
  --manifest "outputs/*.manifest.json" \
  --format pr-comment \
  --repo Just-Agent/Just-Product-Preview \
  --branch main \
  --sha "$GITHUB_SHA" \
  --workflow-run-url "$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" \
  --base-url https://just-agent.github.io/Just-Product-Preview/previews/pr-123 \
  --out outputs/pr-comment.md
```

## GitHub Action

仓库内置 reusable composite action。当前如果还没有切出版本 tag，可以先 pin `@main` 或具体 commit SHA；正式打出 `v0.4.1` tag 后，再切换到版本 tag。

```yaml
name: Generate Preview

on:
  pull_request:
  workflow_dispatch:

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Just-Agent/Just-Product-Preview@main
        with:
          command: video
          url: https://example.com
          out: outputs/preview.mp4
      - uses: actions/upload-artifact@v4
        with:
          name: just-preview-assets
          path: outputs/*
```

完整 workflow 包含浏览器安装、FFmpeg 安装、静态 HTML capture、本地 App capture 和 publish-ready Markdown，见 [docs/github-actions.md](./docs/github-actions.md) 与 [.github/workflows/preview.yml](./.github/workflows/preview.yml)。

## Monorepo 架构

Just-Preview 使用 monorepo 单仓多包架构。

CLI、可复用包、文档、recipes、示例、GitHub Action、release checks 和验证日志都在同一个仓库中维护，保证 capture 行为和 publish 行为同步演进。

```txt
Just-Product-Preview/
  apps/
    cli/                  # just-preview 命令
    docs/                 # 文档构建器
  packages/
    core/                 # 浏览器、配置、设备、本地服务生命周期、manifest、diagnostics
    html2thumbnail/       # HTML to Thumbnail
    html2video/           # HTML to Video / WebM / MP4 / MOV / GIF
    preview-recipe/       # Recipe-based Recording
    preview-publisher/    # README / PR / Gallery / Release Note Markdown
  docs/                   # 用户文档
  examples/               # URL、HTML、本地 App、publish workflow、GitHub Action 示例
  recipes/                # 可复用录制 recipes
  schema/                 # config JSON schema
  scripts/                # validation、release、smoke checks
  action.yml              # reusable composite GitHub Action
```

## 包结构

| Package | 用途 |
| --- | --- |
| `@just-agent/preview-core` | 浏览器自动化、设备预设、本地服务生命周期、配置、输出路径、manifest、diagnostics、FFmpeg 解析和文件工具。 |
| `@just-agent/html2thumbnail` | 把 HTML、URL、本地前端输出转成 PNG 或 JPEG 缩略图。 |
| `@just-agent/html2video` | 把 HTML、URL、本地前端输出转成 WebM、MP4、MOV 或 GIF。 |
| `@just-agent/preview-recipe` | 运行可复现的脚本化录制步骤。 |
| `@just-agent/preview-publisher` | 把 artifact manifest 转成 README、PR 评论、Gallery 和 Release Note Markdown。 |
| `@just-agent/preview-cli` | CLI 入口，命令名为 `just-preview`。 |

## Agent 工作流

```mermaid
flowchart LR
    A["Agent 或开发者修改 Web UI"] --> B["just-preview 打开或启动目标页面"]
    B --> C["生成 PNG、视频、GIF 或 recipe 产物"]
    C --> D["写入 artifact manifest"]
    D --> E["发布 README、PR、Gallery 或 Release Note Markdown"]
    E --> F["评审者直接看到变化"]
```

## 验证

本地 release checks：

```bash
pnpm validate:json
pnpm release:check
pnpm release:checklist
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm smoke:publish
pnpm smoke:action-inputs
pnpm smoke:local-html
```

CI 会执行同一组 release checks，安装 Playwright Chromium 和系统 FFmpeg，运行 `doctor`，校验 config 与 recipes，写入 plan manifest，并执行 smoke preview flows。

## 环境要求

| 依赖 | 说明 |
| --- | --- |
| Node.js | 18 或更高版本，CI 使用 Node 22。 |
| pnpm | `10.33.4` 已在 `packageManager` 中固定。 |
| Playwright Chromium | 浏览器截图和录制需要，使用 `pnpm browsers:install` 安装。 |
| FFmpeg | MP4、MOV 和 GIF 转换需要；GIF 输出建议使用系统 FFmpeg。 |

## README 资产

| Asset | 路径 | 用途 |
| --- | --- | --- |
| 产品 wordmark | [docs/readme-assets/logo.svg](./docs/readme-assets/logo.svg) | README 首屏项目识别。 |
| 工作流预览图 | [docs/assets/just-product-preview-flow.svg](./docs/assets/just-product-preview-flow.svg) | 解释输入、CLI 命令和输出产物。 |

## 发布状态

当前源码版本为 `0.4.1`。

v0.4.1 重点是 release hardening：

- 使用 `pnpm-lock.yaml` 锁定依赖图。
- 包版本固定，不使用 `latest`。
- 测试脚本在 compiled Node tests 失败时会真实失败。
- Composite action 根据命令选择默认输出。
- 可发布包补齐 license、repository、homepage、bugs、keywords 和 public publish metadata。
- Smoke 脚本覆盖 publish Markdown、Action 输入、本地 HTML capture、thumbnail、video、GIF 和 manifest 输出。
- 支持 `--chromium-executable` 或 `JUST_PREVIEW_CHROMIUM_EXECUTABLE` 指定 Chromium。

发布参考：

- [CHANGELOG.md](./CHANGELOG.md)
- [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
- [RELEASE_MANIFEST.md](./RELEASE_MANIFEST.md)
- [LOGS.md](./LOGS.md)

## 路线图

| 版本 | 重点 | 状态 |
| --- | --- | --- |
| `v0.1.0` | Monorepo MVP、core、thumbnail、video、recipe、CLI。 | 已完成 |
| `v0.2.0` | GIF、config、init、doctor、devices、docs、schema、logs。 | 已完成 |
| `v0.3.0` | 本地 App serving、plan、validate、manifest。 | 已完成 |
| `v0.4.0` | manifest-to-Markdown publishing 和 reusable GitHub Action。 | 已完成 |
| `v0.4.1` | release hardening、smoke checks、包元数据、依赖锁定。 | 已完成 |
| `v0.5.0` | Claude Code、Codex、Cursor、Just-Agent 的 Agent 集成指南。 | 计划中 |
| `v0.6.0` | Preview Studio UI、设备选择、历史记录和导出控制。 | 计划中 |

## License

MIT. See [LICENSE](./LICENSE).
