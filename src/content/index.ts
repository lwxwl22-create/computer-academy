import { CourseModule, Lesson } from "@/lib/schema";
import { module01 } from "@/content/modules/01-intro";
import { module02 } from "@/content/modules/02-windows";
import { module03 } from "@/content/modules/03-internet";
import { module04 } from "@/content/modules/04-office";
import { module05 } from "@/content/modules/05-maintenance";
import { module06 } from "@/content/modules/06-hardware";
import { module07 } from "@/content/modules/07-college-software";
import { module08 } from "@/content/modules/08-buying";
import { module09 } from "@/content/modules/09-troubleshooting";
import { module10 } from "@/content/modules/10-ai-era";
import { module11 } from "@/content/modules/11-programming";
import { module12 } from "@/content/modules/12-future";

export const modules: CourseModule[] = [
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
  module11,
  module12,
].sort((a, b) => a.order - b.order);

export const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
export const totalMinutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);

export function getModule(slug: string): CourseModule | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getLesson(moduleSlug: string, lessonSlug: string): Lesson | undefined {
  const mod = getModule(moduleSlug);
  return mod?.lessons.find((l) => l.slug === lessonSlug);
}

export function lessonIndex(moduleSlug: string, lessonSlug: string) {
  const mod = getModule(moduleSlug);
  if (!mod) return { index: -1, prev: null, next: null, module: null };
  const index = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  const prev = index > 0 ? mod.lessons[index - 1] : null;
  const next = index >= 0 && index < mod.lessons.length - 1 ? mod.lessons[index + 1] : null;
  return { index, prev, next, module: mod };
}

export function allLessons(): { module: CourseModule; lesson: Lesson; index: number }[] {
  const out: { module: CourseModule; lesson: Lesson; index: number }[] = [];
  for (const mod of modules) {
    mod.lessons.forEach((lesson, index) => out.push({ module: mod, lesson, index }));
  }
  return out;
}

export function knowledgeIndex() {
  const terms: { term: string; answer: string; tags: string[] }[] = [
    { term: "cpu", answer: "CPU 是中央处理器，负责执行指令与计算。核心数决定并行能力，频率决定单核速度，缓存加速高频数据访问。", tags: ["cpu", "处理器", "硬件"] },
    { term: "内存", answer: "内存 RAM 是临时工作台，速度快但断电清空。容量决定同时能开多少程序，频率与双通道影响速度。", tags: ["内存", "ram", "硬件"] },
    { term: "硬盘", answer: "SSD 固态硬盘用闪存长期存储，速度快、抗震；机械硬盘便宜但慢。重要数据要备份，遵循 3-2-1 原则。", tags: ["硬盘", "ssd", "存储"] },
    { term: "显卡", answer: "GPU 显卡负责图形渲染和并行计算，核显够日常办公，独显适合游戏、3D 与 AI。", tags: ["显卡", "gpu", "硬件"] },
    { term: "快捷键", answer: "高频快捷键：Ctrl+C/V/X/Z/S/A/F、Alt+Tab 切换窗口、Win+E 资源管理器、Win+Shift+S 截图、Win+L 锁屏。", tags: ["快捷键", "效率"] },
    { term: "windows", answer: "Windows 界面由桌面、任务栏、开始菜单组成；设置用 Win+I，文件管理用 Win+E。", tags: ["windows", "系统"] },
    { term: "压缩包", answer: "zip 是通用压缩格式，Windows 原生支持；7z 压缩率更高。先查看再解压，警惕压缩包内的 exe。", tags: ["压缩包", "zip"] },
    { term: "浏览器", answer: "浏览器是访问网页的程序；搜索引擎是查找服务。Ctrl+T 新标签、Ctrl+Shift+T 恢复关闭、Ctrl+D 收藏。", tags: ["浏览器", "网址"] },
    { term: "dns", answer: "DNS 把域名解析成 IP 地址，像互联网的电话簿。报错 DNS_PROBE 时先查网络与 DNS。", tags: ["dns", "域名", "网络"] },
    { term: "word", answer: "Word 以样式驱动文档结构：用标题样式生成目录，Ctrl+S 保存，重要文件另存为版本。", tags: ["word", "office", "文档"] },
    { term: "excel", answer: "Excel 公式以 = 开头，SUM/AVERAGE/IF/VLOOKUP 最常用；数据规范比公式更重要。", tags: ["excel", "表格", "公式"] },
    { term: "ppt", answer: "PPT 一页一个观点，母版统一风格，F5 放映。演示的价值在结构而非动画。", tags: ["ppt", "演示"] },
    { term: "pdf", answer: "PDF 是跨设备保真的文档格式；提交作业、简历优先导出 PDF；敏感 PDF 可加密。", tags: ["pdf", "文档"] },
    { term: "买电脑", answer: "学生电脑先定需求再定预算：16GB 内存 + 512GB NVMe SSD 起步，屏幕看色域亮度，游戏/创作再看独显。", tags: ["买电脑", "选购", "预算"] },
    { term: "蓝屏", answer: "蓝屏是系统保护性停机，先记停止代码；依次查驱动、系统文件（sfc /scannow）、内存。", tags: ["蓝屏", "故障"] },
    { term: "黑屏", answer: "黑屏先看电源灯与风扇，外接屏排除屏幕故障；使用中黑屏按 Win+Ctrl+Shift+B 重置显卡驱动。", tags: ["黑屏", "故障"] },
    { term: "病毒", answer: "病毒木马多来自下载站与破解软件；Windows Defender 实时保护 + 系统更新 + 备份是最好的防线。", tags: ["病毒", "安全"] },
    { term: "ai", answer: "AI 大模型通过概率预测生成文本，会幻觉；好 Prompt = 角色+任务+上下文+要求，输出要人工验证。", tags: ["ai", "prompt", "大模型"] },
    { term: "chatgpt", answer: "ChatGPT 是通用 AI 助手，具体提问 + 追问迭代能显著提升质量；生成内容要审核，注意学术诚信。", tags: ["chatgpt", "ai"] },
    { term: "prompt", answer: "Prompt 提示词四要素：角色、任务、上下文、输出要求。给足背景和约束，AI 回答质量更高。", tags: ["prompt", "提示词", "ai"] },
    { term: "python", answer: "Python 是解释型语言：变量无需声明类型，input() 返回字符串，if/for/def 靠缩进组织代码。", tags: ["python", "编程"] },
    { term: "html", answer: "HTML 是网页结构语言：html/head/body 分层，标签成对出现，a 用 href、img 用 src。", tags: ["html", "网页"] },
    { term: "css", answer: "CSS 控制样式：选择器 + 声明；盒模型 content/padding/border/margin；Flexbox 做一维布局。", tags: ["css", "样式"] },
    { term: "javascript", answer: "JavaScript 让网页可交互：const 声明、DOM 选择、addEventListener 绑定事件。", tags: ["javascript", "js"] },
    { term: "git", answer: "Git 是版本控制工具：add 暂存、commit 快照、branch 分支、merge 合并；commit 信息要清晰。", tags: ["git", "版本控制"] },
    { term: "github", answer: "GitHub 是代码托管平台：push 上传、pull 拉取、PR 提交合并请求；GitHub Pages 可免费部署静态网页。", tags: ["github", "开源"] },
    { term: "防火墙", answer: "Windows 防火墙按网络类型过滤连接；公共网络建议开启，不要随意关闭。", tags: ["防火墙", "安全"] },
    { term: "云盘", answer: "云盘分网盘与同步盘；同步不等于备份，重要数据遵守 3-2-1 原则。", tags: ["云盘", "备份"] },
    { term: "wifi", answer: "WiFi 2.4GHz 穿墙好、5GHz 速度快；WiFi 6 提升多设备并发；大户型用 Mesh。", tags: ["wifi", "网络"] },
  ];
  return terms;
}
