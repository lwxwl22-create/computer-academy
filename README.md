# Computer Academy 电脑学院

从零开始、系统学习电脑知识的交互式网页学习平台。面向即将进入大学、几乎零电脑基础的高中毕业生，覆盖硬件、Windows、Office、网络、AI 与编程入门。

## 技术栈

- Next.js（App Router，静态导出）
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui 风格组件
- Framer Motion 动画
- Zustand（LocalStorage 持久化学习数据）
- React Query（内容加载态）
- Mermaid、Chart.js、ReactMarkdown
- Vitest + Playwright

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## 检查与测试

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 目录结构

- `src/app` 页面路由
- `src/content` 12 个模块、108 节课的内容数据
- `src/components` UI、页面、模拟器与学习组件
- `src/lib` 类型、状态、搜索、测验、AI 引擎
- `tests` Vitest 单元测试
- `e2e` Playwright 冒烟测试

## 数据

学习进度、XP、徽章、笔记、错题等全部保存在浏览器 LocalStorage，预留后续账号、数据库与云同步能力。

## 部署

推送到 `main` 后，GitHub Actions 会运行 CI，并通过 GitHub Pages 部署到 `/computer-academy`。
