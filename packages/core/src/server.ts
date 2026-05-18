import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { normalizePreviewUrl } from "./target.js";
import type { PreviewServeOptions } from "./types.js";

export interface StartedPreviewServer {
  command: string;
  url: string;
  pid?: number;
  stop(): Promise<void>;
}

export interface WaitForUrlOptions {
  timeoutMs?: number;
  intervalMs?: number;
  method?: "GET" | "HEAD";
  statusBelow?: number;
}

export async function startPreviewServer(options: PreviewServeOptions = {}): Promise<StartedPreviewServer | undefined> {
  if (!options.serveCommand) return undefined;

  const url = normalizePreviewUrl(options.serveUrl ?? options.url ?? "http://localhost:3000");
  const cwd = resolve(options.cwd ?? process.cwd(), options.serveCwd ?? ".");
  const timeoutMs = options.serveTimeout ?? 30_000;
  const child = spawn(options.serveCommand, {
    cwd,
    shell: true,
    detached: process.platform !== "win32",
    env: { ...process.env, ...options.serveEnv },
    stdio: options.serveSilent ? ["ignore", "pipe", "pipe"] : "inherit"
  });

  const captured: string[] = [];
  const capture = (chunk: Buffer): void => {
    const text = chunk.toString("utf8");
    captured.push(text);
    if (captured.length > 20) captured.shift();
  };

  if (options.serveSilent) {
    child.stdout?.on("data", capture);
    child.stderr?.on("data", capture);
  }

  let exitMessage: string | undefined;
  child.once("exit", (code, signal) => {
    exitMessage = `serve command exited before ${url} was ready (code=${code ?? "null"}, signal=${signal ?? "null"})`;
  });

  try {
    await waitForPreviewServer(url, {
      timeoutMs,
      intervalMs: options.serveInterval ?? 300,
      method: options.serveProbeMethod ?? "GET"
    }, () => exitMessage);
  } catch (error) {
    await stopChildProcess(child, options.serveKillSignal, options.serveGraceMs);
    const logTail = captured.join("").trim();
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(logTail ? `${detail}\n\nServe log tail:\n${logTail}` : detail);
  }

  return {
    command: options.serveCommand,
    url,
    pid: child.pid,
    stop: () => stopChildProcess(child, options.serveKillSignal, options.serveGraceMs)
  };
}

export async function waitForPreviewServer(
  url: string,
  options: WaitForUrlOptions = {},
  getEarlyExitMessage?: () => string | undefined
): Promise<void> {
  const timeoutMs = options.timeoutMs ?? 30_000;
  const intervalMs = options.intervalMs ?? 300;
  const method = options.method ?? "GET";
  const statusBelow = options.statusBelow ?? 500;
  const deadline = Date.now() + timeoutMs;
  let lastError = "server did not respond";

  while (Date.now() < deadline) {
    const earlyExitMessage = getEarlyExitMessage?.();
    if (earlyExitMessage) {
      throw new Error(earlyExitMessage);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Math.min(intervalMs, 1_000));
    try {
      const response = await fetch(url, {
        method,
        signal: controller.signal
      });
      if (response.status < statusBelow) return;
      lastError = `last status was ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(timeout);
    }

    await delay(intervalMs);
  }

  throw new Error(`Timed out after ${timeoutMs}ms waiting for preview server at ${url}. Last error: ${lastError}`);
}

export async function stopChildProcess(
  child: ChildProcess,
  signal: NodeJS.Signals = "SIGTERM",
  graceMs = 2_000
): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return;

  const exited = once(child, "exit").then(() => true).catch(() => true);

  if (process.platform === "win32" && typeof child.pid === "number") {
    await taskkillProcessTree(child.pid, false);
    const graceful = await Promise.race([exited, delay(graceMs)]);
    if (!graceful && child.exitCode === null && child.signalCode === null) {
      const forceExited = once(child, "exit").then(() => true).catch(() => true);
      await taskkillProcessTree(child.pid, true);
      await Promise.race([forceExited, delay(1_000)]).catch(() => undefined);
    }
    return;
  }

  const killed = signalChildProcess(child, signal);

  if (!killed && (child.exitCode !== null || child.signalCode !== null)) {
    return;
  }

  const timedOut = delay(graceMs).then(() => false);
  const graceful = await Promise.race([exited, timedOut]);

  if (!graceful && child.exitCode === null && child.signalCode === null) {
    const forceExited = once(child, "exit").then(() => true).catch(() => true);
    signalChildProcess(child, "SIGKILL");
    await Promise.race([forceExited, delay(1_000)]).catch(() => undefined);
  }
}

function signalChildProcess(child: ChildProcess, signal: NodeJS.Signals): boolean {
  if (process.platform !== "win32" && typeof child.pid === "number") {
    try {
      process.kill(-child.pid, signal);
      return true;
    } catch {
      // Fall through to child.kill for platforms or shells that do not expose a process group.
    }
  }

  return child.kill(signal);
}

async function taskkillProcessTree(pid: number, force: boolean): Promise<void> {
  const args = ["/PID", String(pid), "/T"];
  if (force) args.push("/F");

  await new Promise<void>((resolvePromise) => {
    const killer = spawn("taskkill", args, { stdio: "ignore" });
    killer.once("exit", () => resolvePromise());
    killer.once("error", () => resolvePromise());
  });
}
