"use client";

import { motion } from "framer-motion";
import { Award, Flame, Lock, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { badgeProgress, levelProgress } from "@/lib/gamification";
import { modules } from "@/content";
import { useLearningStore, useStreak } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icon";

export function XpLevelCard() {
  const xp = useLearningStore((s) => s.xp);
  const streak = useStreak();
  const completed = useLearningStore((s) => s.completedLessons.length);
  const { level, nextBase, progress } = levelProgress(xp);

  return (
    <Card className="overflow-hidden">
      <CardContent className="bg-gradient-to-br from-primary/15 via-background to-background p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">当前等级</p>
            <p className="mt-1 flex items-center gap-2 text-3xl font-bold">
              Lv.{level}
              <Sparkles className="h-5 w-5 text-amber-400" />
            </p>
          </div>
          <Badge variant="secondary" className="gap-1 py-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-500" /> 连续 {streak} 天
          </Badge>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{xp} XP</span>
            <span>下一级 {nextBase} XP</span>
          </div>
          <Progress value={progress * 100} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          已完成 {completed} 节课 · 完成课程、测验、每日任务都能获得 XP
        </p>
      </CardContent>
    </Card>
  );
}

export function BadgeWall() {
  const xp = useLearningStore((s) => s.xp);
  const completedLessons = useLearningStore((s) => s.completedLessons);
  const completed = completedLessons.length;
  const streak = useStreak();
  const modulesCompleted = useMemo(() => {
    return modules.filter((m) => m.lessons.every((l) => completedLessons.includes(`${m.slug}/${l.slug}`))).length;
  }, [completedLessons]);
  const badges = badgeProgress(xp, completed, streak, modulesCompleted);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((b) => (
        <Card key={b.id} className={cn("card-hover", !b.unlocked && "opacity-60")}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  b.unlocked ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-muted text-muted-foreground",
                )}
              >
                {b.unlocked ? <Icon name={b.icon} className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </span>
              <Badge variant={b.unlocked ? "success" : "outline"}>{b.unlocked ? "已解锁" : `${Math.round(Math.min(1, b.value) * 100)}%`}</Badge>
            </div>
            <p className="mt-3 text-sm font-semibold">{b.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{b.description}</p>
            <Progress value={Math.min(100, b.value * 100)} className="mt-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SkillTree() {
  const completed = useLearningStore((s) => s.completedLessons);

  return (
    <div className="relative space-y-5 before:absolute before:inset-y-0 before:left-4 before:hidden before:w-px before:bg-border sm:before:block lg:before:left-1/2">
      {modules.map((m, i) => {
        const done = m.lessons.filter((l) => completed.includes(`${m.slug}/${l.slug}`)).length;
        const unlocked = i === 0 || modules[i - 1].lessons.some((l) => completed.includes(`${modules[i - 1].slug}/${l.slug}`)) || done > 0;
        const complete = done === m.lessons.length;
        return (
          <motion.div
            key={m.slug}
            initial={{ opacity: 0, x: i % 2 ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              "relative rounded-2xl border bg-card p-4 sm:ml-12 lg:ml-0 lg:w-[calc(50%-28px)]",
              i % 2 === 1 && "lg:ml-auto",
              complete && "border-emerald-500/40 bg-emerald-500/5",
              !unlocked && "opacity-55",
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", `bg-gradient-to-br ${m.accent} text-white`)}>
                <Icon name={m.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{m.title}</p>
                  {complete && <Trophy className="h-4 w-4 shrink-0 text-amber-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{done}/{m.lessons.length} 节课</p>
              </div>
              {!unlocked && <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />}
            </div>
            <Progress value={(done / m.lessons.length) * 100} className="mt-3" />
            <Link href={`/courses/${m.slug}/`} className="mt-3 block text-xs font-medium text-primary hover:underline">
              {complete ? "复习模块" : unlocked ? "继续学习 →" : "先完成上一模块"}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

export function Certificate({ moduleTitle, studentName = "同学" }: { moduleTitle: string; studentName?: string }) {
  return (
    <Card className="relative overflow-hidden border-primary/30">
      <CardContent className="relative p-8 text-center">
        <div className="absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(45deg,currentColor_0,currentColor_1px,transparent_1px,transparent_12px)]" />
        <div className="relative">
          <Award className="mx-auto h-12 w-12 text-amber-500" />
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Computer Academy</p>
          <h3 className="mt-2 text-2xl font-bold">结课证书</h3>
          <p className="mt-4 text-sm text-muted-foreground">证明 {studentName} 已完成</p>
          <p className="mt-1 text-lg font-semibold text-primary">{moduleTitle}</p>
          <div className="mx-auto mt-6 h-px w-40 bg-border" />
          <Button size="sm" variant="outline" className="mt-6" onClick={() => window.print()}>
            打印证书
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
