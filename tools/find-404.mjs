import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
const failed = [];
page.on("requestfailed", (req) => failed.push(`FAILED ${req.url()} ${req.failure()?.errorText}`));
page.on("response", (res) => {
  if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
});
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
for (const route of ["/dashboard/", "/courses/", "/courses/01-intro/what-is-a-computer/", "/roadmap/", "/stats/"]) {
  await page.goto("http://127.0.0.1:4173" + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
}
console.log([...new Set(failed)].join("\n") || "NO_404");
await browser.close();
