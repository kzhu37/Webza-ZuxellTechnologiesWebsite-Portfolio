const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const configuredTestUrl = process.env.TEST_URL;
const browserCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const browserPath = browserCandidates.find((candidate) => fs.existsSync(candidate));
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
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }
  close() { this.socket.close(); }
}

async function evaluate(client, expression) {
  const result = await client.call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function run() {
  const testUrl = configuredTestUrl || pathToFileURL(path.join(__dirname, "..", "index.html")).href;

  const debugPort = await getAvailablePort();
  const profileDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "zuxell-browser-test-"));
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
  try {
    const version = await getJson(`http://127.0.0.1:${debugPort}/json/version`);
    const targets = await getJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((target) => target.type === "page");
    if (!page) throw new Error("No Chromium page target was created");

    browserClient = new CdpClient(version.webSocketDebuggerUrl);
    pageClient = new CdpClient(page.webSocketDebuggerUrl);
    await Promise.all([browserClient.connect(), pageClient.connect()]);

    const consoleErrors = [];
    pageClient.on("Runtime.exceptionThrown", ({ exceptionDetails }) => consoleErrors.push(exceptionDetails.exception?.description || exceptionDetails.text));
    pageClient.on("Log.entryAdded", ({ entry }) => { if (entry.level === "error") consoleErrors.push(entry.text); });
    await Promise.all([pageClient.call("Runtime.enable"), pageClient.call("Log.enable"), pageClient.call("Page.enable")]);

    const navigationResult = await pageClient.call("Page.navigate", { url: testUrl });
    if (navigationResult.errorText === "net::ERR_BLOCKED_BY_ADMINISTRATOR" && process.env.GITHUB_ACTIONS !== "true") {
      console.warn("Browser smoke checks skipped locally because Chromium policy blocks local navigation");
      return;
    }
    if (navigationResult.errorText) throw new Error(`Browser navigation failed: ${navigationResult.errorText}`);

    let pageReady = false;
    let lastState;
    for (let attempt = 0; attempt < 120; attempt += 1) {
      try {
        lastState = await evaluate(pageClient, `({
          href: location.href,
          ready: document.readyState,
          found: Boolean(document.getElementById('hamburgerBtn'))
        })`);
        if (lastState.found && lastState.ready !== 'loading') {
          pageReady = true;
          break;
        }
      } catch {}
      await delay(100);
    }
    if (!pageReady) throw new Error(`Expected page elements did not load: ${JSON.stringify(lastState)}`);
    await delay(250);

    const viewports = [
      { name: "desktop", width: 1440, height: 1000, mobile: false },
      { name: "laptop", width: 1024, height: 768, mobile: false },
      { name: "tablet", width: 768, height: 1024, mobile: true },
      { name: "mobile", width: 390, height: 844, mobile: true },
      { name: "narrow", width: 320, height: 568, mobile: true },
    ];
    const layout = [];
    for (const viewport of viewports) {
      await pageClient.call("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
      await delay(80);
      layout.push(await evaluate(pageClient, `(() => ({
        name: ${JSON.stringify(viewport.name)},
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        activePage: document.querySelector('.tab-page.active')?.id,
        mobileButtonVisible: getComputedStyle(document.getElementById('hamburgerBtn')).display !== 'none'
      }))()`));
    }

    await pageClient.call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    const navigation = [];
    for (const tab of ["home", "about", "expertise", "services", "contact"]) {
      navigation.push(await evaluate(pageClient, `(() => {
        document.querySelector('.nav-links [data-tab="${tab}"]').click();
        return {
          requested: "${tab}",
          activePage: document.querySelector('.tab-page.active')?.id,
          activeNav: document.querySelector('.nav-links .active')?.dataset.tab,
          hash: location.hash
        };
      })()`));
    }

    await pageClient.call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    const accessibility = await evaluate(pageClient, `(() => {
      const hamburger = document.getElementById('hamburgerBtn');
      const menu = document.getElementById('mobileMenu');
      hamburger.focus();
      hamburger.click();
      const opened = menu.classList.contains('open') && hamburger.getAttribute('aria-expanded') === 'true' && menu.getAttribute('aria-hidden') === 'false';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const closed = !menu.classList.contains('open') && hamburger.getAttribute('aria-expanded') === 'false' && menu.getAttribute('aria-hidden') === 'true';
      const focusReturned = document.activeElement === hamburger;
      return { opened, closed, focusReturned };
    })()`);

    const inquiry = await evaluate(pageClient, `(() => {
      document.querySelector('.mobile-menu [data-tab="contact"]').click();
      const region = document.getElementById('contactForm');
      const fields = [...region.querySelectorAll('input, select, textarea')];
      fields.forEach((field) => {
        if (field.tagName === 'SELECT') field.selectedIndex = 1;
        else if (field.type === 'email') field.value = 'test@example.com';
        else if (field.tagName === 'TEXTAREA') field.value = 'A sufficiently detailed optical engineering project request.';
        else field.value = 'Test value';
      });
      document.getElementById('validateInquiry').click();
      return {
        hasHtmlForm: Boolean(document.querySelector('form')),
        fieldCount: fields.length,
        allValid: fields.every((field) => field.checkValidity()),
        status: document.getElementById('formStatus').textContent,
        activePage: document.querySelector('.tab-page.active')?.id,
        focusedHeading: document.activeElement === document.querySelector('#page-contact h1')
      };
    })()`);

    const content = await evaluate(pageClient, `(() => ({
      missingAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).length,
      placeholderLinks: document.querySelectorAll('a[href="#"]').length,
      metaDescription: document.querySelector('meta[name="description"]')?.content || '',
      pageCount: document.querySelectorAll('.tab-page').length
    }))()`);

    const failures = [
      ...layout.filter((result) => result.horizontalOverflow).map((result) => `${result.name} has horizontal overflow`),
      ...navigation.filter((result) => result.activePage !== `page-${result.requested}` || result.activeNav !== result.requested || result.hash !== `#${result.requested}`).map((result) => `Navigation failed for ${result.requested}`),
      ...(!accessibility.opened || !accessibility.closed || !accessibility.focusReturned ? ["Mobile menu accessibility state failed"] : []),
      ...(inquiry.hasHtmlForm ? ["Inquiry UI includes an HTML form submission path"] : []),
      ...(!inquiry.allValid || !inquiry.status.includes("No information was sent") ? ["Inquiry validation failed"] : []),
      ...(inquiry.activePage !== "page-contact" || !inquiry.focusedHeading ? ["Mobile navigation did not move focus to the destination heading"] : []),
      ...(content.missingAlt > 0 ? ["Some images are missing alt attributes"] : []),
      ...(content.placeholderLinks > 0 ? ["Placeholder links remain"] : []),
      ...(!content.metaDescription ? ["Meta description is missing"] : []),
      ...(content.pageCount !== 5 ? ["Expected five client sections"] : []),
      ...consoleErrors.map((error) => `Console error: ${error}`),
    ];

    if (failures.length) throw new Error(failures.join("\n"));
    console.log("Browser smoke checks passed");
  } finally {
    try { if (browserClient) await Promise.race([browserClient.call("Browser.close"), delay(1500)]); } catch { browser.kill(); }
    pageClient?.close();
    browserClient?.close();
    if (browser.exitCode === null) browser.kill("SIGKILL");
    if (process.platform === "win32" && browser.pid) spawnSync("taskkill", ["/pid", String(browser.pid), "/T", "/F"], { stdio: "ignore" });
    let cleanupError;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      try {
        fs.rmSync(profileDirectory, { recursive: true, force: true });
        cleanupError = undefined;
        break;
      } catch (error) {
        cleanupError = error;
        await delay(250);
      }
    }
    if (cleanupError) console.warn(`Browser profile cleanup was deferred: ${cleanupError.message}`);
  }
}

run().then(
  () => { process.exitCode = 0; },
  (error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  },
);
