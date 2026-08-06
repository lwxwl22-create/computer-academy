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

test("command menu opens with Ctrl+K", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+K");
  await expect(page.getByText("搜索课程、知识点、硬件术语")).toBeVisible();
  await page.keyboard.type("CPU");
  await expect(page.getByText("CPU：电脑的大脑")).toBeVisible();
});
