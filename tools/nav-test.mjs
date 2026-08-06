import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const failed = [];
page.on("requestfailed", (req) => failed.push(req.url()));
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.getByRole("link", { name: "浏览课程" }).click();
await page.waitForURL("**/courses/**", { timeout: 10000 });
await page.waitForLoadState("networkidle");
const url = page.url();
const heading = await page.locator("h1").first().textContent();
console.log(`NAV_OK url=${url} heading=${heading}`);
await page.getByRole("link", { name: /认识电脑/ }).first().click().catch(() => {});
await page.waitForTimeout(2000);
console.log("AFTER_MODULE_CLICK url=" + page.url());
console.log("FAILED_REQS=" + [...new Set(failed)].slice(0, 5).join(" | ") || "none");
await browser.close();
