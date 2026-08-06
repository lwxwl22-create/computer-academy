import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:4173";
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
    isMobile: viewport.name === "mobile",
    hasTouch: viewport.name === "mobile",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  for (const [name, route] of routes) {
    await page.goto(base + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(300);
    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflowX = doc.scrollWidth - doc.clientWidth;
      const offenders = [];
      const vw = doc.clientWidth;
      for (const el of Array.from(document.querySelectorAll("body *"))) {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const style = getComputedStyle(el);
        if (style.position === "fixed" || style.position === "sticky") continue;
        if (r.right > vw + 2 || r.left < -2) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: String(el.className).slice(0, 60),
            right: Math.round(r.right),
            left: Math.round(r.left),
          });
        }
      }
      const importantVisible = ["h1", "main", "button", "a"].filter((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).length;
      return {
        overflowX,
        offenders: offenders.slice(0, 8),
        h1: document.querySelector("h1")?.textContent?.slice(0, 50) ?? "",
        importantVisible,
      };
    });
    const flags = [];
    if (report.overflowX > 2) flags.push(`HORIZONTAL_OVERFLOW=${report.overflowX}px`);
    if (report.offenders.length) flags.push(`OFFSCREEN=${report.offenders.map((o) => `${o.tag}.${o.cls}`).join("|")}`);
    console.log(`${viewport.name}-${name}: ${flags.length ? "ISSUES " + flags.join(" ; ") : "clean"} (h1=${report.h1})`);
  }

  if (errors.length) {
    console.log(`${viewport.name} console errors:`);
    for (const e of [...new Set(errors)].slice(0, 10)) console.log("  - " + e.slice(0, 160));
  }
  await context.close();
}

await browser.close();
