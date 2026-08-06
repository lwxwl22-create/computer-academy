"use client";

import { CheckCircle2, Circle, Clock, PlayCircle, Star } from "lucide-react";
import Link from "next/link";
import { CourseModule, Lesson } from "@/lib/schema";
import { useLearningStore } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icon";
import { cn, formatMinutes } from "@/lib/utils";

export function lessonStatus(completed: string[], started: string[], id: string) {
  if (completed.includes(id)) return "已完成";
  if (started.includes(id)) return "学习中";
  return "未开始";
}

export function ModuleCard({ module: m }: { module: CourseModule }) {
  const completed = useLearningStore((s) => s.completedLessons);
  const ids = m.lessons.map((l) => `${m.slug}/${l.slug}`);
  const done = ids.filter((id) => completed.includes(id)).length;
  const percent = done / ids.length;

  return (
    <Link href={`/courses/${m.slug}/`} className="card-hover block h-full">
      <Card className="h-full overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <span className={cn("grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow", m.accent)}>
              <Icon name={m.icon} className="h-5 w-5" />
            </span>
            <Badge variant={percent === 1 ? "success" : done > 0 ? "info" : "outline"}>
              {percent === 1 ? "已完成" : done > 0 ? "学习中" : "未开始"}
            </Badge>
          </div>
          <h3 className="mt-4 text-lg font-bold">{m.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{m.lessons.length} 节课</Badge>
            <Badge variant="outline">{m.difficulty}</Badge>
            {m.draft && <Badge variant="warning">完善中</Badge>}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {formatMinutes(m.estimatedMinutes)}
          </div>
          <Progress value={percent * 100} className="mt-3" />
          <p className="mt-1.5 text-right text-xs text-muted-foreground">{done}/{ids.length} 已完成</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function LessonRow({ module: m, lesson, index }: { module: CourseModule; lesson: Lesson; index: number }) {
  const completed = useLearningStore((s) => s.completedLessons);
  const started = useLearningStore((s) => s.startedLessons);
  const favorites = useLearningStore((s) => s.favorites);
  const toggleFavorite = useLearningStore((s) => s.toggleFavorite);
  const id = `${m.slug}/${lesson.slug}`;
  const status = lessonStatus(completed, started, id);
  const fav = favorites.includes(id);

  return (
    <Link href={`/courses/${m.slug}/${lesson.slug}/`} className="card-hover block">
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
        <span className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold",
          status === "已完成" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
          status === "学习中" ? "bg-sky-500/15 text-sky-600 dark:text-sky-400" :
          "bg-muted text-muted-foreground",
        )}>
          {status === "已完成" ? <CheckCircle2 className="h-4.5 w-4.5" /> : status === "学习中" ? <PlayCircle className="h-4.5 w-4.5" /> : <Circle className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <p className="truncate text-sm font-semibold">{lesson.title}</p>
            {lesson.draft && <Badge variant="warning" className="shrink-0">完善中</Badge>}
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {formatMinutes(lesson.durationMinutes)} · {lesson.difficulty}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(id);
          }}
          className={cn("shrink-0 rounded-md p-1.5 transition-colors", fav ? "text-amber-500" : "text-muted-foreground hover:text-amber-500")}
          aria-label={fav ? "取消收藏" : "收藏"}
        >
          <Star className={cn("h-4 w-4", fav && "fill-amber-500")} />
        </button>
      </div>
    </Link>
  );
}
