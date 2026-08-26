const path = require("node:path");
const { spawn } = require("node:child_process");

const projectRoot = path.join(__dirname, "..");
const server = spawn(process.execPath, [path.join(projectRoot, "dev-server.js")], {
  cwd: projectRoot,
  env: { ...process.env, PORT: "0" },
  stdio: ["ignore", "pipe", "pipe"],
});

let stderr = "";
server.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

function stopServer() {
  if (server.exitCode === null) server.kill("SIGKILL");
}

const readyUrl = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error("Development server did not become ready")), 5000);
  server.stdout.on("data", (chunk) => {
    const match = chunk.toString().match(/Development server ready at (http:\/\/\S+)/);
    if (!match) return;
    clearTimeout(timeout);
    resolve(new URL(match[1]));
  });
  server.once("error", reject);
  server.once("exit", (code) => reject(new Error(`Development server exited with code ${code}: ${stderr.trim()}`)));
});

async function run() {
  try {
    const baseUrl = await readyUrl;
    const checks = [
      { name: "home page", path: "/", status: 200, type: "text/html", method: "GET" },
      { name: "stylesheet", path: "/style.css", status: 200, type: "text/css", method: "HEAD" },
      { name: "JavaScript", path: "/script.js", status: 200, type: "text/javascript", method: "GET" },
      { name: "logo", path: "/LOGOZuxell.png", status: 200, type: "image/png", method: "GET" },
      { name: "missing file", path: "/missing-file.txt", status: 404, type: "text/plain", method: "GET" },
      { name: "unsupported method", path: "/", status: 405, type: "text/plain", method: "POST" },
      { name: "path traversal", path: "/..%2fpackage.json", status: 403, type: "text/plain", method: "GET" },
    ];

    for (const check of checks) {
      const response = await fetch(new URL(check.path, baseUrl), { method: check.method });
      const contentType = response.headers.get("content-type") || "";
      if (response.status !== check.status) throw new Error(`${check.name} returned ${response.status}; expected ${check.status}`);
      if (!contentType.startsWith(check.type)) throw new Error(`${check.name} returned ${contentType}; expected ${check.type}`);
      if (check.method === "HEAD" && (await response.text()).length !== 0) throw new Error(`${check.name} returned a response body`);
    }

    console.log(`Server smoke checks passed at ${baseUrl.href}`);
  } finally {
    stopServer();
  }
}

run().then(
  () => { process.exitCode = 0; },
  (error) => {
    stopServer();
    console.error(error.stack || error.message);
    process.exitCode = 1;
  },
);
