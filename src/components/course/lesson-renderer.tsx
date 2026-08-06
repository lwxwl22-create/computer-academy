"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Info,
  Lightbulb,
  ListChecks,
  Target,
  Timer,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CourseModule, Lesson } from "@/lib/schema";
import { useLessonComplete, useLearningStore } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MermaidBlock } from "@/components/mermaid-block";
import { HardwareLab } from "@/components/simulators/hardware-lab";
import { WindowsSimulator } from "@/components/simulators/windows-simulator";
import { OfficeSimulator } from "@/components/simulators/office-simulators";
import { ConfigBuilder } from "@/components/simulators/config-builder";
import { PromptCoach } from "@/components/simulators/prompt-coach";
import { CodePlayground } from "@/components/simulators/code-playground";
import { QuizRunner } from "@/components/course/quiz-runner";
import { NoteEditor } from "@/components/course/note-editor";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMinutes, cn } from "@/lib/utils";
import { levelProgress } from "@/lib/gamification";

function SimulatorSlot({ kind }: { kind: string }) {
  if (["cpu", "memory", "ssd", "gpu", "motherboard"].includes(kind)) {
    return <HardwareLab kind={kind} />;
  }
  if (["windows-desktop", "shortcuts", "file-manager"].includes(kind)) {
    return <WindowsSimulator kind={kind} />;
  }
  if (["word", "excel", "powerpoint", "pdf"].includes(kind)) {
    return <OfficeSimulator kind={kind} />;
  }
  if (kind === "config-builder") return <ConfigBuilder />;
  if (kind === "prompt-coach") return <PromptCoach />;
  if (kind === "python" || kind === "html") return <CodePlayground kind={kind} />;
  return null;
}

function Callout({ variant, title, text }: { variant: "info" | "tip" | "warning"; title?: string; text: string }) {
  const map = {
    info: { icon: Info, cls: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300" },
    tip: { icon: Lightbulb, cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
    warning: { icon: AlertTriangle, cls: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  }[variant];
  const Icon = map.icon;
  return (
    <div className={cn("my-4 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed", map.cls)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <p>{text}</p>
      </div>
    </div>
  );
}

function ContentBlockRenderer({ block }: { block: Lesson["content"][number] }) {
  switch (block.type) {
    case "paragraph":
      return <p className="my-4 text-[15px] leading-8 text-foreground/90">{block.text}</p>;
    case "heading":
      return <h2 className="mt-8 mb-2 text-xl font-bold tracking-tight">{block.text}</h2>;
    case "list":
      return block.ordered ? (
        <ol className="my-4 list-decimal space-y-2 pl-6 text-[15px] leading-7">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] leading-7 marker:text-primary">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout variant={block.variant} title={block.title} text={block.text} />;
    case "card":
      return (
        <Card className="my-4 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              {block.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">{block.text}</CardContent>
        </Card>
      );
    case "analogy":
      return (
        <div className="my-4 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-background to-transparent p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Brain className="h-4 w-4 text-primary" /> {block.title}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{block.text}</p>
        </div>
      );
    case "code":
      return (
        <div className="my-4 overflow-hidden rounded-xl border bg-slate-950">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="font-mono text-xs text-slate-400">{block.language}</span>
            {block.caption && <span className="text-xs text-slate-400">{block.caption}</span>}
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-100">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "mermaid":
      return <MermaidBlock chart={block.chart} caption={block.caption} />;
    case "simulator":
      return (
        <div className="my-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ListChecks className="h-4 w-4" />
            </span>
            {block.title}
          </p>
          {block.description && <p className="mb-3 text-sm text-muted-foreground">{block.description}</p>}
          <SimulatorSlot kind={block.kind} />
        </div>
      );
  }
}

export function LessonRenderer({
  module: mod,
  lesson,
  prevLesson,
  nextLesson,
}: {
  module: CourseModule;
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}) {
  const hydrated = useHydrated();
  const completed = useLessonComplete(`${mod.slug}/${lesson.slug}`);
  const completeLesson = useLearningStore((s) => s.markLessonComplete);
  const xp = useLearningStore((s) => s.xp);
  const [done, setDone] = useState(false);

  const { level } = levelProgress(xp);

  function handleComplete() {
    completeLesson(`${mod.slug}/${lesson.slug}`, lesson.durationMinutes);
    setDone(true);
    toast.success(`完成《${lesson.title}》，+50 XP`, { description: `当前 Lv.${level + (levelProgress(xp).progress > 0.9 ? 1 : 0)}` });
  }

  const lessonKey = `${mod.slug}/${lesson.slug}`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href={`/courses/${mod.slug}/`} className="hover:text-foreground">{mod.title}</Link>
          <span>/</span>
          <span className="text-foreground">{lesson.title}</span>
          {lesson.draft && <Badge variant="warning">完善中</Badge>}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
        {lesson.subtitle && <p className="mt-2 text-muted-foreground">{lesson.subtitle}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary"><Timer className="mr-1 h-3 w-3" />{formatMinutes(lesson.durationMinutes)}</Badge>
          <Badge variant="outline">{lesson.difficulty}</Badge>
          {lesson.prerequisites && <Badge variant="info">前置：{lesson.prerequisites}</Badge>}
          {lesson.tags.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="mt-6 rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-4 sm:p-5"
      >
        <p className="flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4 text-primary" /> 学习目标</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {lesson.goals.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-6">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
              {g}
            </li>
          ))}
        </ul>
      </motion.section>

      <article className="mt-2">
        {lesson.content.map((block, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(0.08, i * 0.02) }}
          >
            <ContentBlockRenderer block={block} />
          </motion.div>
        ))}
      </article>

      <Separator className="my-8" />

      <section className="space-y-6">
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Lightbulb className="h-5 w-5 text-amber-500" /> 重点总结
          </h2>
          <ul className="space-y-2">
            {lesson.summary.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm leading-7">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" /> {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <XCircle className="h-5 w-5 text-rose-500" /> 常见错误
          </h2>
          <ul className="space-y-2">
            {lesson.mistakes.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm leading-7 text-muted-foreground">
                <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-500" /> {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Brain className="h-5 w-5 text-primary" /> 思考题
          </h2>
          <ul className="space-y-2">
            {lesson.thinking.map((s, i) => (
              <li key={i} className="rounded-xl border bg-muted/30 p-3 text-sm leading-7">{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <ListChecks className="h-5 w-5 text-primary" /> 练习
          </h2>
          <ol className="space-y-2">
            {lesson.exercises.map((e, i) => (
              <li key={i} className="rounded-xl border p-3 text-sm leading-7">
                <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                {e.prompt}
                {e.hint && <p className="mt-1 pl-8 text-xs text-muted-foreground">提示：{e.hint}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Separator className="my-8" />

      <QuizRunner moduleSlug={mod.slug} lessonId={`${mod.slug}/${lesson.slug}`} questions={lesson.quiz} />

      <NoteEditor lessonId={lessonKey} lessonTitle={lesson.title} />

      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {completed || done ? "这一课已经完成，继续保持！" : `完成本课可获得 50 XP，同时记录学习时长。`}
        </p>
        <Button size="lg" onClick={handleComplete} disabled={completed || done}>
          <CheckCircle2 className="h-5 w-5" />
          {completed || done ? "已完成" : "完成课程"}
        </Button>
        {hydrated && <Progress value={(completed || done) ? 100 : 0} className="max-w-xs" />}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {prevLesson ? (
          <Link
            href={`/courses/${mod.slug}/${prevLesson.slug}/`}
            className="card-hover flex items-center gap-3 rounded-xl border p-4 text-sm"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">上一课</p>
              <p className="truncate font-medium">{prevLesson.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/courses/${mod.slug}/${nextLesson.slug}/`}
            className="card-hover flex items-center justify-end gap-3 rounded-xl border p-4 text-sm"
          >
            <div className="min-w-0 text-right">
              <p className="text-xs text-muted-foreground">下一课</p>
              <p className="truncate font-medium">{nextLesson.title}</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
          </Link>
        ) : (
          <Link
            href={`/courses/${mod.slug}/`}
            className="card-hover flex items-center justify-end gap-3 rounded-xl border p-4 text-sm"
          >
            <div className="text-right">
              <p className="text-xs text-muted-foreground">模块完成</p>
              <p className="font-medium">返回模块</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
          </Link>
        )}
      </div>
    </div>
  );
}
