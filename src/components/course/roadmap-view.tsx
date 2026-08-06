"use client";

import { motion } from "framer-motion";
import { ArrowRight, CircleDot, Flag } from "lucide-react";
import Link from "next/link";
import { modules } from "@/content";
import { useLearningStore } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { MermaidBlock } from "@/components/mermaid-block";
import { cn } from "@/lib/utils";

const chart = `graph LR
  A[认识电脑] --> B[Windows]
  B --> C[互联网]
  C --> D[Office]
  D --> E[电脑维护]
  E --> F[硬件深入]
  F --> G[大学软件]
  G --> H[买电脑]
  H --> I[故障处理]
  I --> J[AI 时代]
  J --> K[编程基础]
  K --> L[未来发展路线]`;

export function RoadmapView() {
  const completed = useLearningStore((s) => s.completedLessons);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div>
        <p className="text-sm font-semibold text-primary">学习路线</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">12 个模块，从开机到写代码</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          按推荐顺序学习：先建立硬件心智模型，再熟悉 Windows 与互联网，Office 用来产出，最后进入 AI 与编程。
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-card p-4">
        <MermaidBlock chart={chart} caption="推荐学习路线图" />
      </div>

      <div className="mt-10 space-y-4">
        {modules.map((m, i) => {
          const done = m.lessons.filter((l) => completed.includes(`${m.slug}/${l.slug}`)).length;
          const complete = done === m.lessons.length;
          const started = done > 0;
          return (
            <motion.div
              key={m.slug}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/courses/${m.slug}/`}
                className={cn(
                  "card-hover flex items-center gap-4 rounded-2xl border bg-card p-4",
                  complete && "border-emerald-500/40",
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white",
                    `bg-gradient-to-br ${m.accent}`,
                  )}
                >
                  {complete ? <Flag className="h-5 w-5" /> : <CircleDot className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{m.title}</p>
                    <Badge variant={complete ? "success" : started ? "info" : "outline"}>
                      {complete ? "已完成" : started ? "学习中" : "未开始"}
                    </Badge>
                    {m.draft && <Badge variant="warning">完善中</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {m.lessons.length} 节课 · {done}/{m.lessons.length}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
