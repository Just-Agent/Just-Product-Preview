#!/usr/bin/env node
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, process.env.JUST_PREVIEW_SMOKE_PUBLIC_DIR ?? "examples/local-html");
const port = Number.parseInt(process.env.PORT ?? "4199", 10);
const host = process.env.HOST ?? "127.0.0.1";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"]
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);
    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const safePath = requested.replace(/^\/+/, "").replace(/\.\.+/g, ".");
    const file = join(publicDir, safePath);

    if (!file.startsWith(publicDir) || !existsSync(file)) {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("Not found");
      return;
    }

    const info = await stat(file);
    if (!info.isFile()) {
      response.writeHead(403, { "content-type": "text/plain" });
      response.end("Forbidden");
      return;
    }

    response.writeHead(200, { "content-type": mimeTypes.get(extname(file).toLowerCase()) ?? "application/octet-stream" });
    createReadStream(file).pipe(response);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain" });
    response.end(error instanceof Error ? error.message : String(error));
  }
});

server.listen(port, host, () => {
  console.log(`Just-Preview smoke static server running at http://${host}:${port}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
