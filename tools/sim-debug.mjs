import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:4173";
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
  await page.goto(base + "/courses/01-intro/what-is-a-computer/", { waitUntil: "networkidle" });

  // scroll through the page so whileInView blocks mount
  for (let y = 0; y < 6000; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // GPU simulator: first card containing emerald blocks
  const gpuInfo = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('[class*="emerald-400"]'));
    if (!els.length) return { found: false };
    const rects = els.slice(0, 6).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), opacity: getComputedStyle(el).opacity };
    });
    const container = els[0].closest("div.rounded-xl") ?? els[0].closest("div.relative");
    const cr = container?.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    return {
      found: true,
      count: els.length,
      rects,
      container: cr ? { x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height) } : null,
      viewportW: vw,
      overflowX: document.documentElement.scrollWidth - vw,
    };
  });
  console.log(viewport.name + " GPU: " + JSON.stringify(gpuInfo));

  // Memory light dot: open memory tab and measure positions
  await page.getByRole("button", { name: "内存", exact: true }).first().click();
  await page.getByRole("button", { name: "打开程序" }).click();
  await page.waitForTimeout(400);
  const memInfo = await page.evaluate(() => {
    const dot = document.querySelector(".bg-sky-400");
    const hdd = Array.from(document.querySelectorAll(".border-amber-300\\/30")).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    });
    const ram = Array.from(document.querySelectorAll(".border-sky-300\\/30")).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    });
    const cpu = Array.from(document.querySelectorAll(".border-indigo-300\\/40")).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    });
    if (!dot) return { found: false, hdd, ram, cpu };
    const r = dot.getBoundingClientRect();
    const style = getComputedStyle(dot);
    return {
      found: true,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      transform: style.transform,
      opacity: style.opacity,
      animating: !!style.animationName && style.animationName !== "none",
      hdd,
      ram,
      cpu,
    };
  });
  console.log(viewport.name + " MEM: " + JSON.stringify(memInfo));

  // CPU blocks: click one block and verify highlight
  await page.getByRole("button", { name: "CPU", exact: true }).first().click();
  await page.locator(".bg-indigo-400\\/20, .bg-indigo-300\\/80").first().click();
  await page.waitForTimeout(200);
  const cpuInfo = await page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll(".bg-indigo-400\\/20, .bg-indigo-300\\/80"));
    return blocks.slice(0, 5).map((el) => ({ cls: el.className.slice(0, 60) }));
  });
  console.log(viewport.name + " CPU_BLOCKS: " + JSON.stringify(cpuInfo));

  await context.close();
}

await browser.close();
