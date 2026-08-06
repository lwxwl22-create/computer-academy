"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ScoreLine {
  label: string;
  score: number;
  tip: string;
}

function scorePrompt(input: string): { total: number; lines: ScoreLine[] } {
  const text = input.trim();
  const hasRole = /你是|扮演|作为|act as|你是.*老师|你是.*教练/i.test(text);
  const hasTask = /(解释|写|生成|总结|翻译|分析|列出|制定|推荐|告诉我|讲).{2,}/i.test(text);
  const hasContext = /(我的|我目前|背景|上下文|前提|针对|面对|大一大二|零基础|电脑).{2,}/i.test(text);
  const hasConstraint = /(不超过|字数|格式|用.*例子|不要|风格|语言|表格|分点|500|1000|中文)/i.test(text);
  const lines: ScoreLine[] = [
    {
      label: "角色设定",
      score: hasRole ? 25 : 8,
      tip: hasRole ? "有清晰角色，回答角度更专业。" : "建议加「你是××老师/教练」来限定视角。",
    },
    {
      label: "任务明确",
      score: hasTask ? 30 : 10,
      tip: hasTask ? "任务动词清楚，AI 知道要做什么。" : "用「解释/总结/翻译/列出」这类动词明确任务。",
    },
    {
      label: "背景信息",
      score: hasContext ? 25 : 8,
      tip: hasContext ? "提供了背景，回答能贴合你的水平。" : "补充你的基础（如零基础）与使用场景。",
    },
    {
      label: "输出约束",
      score: hasConstraint ? 20 : 6,
      tip: hasConstraint ? "限定了格式或长度，结果更可控。" : "加「不超过 300 字」「用表格」等约束。",
    },
  ];
  const total = lines.reduce((s, l) => s + l.score, 0);
  return { total, lines };
}

const demos = [
  "你是零基础电脑老师，用生活类比解释什么是 CPU，不超过 200 字。",
  "帮我把这段笔记整理成表格：内存是临时工作台，硬盘是仓库。",
  "你是 Excel 助教，我的成绩表在 C 列，教我写一个求平均分的公式。",
];

export function PromptCoach() {
  const [prompt, setPrompt] = useState("");
  const [sent, setSent] = useState<{ prompt: string; reply: string }[]>([]);

  const result = useMemo(() => scorePrompt(prompt), [prompt]);

  function send() {
    if (!prompt.trim()) return;
    const reply =
      result.total >= 85
        ? "这个提示词很完整：角色、任务、背景、约束都有了，AI 会给出精准回答。"
        : result.total >= 60
          ? "提示词基本可用，试着补充输出约束或背景，回答会更贴合需求。"
          : "提示词还比较模糊。试试「你是××角色 + 帮我做××任务 + 我的背景是×× + 要求××」。";
    setSent((s) => [{ prompt, reply }, ...s].slice(0, 4));
    setPrompt("");
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {demos.map((d) => (
            <button
              key={d}
              onClick={() => setPrompt(d)}
              className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
            >
              示例
            </button>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="在这里输入你的 Prompt，例如：你是电脑老师，向我解释内存和硬盘的区别，不超过 150 字……"
              className="min-h-[140px]"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">实时评分：{prompt.trim() ? result.total : 0} / 100</span>
              <Button size="sm" onClick={send} disabled={!prompt.trim()}>
                <Send className="h-3.5 w-3.5" /> 发送
              </Button>
            </div>
            <div className="space-y-1.5">
              {result.lines.map((line) => (
                <div key={line.label} className="rounded-lg border bg-muted/40 p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{line.label}</span>
                    <Badge variant={line.score >= 20 ? "success" : "warning"}>{line.score}</Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground">{line.tip}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-primary" /> AI 模拟回复
            </p>
            {sent.length === 0 ? (
              <div className="grid h-[180px] place-items-center rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                <div>
                  <Sparkles className="mx-auto mb-2 h-6 w-6 opacity-50" />
                  发送后在这里看到模拟 AI 反馈
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {sent.map((s, i) => (
                    <motion.div
                      key={s.prompt + i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("rounded-xl border p-3 text-xs", i === 0 ? "border-primary/40 bg-primary/5" : "bg-muted/30")}
                    >
                      <p className="font-medium text-foreground">{s.prompt}</p>
                      <p className="mt-1.5 leading-relaxed text-muted-foreground">{s.reply}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
