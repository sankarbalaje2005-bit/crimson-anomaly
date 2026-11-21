import process from "node:process";

/* ============================================
   CRIMSON ANOMALY — PHASE 5H
   PRODUCTION ROUTE SMOKE TEST

   Examples:

   node scripts/route-smoke.mjs

   node scripts/route-smoke.mjs \
     https://your-real-domain.example

   Uses native fetch — Node.js 18+.
============================================ */

const base = (process.argv[2] ?? "http://localhost:4173").replace(/\/+$/, "");

const routes = ["/", "/lab", "/dimension"];

let failures = 0;

function pass(message) {
  console.log(`PASS  ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`FAIL  ${message}`);
}

async function request(url) {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkRoute(route) {
  const url = `${base}${route}`;

  try {
    const response = await request(url);

    const body = await response.text();

    const contentType = response.headers.get("content-type") ?? "";

    const validHtml =
      contentType.includes("text/html") && body.includes('id="root"');

    if (!response.ok || !validHtml) {
      fail(
        `${route} → ${response.status} ` +
          "(expected the React application HTML)",
      );

      return null;
    }

    pass(`${route} → ${response.status}`);

    return body;
  } catch (error) {
    fail(`${route} → ${String(error)}`);

    return null;
  }
}

async function checkAssets(html) {
  const references = new Set();

  const pattern = /\b(?:src|href)=["'](\/[^"'<>]+)["']/g;

  for (const match of html.matchAll(pattern)) {
    const reference = match[1];

    if (reference.startsWith("//")) {
      continue;
    }

    if (!/\.(js|css)(?:[?#]|$)/i.test(reference)) {
      continue;
    }

    references.add(reference);
  }

  if (references.size === 0) {
    fail("No built JS/CSS asset references found.");
    return;
  }

  for (const reference of references) {
    const url = new URL(reference, base);

    try {
      const response = await request(url.href);

      const contentType = response.headers.get("content-type") ?? "";

      const isJavaScript = /\.js(?:[?#]|$)/i.test(reference);

      const correctType = isJavaScript
        ? contentType.includes("javascript") ||
          contentType.includes("ecmascript")
        : contentType.includes("text/css");

      if (!response.ok || !correctType) {
        fail(`${reference} → ${response.status} ` + `(${contentType})`);
      } else {
        pass(`${reference} → ${response.status}`);
      }
    } catch (error) {
      fail(`${reference} → ${String(error)}`);
    }
  }
}

async function checkSentinel() {
  const route = "/images/crimson-sentinel-hero.webp";

  try {
    const response = await request(`${base}${route}`);

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.includes("image/webp")) {
      fail(`Sentinel asset → ${response.status} ` + `(${contentType})`);
    } else {
      pass(`Sentinel asset → ${response.status}`);
    }
  } catch (error) {
    fail(`Sentinel asset → ${String(error)}`);
  }
}

async function main() {
  console.log("\nCRIMSON ANOMALY — ROUTE TEST");
  console.log(`Target: ${base}\n`);

  let homepageHtml = null;

  for (const route of routes) {
    const html = await checkRoute(route);

    if (route === "/") {
      homepageHtml = html;
    }
  }

  if (homepageHtml) {
    await checkAssets(homepageHtml);
  }

  await checkSentinel();

  console.log("\n---------------------------");

  if (failures === 0) {
    console.log("ROUTE TEST PASSED");
  } else {
    console.error(`ROUTE TEST FAILED: ${failures} issue(s)`);

    process.exitCode = 1;
  }
}

await main();
