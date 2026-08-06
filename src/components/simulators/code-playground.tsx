"use client";

import { Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const starters = {
  python: `# 欢迎来到 Python 练习场
name = "同学"
score = 88
if score >= 60:
    print(f"{name} 及格了！")
else:
    print("还需要努力")
for i in range(3):
    print("学习第", i + 1, "次")`,
  html: `<!-- 网页三件套练习 -->
<h1 style="color:#4f46e5">你好，电脑学院</h1>
<p>这是 <strong>HTML</strong> 输出预览。</p>
<button onclick="this.textContent='点击成功！'">点我</button>`,
};

function runPython(code: string): string {
  const lines = code.split("\n");
  const output: string[] = [];
  const vars: Record<string, string | number | boolean> = {};
  const indent = (s: string) => s.match(/^\s*/)?.[0].length ?? 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const text = line.trim();
    if (!text || text.startsWith("#")) {
      i++;
      continue;
    }
    const printMatch = text.match(/^print\(f?"?(.+?)"?\)$/);
    if (printMatch) {
      const inner = printMatch[1];
      const expr = inner
        .replace(/\{([a-zA-Z_]\w*)\}/g, (_m, name) => String(vars[name] ?? ""))
        .replace(/\{([a-zA-Z_]\w*)\}/g, (_m, name) => String(vars[name] ?? ""));
      const parts = expr.split(/["']\s*,\s*["']/);
      output.push(parts.map((p) => p.replace(/^["']|["']$/g, "")).join(" "));
      i++;
      continue;
    }
    const ifMatch = text.match(/^if (.+):$/);
    const elifMatch = text.match(/^elif (.+):$/);
    if (ifMatch || elifMatch) {
      const cond = (ifMatch?.[1] ?? elifMatch?.[1] ?? "").replace(/\b(\w+)\b/g, (m) =>
        m in vars ? String(vars[m]) : m,
      );
      const ok = evalSafe(cond);
      const currentIndent = indent(line);
      const block = [];
      let j = i + 1;
      while (j < lines.length && indent(lines[j]) > currentIndent) {
        block.push(lines[j]);
        j++;
      }
      if (ok) {
        lines.splice(i + 1, block.length, ...block.map((b) => b.replace(/^\s{2}/, "")));
      } else {
        lines.splice(i + 1, block.length);
      }
      i++;
      continue;
    }
    const forMatch = text.match(/^for (\w+) in range\((\d+)\):$/);
    if (forMatch) {
      const name = forMatch[1];
      const count = Number(forMatch[2]);
      const currentIndent = indent(line);
      const block = [];
      let j = i + 1;
      while (j < lines.length && indent(lines[j]) > currentIndent) {
        block.push(lines[j]);
        j++;
      }
      for (let n = 0; n < count; n++) {
        vars[name] = n;
        const body = block.map((b) => b.replace(/^\s{2}/, "")).join("\n");
        lines.splice(i + 1, block.length, ...body.split("\n"));
        i = i; // restart loop over inserted lines
        break;
      }
      // naive: run body once with final var and simulate iterations
      for (let n = 0; n < count; n++) {
        vars[name] = n;
        for (const b of block) {
          const body = b.replace(/^\s{2}/, "");
          const pm = body.match(/^print\(f?"?(.+?)"?\)$/);
          if (pm) {
            const inner = pm[1].replace(/\{([a-zA-Z_]\w*)\}/g, (_m, nm) => String(vars[nm] ?? ""));
            output.push(inner.replace(/^["']|["']$/g, ""));
          }
        }
      }
      i = j;
      continue;
    }
    const assign = text.match(/^(\w+)\s*=\s*(.+)$/);
    if (assign) {
      const val = evalSafe(assign[2].replace(/\b(\w+)\b/g, (m) => (m in vars ? String(vars[m]) : m)));
      vars[assign[1]] = val;
      i++;
      continue;
    }
    output.push(`[未支持] ${text}`);
    i++;
  }
  return output.length ? output.join("\n") : "（无输出）";
}

function evalSafe(expr: string): string | number | boolean {
  const cleaned = expr.replace(/["']/g, "");
  if (/^\d+$/.test(cleaned)) return Number(cleaned);
  if (/^\d+ *[+\-*/] *\d+$/.test(cleaned)) {
    try {
      return Function(`"use strict"; return (${cleaned});`)() as number;
    } catch {
      return cleaned;
    }
  }
  if (cleaned.includes(">=")) {
    const [a, b] = cleaned.split(">=");
    return Number(a) >= Number(b);
  }
  if (cleaned.includes("<=")) {
    const [a, b] = cleaned.split("<=");
    return Number(a) <= Number(b);
  }
  if (cleaned.includes(">")) {
    const [a, b] = cleaned.split(">");
    return Number(a) > Number(b);
  }
  if (cleaned.includes("<")) {
    const [a, b] = cleaned.split("<");
    return Number(a) < Number(b);
  }
  if (cleaned.includes("==")) {
    const [a, b] = cleaned.split("==");
    return String(a).trim() === String(b).trim();
  }
  return cleaned;
}

export function CodePlayground({ kind }: { kind: string }) {
  const [lang, setLang] = useState<"python" | "html">(kind === "html" ? "html" : "python");
  const [code, setCode] = useState(starters[lang]);
  const [output, setOutput] = useState("");
  const [ran, setRan] = useState(false);

  const preview = useMemo(() => code, [code]);

  function run() {
    if (lang === "python") {
      try {
        setOutput(runPython(code));
      } catch (e) {
        setOutput("运行出错：" + String(e));
      }
    } else {
      setOutput("");
    }
    setRan(true);
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border p-0.5">
            {(["python", "html"] as const).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setCode(starters[l]);
                  setRan(false);
                  setOutput("");
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {l === "python" ? "Python" : "HTML"}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={run}>
            <Play className="h-3.5 w-3.5" /> 运行
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setCode(starters[lang]);
              setOutput("");
              setRan(false);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> 重置
          </Button>
          <Badge variant="outline">{lang === "python" ? "迷你解释器" : "iframe 预览"}</Badge>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[260px] w-full resize-y rounded-lg border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {lang === "python" ? (
            <pre className="min-h-[260px] whitespace-pre-wrap rounded-lg border bg-muted/50 p-4 font-mono text-sm leading-relaxed">
              {ran ? output : "点击「运行」查看输出"}
            </pre>
          ) : (
            <iframe
              title="HTML 预览"
              sandbox="allow-scripts"
              srcDoc={`<!doctype html><html><body style="font-family:system-ui;padding:16px">${preview}</body></html>`}
              className="min-h-[260px] w-full rounded-lg border bg-white"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Python 是简化版解释器（支持 print、变量、if、for range）；HTML 用安全沙箱实时预览。
        </p>
      </CardContent>
    </Card>
  );
}

function cn(...args: (string | false | undefined)[]) {
  return args.filter(Boolean).join(" ");
}
