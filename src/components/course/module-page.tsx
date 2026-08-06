"use client";

import { ArrowLeft, Clock, Info } from "lucide-react";
import Link from "next/link";
import { CourseModule } from "@/lib/schema";
import { useLearningStore } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LessonRow } from "@/components/course/course-cards";
import { Icon } from "@/components/icon";
import { formatMinutes } from "@/lib/utils";

export function ModulePage({ mod }: { mod: CourseModule }) {
  const completed = useLearningStore((s) => s.completedLessons);
  const ids = mod.lessons.map((l) => `${mod.slug}/${l.slug}`);
  const done = ids.filter((id) => completed.includes(id)).length;
  const percent = done / ids.length;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link href="/courses/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> 课程库
      </Link>

      <div className="relative mt-5 overflow-hidden rounded-2xl border p-6 sm:p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${mod.accent} opacity-15`} />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${mod.accent} text-white shadow-lg`}>
              <Icon name={mod.icon} className="h-7 w-7" />
            </span>
            <div className="flex flex-wrap justify-end gap-1.5">
              <Badge variant="secondary">{mod.difficulty}</Badge>
              {mod.draft && <Badge variant="warning">内容完善中</Badge>}
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-muted-foreground">模块 {String(mod.order).padStart(2, "0")}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{mod.title}</h1>
          <p className="mt-1 text-muted-foreground">{mod.subtitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/85">{mod.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 预计 {formatMinutes(mod.estimatedMinutes)}</span>
            <span>{mod.lessons.length} 节课</span>
            <span>{done}/{ids.length} 已完成</span>
          </div>
          <Progress value={percent * 100} className="mt-4" />
        </div>
      </div>

      {mod.draft && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-6 text-amber-700 dark:text-amber-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          本模块为结构化初版内容：目标、知识点、练习和测验均已可用，正文深度会持续完善。
        </div>
      )}

      <div className="mt-6 space-y-2">
        {mod.lessons.map((lesson, i) => (
          <LessonRow key={lesson.slug} module={mod} lesson={lesson} index={i} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href={mod.lessons[0] ? `/courses/${mod.slug}/${mod.lessons[0].slug}/` : "/courses/"}>
          <Button size="lg">开始本模块</Button>
        </Link>
      </div>
    </div>
  );
}
