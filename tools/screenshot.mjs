import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = "http://127.0.0.1:4173";
const outDir = join(process.cwd(), "tools", "screenshots");
mkdirSync(outDir, { recursive: true });

const routes = [
  ["home", "/"],
  ["dashboard", "/dashboard/"],
  ["library", "/courses/"],
  ["lesson", "/courses/01-intro/what-is-a-computer/"],
  ["module", "/courses/02-windows/"],
  ["roadmap", "/roadmap/"],
  ["skilltree", "/skill-tree/"],
  ["achievements", "/achievements/"],
  ["stats", "/stats/"],
  ["settings", "/settings/"],
];

const browser = await chromium.launch({ channel: "msedge" });

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.name === "mobile" ? 3 : 1,
    isMobile: viewport.name === "mobile",
    hasTouch: viewport.name === "mobile",
  });
  const page = await context.newPage();
  for (const [name, route] of routes) {
    try {
      await page.goto(base + route, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(outDir, `${viewport.name}-${name}.png`), fullPage: false });
      console.log(`OK ${viewport.name}-${name}`);
    } catch (e) {
      console.log(`FAIL ${viewport.name}-${name}: ${e.message}`);
    }
  }
  await context.close();
}

await browser.close();
