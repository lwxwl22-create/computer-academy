"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CalendarPlus,
  Italic,
  Printer,
  Redo2,
  Undo2,
  Underline,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function WordSimulator() {
  const [text, setText] = useState("这是一篇课程报告。电脑的 CPU 是大脑，内存是工作台，硬盘是仓库。");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [history, setHistory] = useState<string[]>([
    "这是一篇课程报告。电脑的 CPU 是大脑，内存是工作台，硬盘是仓库。",
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  function updateText(next: string) {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(next);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setText(next);
  }

  function undo() {
    if (historyIndex <= 0) return;
    setHistoryIndex((i) => i - 1);
    setText(history[historyIndex - 1]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex((i) => i + 1);
    setText(history[historyIndex + 1]);
  }

  function insertDate() {
    const date = new Date().toLocaleDateString("zh-CN");
    updateText(text ? text + "\n\n（日期：2026 年 8 月 14 日）" : "（日期：2026 年 8 月 14 日）");
    void date;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-muted/50 p-2">
        <Button size="iconSm" variant={bold ? "default" : "ghost"} onClick={() => setBold((v) => !v)} title="加粗 Ctrl+B">
          <Bold className="h-4 w-4" />
        </Button>
        <Button size="iconSm" variant={italic ? "default" : "ghost"} onClick={() => setItalic((v) => !v)} title="斜体 Ctrl+I">
          <Italic className="h-4 w-4" />
        </Button>
        <Button size="iconSm" variant={underline ? "default" : "ghost"} onClick={() => setUnderline((v) => !v)} title="下划线 Ctrl+U">
          <Underline className="h-4 w-4" />
        </Button>
        <span className="mx-0.5 h-6 w-px bg-border" />
        <Button size="iconSm" variant={align === "left" ? "default" : "ghost"} onClick={() => setAlign("left")} title="左对齐">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button size="iconSm" variant={align === "center" ? "default" : "ghost"} onClick={() => setAlign("center")} title="居中">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button size="iconSm" variant={align === "right" ? "default" : "ghost"} onClick={() => setAlign("right")} title="右对齐">
          <AlignRight className="h-4 w-4" />
        </Button>
        <span className="mx-0.5 h-6 w-px bg-border" />
        <Button size="iconSm" variant="ghost" onClick={undo} disabled={historyIndex <= 0} title="撤销 Ctrl+Z">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button size="iconSm" variant="ghost" onClick={redo} disabled={historyIndex >= history.length - 1} title="重做">
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button size="iconSm" variant="ghost" onClick={insertDate} title="插入日期">
          <CalendarPlus className="h-4 w-4" />
        </Button>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="h-8 rounded-md border bg-background px-2 text-xs"
          title="字号"
        >
          {[12, 14, 16, 18, 20, 24].map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>
        <span className="ml-auto hidden text-[11px] text-muted-foreground sm:block">模拟 Word · Ctrl+S 保存</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => updateText(e.target.value)}
        className="min-h-[180px] w-full resize-y rounded-lg border bg-background p-4 leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
        style={{
          fontWeight: bold ? 700 : 400,
          fontStyle: italic ? "italic" : "normal",
          textDecoration: underline ? "underline" : "none",
          fontSize,
          textAlign: align,
        }}
      />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{text.length} 字</Badge>
        <span>样式应用到整段（真实 Word 中先选中文字再设置格式）。</span>
      </div>
    </div>
  );
}

function ExcelSimulator() {
  const rows = [
    { id: 1, name: "高数", score: 86 },
    { id: 2, name: "英语", score: 92 },
    { id: 3, name: "计算机", score: 78 },
    { id: 4, name: "体育", score: 88 },
  ];
  const [scores, setScores] = useState(rows);
  const [formula, setFormula] = useState("=AVERAGE(C2:C5)");
  const [result, setResult] = useState<number | string>(86);
  const [sortDir, setSortDir] = useState<"none" | "asc" | "desc">("none");
  const [filterHigh, setFilterHigh] = useState(false);

  const displayRows = scores
    .filter((r) => !filterHigh || r.score >= 80)
    .slice()
    .sort((a, b) => (sortDir === "asc" ? a.score - b.score : sortDir === "desc" ? b.score - a.score : a.id - b.id));

  function runFormula() {
    const f = formula.trim().toUpperCase();
    const values = scores.map((r) => r.score);
    if (f.startsWith("=SUM(")) {
      setResult(values.reduce((a, b) => a + b, 0));
    } else if (f.startsWith("=AVERAGE(")) {
      setResult(Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10);
    } else if (f.startsWith("=MAX(")) {
      setResult(Math.max(...values));
    } else if (f.startsWith("=MIN(")) {
      setResult(Math.min(...values));
    } else if (f.startsWith("=COUNT(")) {
      setResult(values.length);
    } else if (/^=IF\(/.test(f)) {
      const condition = f.match(/IF\((.+?),/i)?.[1] ?? "";
      const yes = f.match(/,\s*"([^"]+)"\s*,/)?.[1] ?? "是";
      const no = f.match(/,\s*"([^"]+)"\s*\)$/)?.[1] ?? "否";
      const [left, op, right] = condition.replace(/C\d:C\d/g, String(values[0])).match(/(.+?)(>=|<=|>|<|=)(.+)/)?.slice(1) ?? [];
      const l = Number(left);
      const r = Number(right);
      const ok =
        op === ">=" ? l >= r : op === "<=" ? l <= r : op === ">" ? l > r : op === "<" ? l < r : l === r;
      setResult(ok ? yes : no);
    } else {
      setResult("公式暂不支持，试试 SUM/AVERAGE/MAX/MIN/IF");
    }
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border">
        <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 p-2">
          <Button size="sm" variant={sortDir === "asc" ? "default" : "outline"} onClick={() => setSortDir(sortDir === "asc" ? "none" : "asc")}>
            成绩升序
          </Button>
          <Button size="sm" variant={sortDir === "desc" ? "default" : "outline"} onClick={() => setSortDir(sortDir === "desc" ? "none" : "desc")}>
            成绩降序
          </Button>
          <Button size="sm" variant={filterHigh ? "default" : "outline"} onClick={() => setFilterHigh((v) => !v)}>
            只显示 ≥80
          </Button>
          <span className="ml-auto text-[11px] text-muted-foreground">数据 → 排序和筛选</span>
        </div>
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              {["A 学号", "B 课程", "C 成绩", "D 等级"].map((h) => (
                <th key={h} className="border px-3 py-2 text-left text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((r) => (
              <tr key={r.id}>
                <td className="border px-3 py-1.5 text-muted-foreground">{r.id}</td>
                <td className="border px-3 py-1.5">{r.name}</td>
                <td className="border px-3 py-1.5">
                  <Input
                    type="number"
                    value={r.score}
                    className="h-8 w-20"
                    onChange={(e) =>
                      setScores((rs) =>
                        rs.map((x) => (x.id === r.id ? { ...x, score: Number(e.target.value) } : x)),
                      )
                    }
                  />
                </td>
                <td className="border px-3 py-1.5">{r.score >= 60 ? "及格" : "不及格"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
        <span className="text-xs text-muted-foreground">D8 单元格：</span>
        <Input value={formula} onChange={(e) => setFormula(e.target.value)} className="h-8 w-56 font-mono text-xs" />
        <Button size="sm" onClick={runFormula}>计算结果</Button>
        <Badge variant="success" className="font-mono">{result}</Badge>
        <span className="w-full text-[11px] text-muted-foreground">
          真实 Excel：选中单元格输入 =SUM(C2:C5) 回车，数据变化结果自动更新。
        </span>
      </div>
    </div>
  );
}

function PptSimulator() {
  const slides = [
    { id: 1, title: "封面：电脑入门", color: "from-sky-500 to-indigo-500" },
    { id: 2, title: "电脑是什么", color: "from-indigo-500 to-violet-500" },
    { id: 3, title: "CPU 与内存", color: "from-violet-500 to-fuchsia-500" },
    { id: 4, title: "总结与练习", color: "from-fuchsia-500 to-pink-500" },
  ];
  const [order, setOrder] = useState(slides);
  const [selected, setSelected] = useState<number | null>(null);
  const [theme, setTheme] = useState("from-sky-500 to-indigo-500");

  const themes = [
    { id: "from-sky-500 to-indigo-500", name: "科技蓝" },
    { id: "from-violet-500 to-fuchsia-500", name: "霓虹紫" },
    { id: "from-amber-500 to-orange-500", name: "暖橙" },
    { id: "from-emerald-500 to-teal-500", name: "薄荷绿" },
  ];

  function move(delta: number) {
    if (selected === null) return;
    const idx = order.findIndex((s) => s.id === selected);
    const target = idx + delta;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    setOrder(next);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                theme === t.id ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-accent",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
        {order.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all",
              selected === s.id ? "border-primary bg-primary/10" : "border-border hover:bg-accent/50",
            )}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-muted text-xs font-medium">{i + 1}</span>
            <span className="truncate">{s.title}</span>
            {selected === s.id && <Badge className="ml-auto">已选中</Badge>}
          </button>
        ))}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => move(-1)} disabled={selected === null}>上移</Button>
          <Button size="sm" variant="outline" onClick={() => move(1)} disabled={selected === null}>下移</Button>
        </div>
        <p className="text-xs text-muted-foreground">选中幻灯片后点击上移/下移调整顺序（真实 PPT 用拖拽排序）。</p>
      </div>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="h-full w-full rounded-lg bg-gradient-to-br from-white to-slate-100 p-6 text-slate-900 shadow-2xl">
          <div className={cn("inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white", theme)}>
            Computer Academy
          </div>
          <p className="mt-6 text-lg font-bold">{order[0]?.title}</p>
          <div className={cn("mt-4 h-2 w-24 rounded bg-gradient-to-r opacity-70", theme)} />
          <div className={cn("mt-2 h-2 w-32 rounded bg-gradient-to-r opacity-40", theme)} />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">模拟演示视图</div>
        </div>
      </div>
    </div>
  );
}

function PdfSimulator() {
  const [name, setName] = useState("张三");
  const [major, setMajor] = useState("计算机科学");
  const [signed, setSigned] = useState(false);
  const [duplex, setDuplex] = useState(false);
  const [fitPage, setFitPage] = useState(false);
  const [copies, setCopies] = useState(1);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">姓名</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">专业</label>
          <Input value={major} onChange={(e) => setMajor(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} className="h-4 w-4" />
          电子签名（模拟）
        </label>
        <Button size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> 打印 / 另存为 PDF
        </Button>
        <div className="rounded-lg border bg-muted/40 p-3 text-xs">
          <p className="mb-2 font-medium text-foreground">打印设置</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">份数</span>
            <div className="flex items-center gap-1">
              <Button size="iconSm" variant="outline" onClick={() => setCopies((c) => Math.max(1, c - 1))}>-</Button>
              <span className="w-6 text-center">{copies}</span>
              <Button size="iconSm" variant="outline" onClick={() => setCopies((c) => Math.min(9, c + 1))}>+</Button>
            </div>
          </div>
          <label className="mt-2 flex items-center justify-between gap-2">
            <span className="text-muted-foreground">双面（长边翻转）</span>
            <input type="checkbox" checked={duplex} onChange={(e) => setDuplex(e.target.checked)} className="h-4 w-4" />
          </label>
          <label className="mt-2 flex items-center justify-between gap-2">
            <span className="text-muted-foreground">适合页面（防表格切边）</span>
            <input type="checkbox" checked={fitPage} onChange={(e) => setFitPage(e.target.checked)} className="h-4 w-4" />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          真实操作：Word/浏览器里 Ctrl+P → 目标打印机选「Microsoft Print to PDF」→ 保存。
        </p>
      </div>
      <div className="relative aspect-[3/4] max-h-[360px] rounded-lg border bg-white p-6 text-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-sm font-bold">选课登记表</span>
          <span className="text-[10px] text-slate-400">Computer Academy</span>
        </div>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex gap-2">
            <span className="w-14 text-slate-500">姓名</span>
            <span>{name || "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-14 text-slate-500">专业</span>
            <span>{major || "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-14 text-slate-500">课程</span>
            <span>电脑基础与 AI 入门</span>
          </div>
        </div>
        <div className="absolute bottom-16 left-6 right-6 border-t border-dashed pt-3 text-right">
          {signed ? (
            <span className="font-serif text-2xl italic" style={{ fontFamily: "cursive" }}>{name}</span>
          ) : (
            <span className="text-xs text-slate-300">签名区域</span>
          )}
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between text-[10px] text-slate-400">
          <span>PDF 模拟</span>
          <span>
            {copies} 份 · {duplex ? "双面" : "单面"} · {fitPage ? "适合页面" : "实际大小"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OfficeSimulator({ kind }: { kind: string }) {
  const content = useMemo(() => {
    if (kind === "excel") return <ExcelSimulator />;
    if (kind === "powerpoint") return <PptSimulator />;
    if (kind === "pdf") return <PdfSimulator />;
    return <WordSimulator />;
  }, [kind]);

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">{content}</CardContent>
    </Card>
  );
}
