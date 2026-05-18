export type WaitUntilState = "load" | "domcontentloaded" | "networkidle" | "commit";

export type ViewportPreset = "desktop" | "mobile" | "tablet" | "wide" | "square";

export type ServeProbeMethod = "GET" | "HEAD";

export interface ViewportSize {
  width: number;
  height: number;
}

export interface PreviewTarget {
  /** Remote URL such as https://example.com or local dev URL such as http://localhost:3000. */
  url?: string;
  /** Local HTML file path. */
  file?: string;
  /** Raw HTML string. It will be written to a temporary file before opening in Chromium. */
  html?: string;
}

export interface PreviewServeOptions extends PreviewTarget {
  /** Current working directory for resolving relative paths and running local preview servers. */
  cwd?: string;
  /** Optional shell command used to start a local app before capture, for example "pnpm dev". */
  serveCommand?: string;
  /** URL to wait for after starting serveCommand. Falls back to url, then http://localhost:3000. */
  serveUrl?: string;
  /** Working directory for serveCommand, relative to cwd when not absolute. */
  serveCwd?: string;
  /** Extra environment variables for serveCommand. */
  serveEnv?: Record<string, string>;
  /** Maximum time to wait for serveUrl. */
  serveTimeout?: number;
  /** Polling interval while waiting for serveUrl. */
  serveInterval?: number;
  /** HTTP method used to probe serveUrl. */
  serveProbeMethod?: ServeProbeMethod;
  /** Capture serve output and only show it on failure. */
  serveSilent?: boolean;
  /** Signal used to stop serveCommand after capture. */
  serveKillSignal?: NodeJS.Signals;
  /** Grace period before force-killing serveCommand. */
  serveGraceMs?: number;
}

export interface BasePreviewOptions extends PreviewServeOptions {
  /** Final output file path. */
  output?: string;
  /** Base output directory used when output is not provided. */
  outputDir?: string;
  /** Playwright device name, for example "iPhone 15 Pro". */
  device?: string;
  /** Viewport preset or custom size. Ignored when a full Playwright device preset is used. */
  viewport?: ViewportPreset | ViewportSize;
  /** Page navigation wait state. */
  waitUntil?: WaitUntilState;
  /** Navigation timeout in milliseconds. */
  timeout?: number;
  /** Extra wait after page load in milliseconds. */
  waitForTimeout?: number;
  /** Custom user agent. */
  userAgent?: string;
  /** Optional Chromium executable path. Can also be set with JUST_PREVIEW_CHROMIUM_EXECUTABLE. */
  executablePath?: string;
  /** Override device scale factor. */
  deviceScaleFactor?: number;
  /** Enable touch support. */
  hasTouch?: boolean;
  /** Mark context as mobile. */
  isMobile?: boolean;
}

export interface BrowserSetupOptions extends BasePreviewOptions {
  /** Enable video recording. */
  recordVideo?: boolean;
  /** Directory for raw Playwright recording files. */
  recordVideoDir?: string;
  /** Recording size. Defaults to resolved viewport. */
  recordVideoSize?: ViewportSize;
}

export interface ResolvedPreviewTarget {
  url: string;
  cleanup?: () => Promise<void>;
}

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface PreviewResult {
  output: string;
  url: string;
  viewport: ViewportSize;
  rawOutput?: string;
}
