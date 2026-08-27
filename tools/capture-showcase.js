const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const root = path.join(__dirname, "..");
const outputDirectory = path.join(root, "docs", "assets", "screenshots");
const browserCandidates = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const browserPath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!browserPath) throw new Error("Chrome or Chromium was not found");

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function getJson(url, attempts = 200) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.socket = new WebSocket(url);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const request = this.pending.get(message.id);
      if (!request) return;
      this.pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });
  }

  call(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const result = await client.call("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result.value;
}

async function waitForPage(client) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const ready = await evaluate(client, `document.readyState !== "loading" && Boolean(document.getElementById("main-content"))`);
    if (ready) break;
    await delay(100);
  }

  await evaluate(client, `(async () => {
    if (document.fonts?.ready) {
      await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 5000))]);
    }
    const visibleImages = [...document.images].filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    });
    await Promise.race([
      Promise.all(visibleImages.map((image) => image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }))),
      new Promise((resolve) => setTimeout(resolve, 8000))
    ]);
    return true;
  })()`);
  await delay(300);
}

async function captureViewport(client, url, viewport, outputPath) {
  await client.call("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  const navigation = await client.call("Page.navigate", { url });
  if (navigation.errorText) throw new Error(`Navigation failed: ${navigation.errorText}`);
  await waitForPage(client);
  const screenshot = await client.call("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  fs.writeFileSync(outputPath, Buffer.from(screenshot.data, "base64"));
}

async function run() {
  fs.mkdirSync(outputDirectory, { recursive: true });

  const debugPort = await getAvailablePort();
  const profileDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "webza-capture-"));
  const browser = spawn(browserPath, [
    "--headless=new",
    "--disable-breakpad",
    "--disable-crash-reporter",
    "--disable-extensions",
    "--disable-gpu",
    "--no-first-run",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--allow-file-access-from-files",
    `--remote-debugging-port=${debugPort}`,
    "--remote-debugging-address=127.0.0.1",
    `--user-data-dir=${profileDirectory}`,
    "about:blank",
  ], { stdio: "ignore" });

  let browserClient;
  let pageClient;
  let socialPreviewPath;

  try {
    const version = await getJson(`http://127.0.0.1:${debugPort}/json/version`);
    const targets = await getJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((target) => target.type === "page");
    if (!page) throw new Error("No Chromium page target was created");

    browserClient = new CdpClient(version.webSocketDebuggerUrl);
    pageClient = new CdpClient(page.webSocketDebuggerUrl);
    await Promise.all([browserClient.connect(), pageClient.connect()]);
    await Promise.all([pageClient.call("Runtime.enable"), pageClient.call("Page.enable")]);

    const siteUrl = pathToFileURL(path.join(root, "index.html")).href;

    await captureViewport(
      pageClient,
      `${siteUrl}#home`,
      { width: 1440, height: 1000, mobile: false },
      path.join(outputDirectory, "zuxell-home-current.png")
    );

    await captureViewport(
      pageClient,
      `${siteUrl}#services`,
      { width: 390, height: 844, mobile: true },
      path.join(outputDirectory, "zuxell-services-current-mobile.png")
    );

    await captureViewport(
      pageClient,
      `${siteUrl}#contact`,
      { width: 390, height: 844, mobile: true },
      path.join(outputDirectory, "zuxell-contact-current-mobile.png")
    );

    const socialOutput = path.join(root, "docs", "assets", "social-preview.png");
    socialPreviewPath = path.join(root, ".social-preview.html");
    const zuxellImage = pathToFileURL(path.join(outputDirectory, "zuxell-home-current.png")).href;
    const webzaImage = pathToFileURL(path.join(outputDirectory, "webza-home.png")).href;

    fs.writeFileSync(socialPreviewPath, `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1280px; height: 640px; overflow: hidden; }
  body {
    font-family: Arial, sans-serif;
    color: #edf5fb;
    background: linear-gradient(135deg, #07101a, #132635);
    padding: 46px 54px;
  }
  .kicker { color: #83d176; font-size: 18px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; }
  h1 { margin: 10px 0 28px; font-size: 44px; line-height: 1.05; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .card { border: 1px solid rgba(151,181,206,.28); background: #101f2d; border-radius: 20px; overflow: hidden; }
  .card img { display: block; width: 100%; height: 340px; object-fit: cover; object-position: top; }
  .label { padding: 15px 18px; font-size: 19px; font-weight: 700; }
  .footer { margin-top: 20px; color: #a8bac8; font-size: 18px; }
</style>
</head>
<body>
  <div class="kicker">Webza x Zuxell Technologies</div>
  <h1>One real-client project, two audiences</h1>
  <div class="grid">
    <div class="card"><img src="${zuxellImage}" alt=""><div class="label">Zuxell Technologies</div></div>
    <div class="card"><img src="${webzaImage}" alt=""><div class="label">Webza</div></div>
  </div>
  <div class="footer">Client acquisition, audience-specific design, front-end development, iteration, and team execution</div>
</body>
</html>`);

    await captureViewport(
      pageClient,
      pathToFileURL(socialPreviewPath).href,
      { width: 1280, height: 640, mobile: false },
      socialOutput
    );

    console.log("Showcase screenshots captured");
  } finally {
    try {
      if (browserClient) await Promise.race([browserClient.call("Browser.close"), delay(1500)]);
    } catch {
      browser.kill();
    }
    pageClient?.close();
    browserClient?.close();
    if (browser.exitCode === null) browser.kill("SIGKILL");
    if (process.platform === "win32" && browser.pid) {
      spawnSync("taskkill", ["/pid", String(browser.pid), "/T", "/F"], { stdio: "ignore" });
    }
    if (socialPreviewPath && fs.existsSync(socialPreviewPath)) fs.rmSync(socialPreviewPath, { force: true });
    fs.rmSync(profileDirectory, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
