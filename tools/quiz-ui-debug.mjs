import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// 1) Boolean quiz highlight check
await page.goto(base + "/courses/01-intro/what-is-a-computer/", { waitUntil: "networkidle" });
const q3 = page.locator("div.rounded-xl.border.p-4", { hasText: "内存越大，电脑就一定越快" });
await q3.getByRole("button", { name: /错误/ }).click();
const q1 = page.locator("div.rounded-xl.border.p-4", { hasText: "电脑的核心处理部件是" });
await q1.getByRole("button", { name: /CPU/ }).click();
const q2 = page.locator("div.rounded-xl.border.p-4", { hasText: "断电后仍能长期保存数据的是" });
await q2.getByRole("button", { name: /硬盘 SSD/ }).click();
const q4 = page.locator("div.rounded-xl.border.p-4", { hasText: "哪些属于电脑的输入设备" });
await q4.getByRole("button", { name: /键盘/ }).click();
await q4.getByRole("button", { name: /鼠标/ }).click();
await q4.getByRole("button", { name: /摄像头/ }).click();
const q5 = page.locator("div.rounded-xl.border.p-4", { hasText: "这份清单叫做" });
await q5.getByPlaceholder("输入答案").fill("程序");
await page.getByRole("button", { name: "提交答案" }).click();
await page.waitForTimeout(400);

const q3Buttons = await q3.locator("button").evaluateAll((btns) =>
  btns.map((b) => ({
    text: b.textContent?.trim(),
    cls: String(b.className).includes("emerald") ? "GREEN" : String(b.className).includes("rose") ? "RED" : "plain",
  })),
);
console.log("Q3_BUTTONS: " + JSON.stringify(q3Buttons));
console.log("Q3_BADGE: " + (await q3.locator("div.inline-flex.items-center.rounded-full").first().textContent()));

// 2) GPU tab animation check
await page.goto(base + "/courses/01-intro/what-is-a-computer/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const readOpacities = async () => {
  return page.locator('[class*="emerald-400"]').evaluateAll((els) =>
    els.slice(0, 6).map((el) => ({ cls: el.className.slice(0, 60), opacity: getComputedStyle(el).opacity })),
  );
};
const first = await readOpacities();
await page.waitForTimeout(900);
const second = await readOpacities();
console.log("GPU_OPACITY_1: " + JSON.stringify(first));
console.log("GPU_OPACITY_2: " + JSON.stringify(second));
console.log("GPU_COUNT: " + (await page.locator('[class*="emerald-400"]').count()));
const gpuHtml = await page.locator('[class*="emerald-400"]').first().evaluate((el) => el.outerHTML.slice(0, 200)).catch(() => "NONE");
console.log("GPU_HTML: " + gpuHtml);
console.log("GPU_TABS: " + (await page.locator("button", { hasText: /GPU/ }).count()));

await browser.close();
