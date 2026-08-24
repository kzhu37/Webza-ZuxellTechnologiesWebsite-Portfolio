const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = "127.0.0.1";
const siteRoot = __dirname;
const defaultPort = 8080;
const requestedPort = process.env.PORT === undefined ? defaultPort : Number(process.env.PORT);

if (!Number.isInteger(requestedPort) || requestedPort < 0 || requestedPort > 65535) {
  console.error(`Invalid PORT value "${process.env.PORT}". Use an integer from 0 to 65535.`);
  process.exit(1);
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
};

function send(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(body);
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    send(response, 405, "Method not allowed");
    return;
  }

  let pathname;

  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
  } catch {
    send(response, 400, "Bad request");
    return;
  }

  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(siteRoot, `.${requestedPath}`);
  const relativePath = path.relative(siteRoot, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    send(response, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(response, 404, "Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!response.headersSent) send(response, 500, "Server error");
      else response.destroy();
    });
    stream.pipe(response);
  });
});

console.log("Starting development server");

function listen(port, attemptsRemaining) {
  const handleListening = () => {
    server.off("error", handleStartupError);
    server.on("error", (error) => console.error("Development server error:", error));
    const address = server.address();
    const activePort = typeof address === "object" && address ? address.port : port;
    console.log(`Development server ready at http://${host}:${activePort}`);
  };

  const handleStartupError = (error) => {
    server.off("listening", handleListening);
    if (error.code === "EADDRINUSE" && attemptsRemaining > 0 && process.env.PORT === undefined) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use; trying ${nextPort} instead.`);
      listen(nextPort, attemptsRemaining - 1);
      return;
    }

    if (error.code === "EADDRINUSE") {
      const portHint = process.platform === "win32"
        ? `$env:PORT=${port + 1}; npm start`
        : `PORT=${port + 1} npm start`;
      console.error(`Port ${port} is already in use. Stop that process or choose another port with: ${portHint}`);
    } else {
      console.error("Development server failed to start:", error);
    }
    process.exit(1);
  };

  server.once("error", handleStartupError);
  server.once("listening", handleListening);
  server.listen(port, host);
}

listen(requestedPort, 10);

function shutDown() {
  server.close(() => process.exit(0));
  const forceCloseTimer = setTimeout(() => {
    server.closeAllConnections?.();
    process.exit(0);
  }, 1500);
  forceCloseTimer.unref();
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
