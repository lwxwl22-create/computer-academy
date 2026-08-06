import { expect, test } from "@playwright/test";

test("home page shows hero and modules", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Computer Academy/i })).toBeVisible();
  await expect(page.getByText("从零开始，系统学习电脑知识。", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("模块 01").first()).toBeVisible();
});

test("course lesson can be opened and completed", async ({ page }) => {
  await page.goto("/courses/01-intro/what-is-a-computer/");
  await expect(page.getByRole("heading", { name: "电脑是什么" })).toBeVisible();
  await expect(page.getByText("学习目标")).toBeVisible();
  await page.getByRole("button", { name: /完成课程/ }).click();
  await expect(page.getByRole("button", { name: /已完成/ })).toBeVisible();
});

test("quiz can be answered and graded", async ({ page }) => {
  await page.goto("/courses/01-intro/what-is-a-computer/");
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.getByText("还有题目没答完")).toBeVisible();
});

test("boolean quiz question grades correctly", async ({ page }) => {
  await page.goto("/courses/01-intro/what-is-a-computer/");

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
  await expect(q3.getByText("正确", { exact: true })).toBeVisible();
  await expect(q3.getByText("正确答案：错误", { exact: false })).toBeVisible();
});

test("command menu opens with Ctrl+K", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+K");
  await expect(page.getByText("搜索课程、知识点、硬件术语")).toBeVisible();
  await page.keyboard.type("CPU");
  await expect(page.getByText("CPU：电脑的大脑")).toBeVisible();
});
