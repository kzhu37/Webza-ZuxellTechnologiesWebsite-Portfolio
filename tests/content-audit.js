const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".svg", ".yml", ".yaml"]);
const ignoredDirectories = new Set([".git", "node_modules"]);
const forbiddenCodePoints = [0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, 0x2e3a, 0x2e3b];
const forbiddenEntities = ["&" + "ndash;", "&" + "mdash;", "&#" + "8211;", "&#" + "8212;", "&#x" + "2013;", "&#x" + "2014;"];
const forbiddenPublicPhrases = [
  "admissions",
  "university application",
  "university applications",
];
const failures = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (textExtensions.has(path.extname(entry.name).toLowerCase())) inspect(fullPath);
  }
}

function inspect(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const relative = path.relative(root, filePath);
  inspectDashCharacters(relative, text);
  inspectPublicPhrases(relative, text);
  if (path.extname(filePath).toLowerCase() === ".md") inspectDocumentLinks(filePath, relative, text);
}

function inspectDashCharacters(relative, text) {
  for (const codePoint of forbiddenCodePoints) {
    const character = String.fromCodePoint(codePoint);
    if (text.includes(character)) failures.push(`${relative}: contains forbidden U+${codePoint.toString(16).toUpperCase()}`);
  }

  const lowered = text.toLowerCase();
  for (const entity of forbiddenEntities) {
    if (lowered.includes(entity)) failures.push(`${relative}: contains forbidden encoded dash ${entity}`);
  }
}

function inspectPublicPhrases(relative, text) {
  if (relative === path.join("tests", "content-audit.js")) return;
  const lowered = text.toLowerCase();
  for (const phrase of forbiddenPublicPhrases) {
    if (lowered.includes(phrase)) failures.push(`${relative}: contains private portfolio framing: ${phrase}`);
  }
}

function inspectDocumentLinks(filePath, relative, text) {
  const targets = new Set();
  const markdownPattern = /!?(?:\[[^\]]*\])\(([^)]+)\)/g;
  const htmlPattern = /\b(?:src|href)=["']([^"']+)["']/gi;

  for (const match of text.matchAll(markdownPattern)) targets.add(match[1].trim());
  for (const match of text.matchAll(htmlPattern)) targets.add(match[1].trim());

  for (const target of targets) {
    if (!target || target.startsWith("#") || /^(?:https?:|mailto:|data:)/i.test(target)) continue;

    const cleanTarget = target.split("#", 1)[0].split("?", 1)[0];
    if (!cleanTarget) continue;

    const resolved = path.resolve(path.dirname(filePath), cleanTarget);
    const relativeResolved = path.relative(root, resolved);
    if (relativeResolved.startsWith("..") || path.isAbsolute(relativeResolved)) {
      failures.push(`${relative}: local reference escapes repository: ${target}`);
      continue;
    }
    if (!fs.existsSync(resolved)) failures.push(`${relative}: missing local reference: ${target}`);
  }
}

walk(root);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Public content and local-reference audit passed");
