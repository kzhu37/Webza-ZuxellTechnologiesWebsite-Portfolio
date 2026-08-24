const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const configuredTestUrl = process.env.TEST_URL;
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const browserPath = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!browserPath) throw new Error("Chrome or Edge was not found. Set CHROME_PATH to run browser tests.");

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

async function startTestServer() {
  const serverProcess = spawn(process.execPath, [path.join(__dirname, "..", "dev-server.js")], {
    cwd: path.join(__dirname, ".."),
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let errorOutput = "";
  serverProcess.stderr.on("data", (chunk) => { errorOutput += chunk.toString(); });

  const url = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Timed out starting the test server")), 5000);
    serverProcess.stdout.on("data", (chunk) => {
      const match = chunk.toString().match(/Development server ready at (http:\/\/\S+)/);
      if (!match) return;
      clearTimeout(timeout);
      resolve(new URL(match[1]).href);
    });
    serverProcess.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Test server exited with code ${code}: ${errorOutput.trim()}`));
    });
    serverProcess.once("error", reject);
  });

  return { serverProcess, url };
}

async function getJson(url, attempts = 50) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // Chromium may still be starting.
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(url);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const request = this.pending.get(message.id);
        if (!request) return;
        this.pending.delete(message.id);
        if (message.error) request.reject(new Error(message.error.message));
        else request.resolve(message.result);
        return;
      }
      (this.listeners.get(message.method) || []).forEach((listener) => listener(message.params));
    });
  }

  call(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
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

async function run() {
  let siteServer;
  let testUrl = configuredTestUrl;
  if (!testUrl) {
    const startedServer = await startTestServer();
    siteServer = startedServer.serverProcess;
    testUrl = startedServer.url;
  }
  const debugPort = await getAvailablePort();
  const profileDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "zuxell-browser-test-"));
  const browser = spawn(browserPath, [
    "--headless=new",
    "--disable-breakpad",
    "--disable-crash-reporter",
    "--disable-extensions",
    "--disable-gpu",
    "--no-first-run",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDirectory}`,
    "about:blank",
  ], { stdio: "ignore" });

  let browserClient;
  let pageClient;

  try {
    const version = await getJson(`http://127.0.0.1:${debugPort}/json/version`);
    const targets = await getJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((target) => target.type === "page");
    if (!page) throw new Error("No Chromium page target was created");

    browserClient = new CdpClient(version.webSocketDebuggerUrl);
    pageClient = new CdpClient(page.webSocketDebuggerUrl);
    await Promise.all([browserClient.connect(), pageClient.connect()]);

    const consoleErrors = [];
    const failedRequests = [];
    pageClient.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
      consoleErrors.push(exceptionDetails.exception?.description || exceptionDetails.text);
    });
    pageClient.on("Log.entryAdded", ({ entry }) => {
      if (entry.level === "error") consoleErrors.push(entry.text);
    });
    pageClient.on("Network.loadingFailed", ({ errorText, blockedReason }) => {
      if (errorText !== "net::ERR_ABORTED") failedRequests.push(blockedReason || errorText);
    });

    await Promise.all([
      pageClient.call("Runtime.enable"),
      pageClient.call("Log.enable"),
      pageClient.call("Network.enable"),
      pageClient.call("Page.enable"),
    ]);

    const pageLoaded = new Promise((resolve) => pageClient.on("Page.loadEventFired", resolve));
    await pageClient.call("Page.navigate", { url: testUrl });
    await Promise.race([
      pageLoaded,
      delay(10000).then(() => { throw new Error(`Timed out loading ${testUrl}`); }),
    ]);

    await evaluate(pageClient, `new Promise((resolve) => {
      const ready = () => {
        if (document.readyState === "complete" && document.getElementById("lensIntro")) resolve();
        else window.setTimeout(ready, 25);
      };
      ready();
    })`);
    await evaluate(pageClient, `document.getElementById("lensIntro")?.click()`);
    await delay(1500);

    const viewports = [
      { name: "desktop", width: 1440, height: 1000, mobile: false },
      { name: "laptop", width: 1024, height: 768, mobile: false },
      { name: "small-laptop", width: 820, height: 900, mobile: false },
      { name: "tablet", width: 768, height: 1024, mobile: true },
      { name: "mobile", width: 390, height: 844, mobile: true },
      { name: "narrow", width: 320, height: 568, mobile: true },
    ];
    const layout = [];

    for (const viewport of viewports) {
      await pageClient.call("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      await delay(100);
      layout.push(await evaluate(pageClient, `(() => ({
        name: ${JSON.stringify(viewport.name)},
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        navbarHeight: Math.round(document.getElementById("navbar").getBoundingClientRect().height),
        pagePaddingTop: parseFloat(getComputedStyle(document.querySelector(".tab-page.active")).paddingTop),
        introComplete: document.body.classList.contains("intro-done"),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      }))()`));
    }

    await pageClient.call("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(pageClient, `document.querySelector('.nav-links [data-tab="home"]').click()`);
    await delay(250);
    const desktopScreenshotPath = path.join(os.tmpdir(), "zuxell-home-desktop.png");
    const desktopScreenshot = await pageClient.call("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(desktopScreenshotPath, desktopScreenshot.data, "base64");

    const navigation = [];
    for (const tab of ["home", "about", "expertise", "services", "reviews", "contact"]) {
      navigation.push(await evaluate(pageClient, `(() => {
        document.querySelector('.nav-links [data-tab="${tab}"]').click();
        return {
          requested: "${tab}",
          activePage: document.querySelector(".tab-page.active")?.id,
          activeNav: document.querySelector(".nav-links .active")?.dataset.tab,
          scrollTop: window.scrollY
        };
      })()`));
    }

    await pageClient.call("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    const accessibility = await evaluate(pageClient, `(() => {
      const tabLinks = [...document.querySelectorAll("[data-tab]")];
      const labels = [...document.querySelectorAll(".form-group label")];
      const hamburger = document.getElementById("hamburgerBtn");
      const menu = document.getElementById("mobileMenu");
      hamburger.focus();
      hamburger.click();
      const menuOpened = document.getElementById("mobileMenu").classList.contains("open");
      const menuExpanded = hamburger.getAttribute("aria-expanded") === "true" && menu.getAttribute("aria-hidden") === "false";
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      const form = document.getElementById("contactForm");
      const formInitiallyInvalid = !form.checkValidity();
      form.querySelectorAll("[required]").forEach((field) => {
        if (field.tagName === "SELECT") field.selectedIndex = 1;
        else if (field.type === "email") field.value = "test@example.com";
        else if (field.tagName === "TEXTAREA") field.value = "A sufficiently detailed optical project request.";
        else field.value = "Test value";
      });
      return {
        menuOpened,
        menuExpanded,
        menuClosed: !menu.classList.contains("open") && menu.getAttribute("aria-hidden") === "true",
        menuFocusReturned: document.activeElement === hamburger,
        tabControls: tabLinks.length,
        keyboardReachableTabControls: tabLinks.filter((element) => element.matches("a[href], button, [tabindex]:not([tabindex='-1'])")).length,
        hasForm: Boolean(form),
        formInitiallyInvalid,
        completedFormValid: form.checkValidity(),
        requiredFields: form.querySelectorAll("[required]").length,
        formLabels: labels.length,
        associatedFormLabels: labels.filter((label) => label.htmlFor && document.getElementById(label.htmlFor)).length,
        unnamedImages: [...document.images].filter((image) => !image.hasAttribute("alt")).length,
        placeholderLinks: document.querySelectorAll('a[href="#"]').length
      };
    })()`);

    await evaluate(pageClient, `document.querySelector('.mobile-menu [data-tab="services"]').click()`);
    await delay(250);
    const mobileScreenshotPath = path.join(os.tmpdir(), "zuxell-services-mobile.png");
    const mobileScreenshot = await pageClient.call("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(mobileScreenshotPath, mobileScreenshot.data, "base64");

    await evaluate(pageClient, `document.querySelector('.mobile-menu [data-tab="contact"]').click()`);
    await delay(250);
    const contactScreenshotPath = path.join(os.tmpdir(), "zuxell-contact-mobile.png");
    const contactScreenshot = await pageClient.call("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(contactScreenshotPath, contactScreenshot.data, "base64");

    await delay(1000);
    const resources = await evaluate(pageClient, `(() => ({
      images: [...document.images].map((image) => ({ src: image.currentSrc || image.src, loaded: image.complete && image.naturalWidth > 0 })),
      footerLogo: (() => {
        const image = document.querySelector(".footer-brand img");
        const bounds = image.getBoundingClientRect();
        return {
          renderedAspectRatio: bounds.width / bounds.height,
          naturalAspectRatio: image.naturalWidth / image.naturalHeight
        };
      })(),
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || ""
    }))()`);

    console.log(JSON.stringify({
      layout,
      navigation,
      accessibility,
      resources,
      consoleErrors,
      failedRequests,
      screenshots: [desktopScreenshotPath, mobileScreenshotPath, contactScreenshotPath],
    }, null, 2));

    const failures = [
      ...layout.filter((result) => result.horizontalOverflow).map((result) => `${result.name} has horizontal overflow`),
      ...layout.filter((result) => !result.introComplete).map((result) => `${result.name} did not dismiss the intro`),
      ...layout.filter((result) => Math.abs(result.navbarHeight - result.pagePaddingTop) > 1).map((result) => `${result.name} header overlaps page content`),
      ...navigation.filter((result) => result.activePage !== `page-${result.requested}`).map((result) => `Navigation failed for ${result.requested}`),
      ...(accessibility.keyboardReachableTabControls !== accessibility.tabControls ? ["Some internal controls are not keyboard reachable"] : []),
      ...(!accessibility.menuExpanded || !accessibility.menuClosed || !accessibility.menuFocusReturned ? ["Mobile menu accessibility state failed"] : []),
      ...(!accessibility.formInitiallyInvalid || !accessibility.completedFormValid ? ["Contact form validation failed"] : []),
      ...(accessibility.formLabels !== accessibility.associatedFormLabels ? ["Some form labels are not associated"] : []),
      ...(accessibility.placeholderLinks > 0 ? ["Placeholder links remain"] : []),
      ...(!resources.description ? ["Meta description is missing"] : []),
      ...(Math.abs(resources.footerLogo.renderedAspectRatio - resources.footerLogo.naturalAspectRatio) > 0.01 ? ["Footer logo aspect ratio is distorted"] : []),
      ...consoleErrors.map((error) => `Console error: ${error}`),
      ...failedRequests.map((error) => `Request failed: ${error}`),
    ];
    if (failures.length) throw new Error(failures.join("\n"));
  } finally {
    if (browserClient) {
      try {
        await Promise.race([
          browserClient.call("Browser.close"),
          delay(2000),
        ]);
      } catch {
        browser.kill();
      }
    } else {
      browser.kill();
    }
    if (pageClient) pageClient.close();
    if (browserClient) browserClient.close();
    await Promise.race([
      new Promise((resolve) => browser.once("exit", resolve)),
      delay(2000),
    ]);
    if (process.platform === "win32" && browser.pid) {
      spawnSync("taskkill", ["/pid", String(browser.pid), "/T", "/F"], { stdio: "ignore" });
    } else if (browser.exitCode === null) {
      browser.kill("SIGKILL");
    }
    await delay(1000);
    let cleanupError;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      try {
        fs.rmSync(profileDirectory, { recursive: true, force: true });
        cleanupError = undefined;
        break;
      } catch (error) {
        cleanupError = error;
        await delay(300);
      }
    }
    if (cleanupError) console.warn(`Browser profile cleanup was deferred: ${cleanupError.message}`);
    siteServer?.kill("SIGKILL");
  }
}

run().then(
  () => setTimeout(() => process.exit(0), 50),
  (error) => {
    console.error(error.stack || error.message);
    setTimeout(() => process.exit(1), 50);
  },
);
