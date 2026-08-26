const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".svg", ".yml", ".yaml"]);
const ignoredDirectories = new Set([".git", "node_modules"]);
const forbiddenCodePoints = [0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, 0x2e3a, 0x2e3b];
const forbiddenEntities = ["&" + "ndash;", "&" + "mdash;", "&#" + "8211;", "&#" + "8212;", "&#x" + "2013;", "&#x" + "2014;"];
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
  for (const codePoint of forbiddenCodePoints) {
    const character = String.fromCodePoint(codePoint);
    if (text.includes(character)) failures.push(`${relative}: contains forbidden U+${codePoint.toString(16).toUpperCase()}`);
  }
  const lowered = text.toLowerCase();
  for (const entity of forbiddenEntities) {
    if (lowered.includes(entity)) failures.push(`${relative}: contains forbidden encoded dash ${entity}`);
  }
}

walk(root);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Public text audit passed");
