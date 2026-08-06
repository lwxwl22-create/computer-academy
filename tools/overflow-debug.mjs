import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
await page.goto("http://127.0.0.1:4173/skill-tree/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const info = await page.evaluate(() => {
  const doc = document.documentElement;
  const out = { docScroll: doc.scrollWidth, docClient: doc.clientWidth };
  const offenders = [];
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0) continue;
    if (r.right > doc.clientWidth + 1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 90),
        right: Math.round(r.right),
        width: Math.round(r.width),
      });
    }
  }
  out.offenders = offenders.slice(0, 12);
  return out;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
