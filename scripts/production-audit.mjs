import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";

import path from "node:path";
import process from "node:process";

/* ============================================
   CRIMSON ANOMALY — PHASE 5H
   PRODUCTION BUILD AUDITOR

   Usage:
   npm run build
   node scripts/production-audit.mjs

   Uses Node.js built-ins only.
============================================ */

const root = process.cwd();

const dist = path.join(root, "dist");

const hero = path.join(root, "public", "images", "crimson-sentinel-hero.webp");

const limits = {
  javascript: 400 * 1024,
  css: 180 * 1024,
  image: 700 * 1024,
  total: 2500 * 1024,
};

let errors = 0;
let warnings = 0;

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function pass(message) {
  console.log(`PASS  ${message}`);
}

function warn(message) {
  warnings += 1;
  console.warn(`WARN  ${message}`);
}

function fail(message) {
  errors += 1;
  console.error(`FAIL  ${message}`);
}

function listFiles(folder) {
  if (!existsSync(folder)) {
    return [];
  }

  const results = [];

  for (const entry of readdirSync(folder, {
    withFileTypes: true,
  })) {
    const filename = path.join(folder, entry.name);

    if (entry.isDirectory()) {
      results.push(...listFiles(filename));
    } else if (entry.isFile()) {
      results.push({
        filename,
        relative: path.relative(dist, filename).replaceAll("\\", "/"),
        bytes: statSync(filename).size,
      });
    }
  }

  return results;
}

function classify(filename) {
  const lower = filename.toLowerCase();

  if (/\.(js|mjs)$/.test(lower)) {
    return "javascript";
  }

  if (/\.css$/.test(lower)) {
    return "css";
  }

  if (/\.(webp|avif|png|jpe?g|gif|svg)$/.test(lower)) {
    return "image";
  }

  return "other";
}

function checkHtmlReferences(html) {
  const references = new Set();

  const pattern = /\b(?:src|href)=["']([^"'<>]+)["']/g;

  for (const match of html.matchAll(pattern)) {
    const reference = match[1];

    if (!reference.startsWith("/") || reference.startsWith("//")) {
      continue;
    }

    const pathname = reference.split(/[?#]/)[0];

    if (pathname === "/") {
      continue;
    }

    references.add(pathname);
  }

  for (const reference of references) {
    let decoded;

    try {
      decoded = decodeURIComponent(reference);
    } catch {
      fail(`Invalid URL encoding: ${reference}`);
      continue;
    }

    const target = path.resolve(dist, `.${decoded}`);

    if (!target.startsWith(dist + path.sep) || !existsSync(target)) {
      fail(`Missing built asset: ${reference}`);
    } else {
      pass(`Built reference: ${reference}`);
    }
  }
}

console.log("\n=================================");
console.log(" CRIMSON ANOMALY — BUILD AUDIT");
console.log("=================================\n");

if (!existsSync(dist)) {
  fail("dist/ not found. Run npm run build first.");

  process.exitCode = 1;
} else {
  const indexFile = path.join(dist, "index.html");

  if (!existsSync(indexFile)) {
    fail("dist/index.html is missing.");
  } else {
    pass("Production index.html exists.");

    const html = readFileSync(indexFile, "utf8");

    checkHtmlReferences(html);
  }

  if (!existsSync(hero)) {
    fail("Original Crimson Sentinel image is missing.");
  } else {
    pass("Original Sentinel image exists.");

    const deployedHero = path.join(
      dist,
      "images",
      "crimson-sentinel-hero.webp",
    );

    if (!existsSync(deployedHero)) {
      fail("Sentinel image was not copied to dist/images.");
    } else {
      pass("Sentinel image is included in dist.");
    }
  }

  const files = listFiles(dist);

  const totals = {
    javascript: 0,
    css: 0,
    image: 0,
    other: 0,
  };

  for (const file of files) {
    const type = classify(file.relative);

    totals[type] += file.bytes;

    const limit = limits[type];

    if (limit && file.bytes > limit) {
      warn(
        `Large ${type} file: ` +
          `${file.relative} (${formatBytes(file.bytes)})`,
      );
    }
  }

  const totalBytes = Object.values(totals).reduce(
    (sum, value) => sum + value,
    0,
  );

  console.log("\nASSET SUMMARY");
  console.log("-------------");

  console.log(`JavaScript : ${formatBytes(totals.javascript)}`);

  console.log(`CSS        : ${formatBytes(totals.css)}`);

  console.log(`Images     : ${formatBytes(totals.image)}`);

  console.log(`Other      : ${formatBytes(totals.other)}`);

  console.log(`Total      : ${formatBytes(totalBytes)}`);

  console.log(`Files      : ${files.length}`);

  if (totalBytes > limits.total) {
    warn("Total uncompressed dist size exceeds " + formatBytes(limits.total));
  }

  const hasJavaScript = files.some(
    (file) => classify(file.relative) === "javascript",
  );

  const hasCSS = files.some((file) => classify(file.relative) === "css");

  if (!hasJavaScript) {
    fail("No production JavaScript found.");
  }

  if (!hasCSS) {
    fail("No production CSS found.");
  }

  if (files.length === 0) {
    fail("Production output is empty.");
  }

  console.log("\nRESULTS");
  console.log("-------");
  console.log(`Errors   : ${errors}`);
  console.log(`Warnings : ${warnings}`);

  if (errors > 0) {
    console.error("\nAUDIT FAILED — fix blocking errors.");

    process.exitCode = 1;
  } else {
    console.log("\nAUDIT PASSED — inspect warnings before deployment.");
  }
}
