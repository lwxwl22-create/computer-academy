"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  ListTodo,
  Play,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { allLessons, modules } from "@/content";
import { useLearningStore, useStreak } from "@/lib/stores/learning-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LearningChart } from "@/components/charts/learning-chart";
import { XpLevelCard } from "@/components/gamification/gamification";
import { Icon } from "@/components/icon";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMinutes } from "@/lib/utils";

export function DashboardView() {
  const hydrated = useHydrated();
  const xp = useLearningStore((s) => s.xp);
  const completed = useLearningStore((s) => s.completedLessons);
  const favorites = useLearningStore((s) => s.favorites);
  const recent = useLearningStore((s) => s.recentLessons);
  const totalMinutes = useLearningStore((s) => s.totalMinutes);
  const tasks = useLearningStore((s) => s.dailyTasks);
  const streak = useStreak();
  const dailyGoal = useSettingsStore((s) => s.dailyGoalMinutes);
  const quizCorrect = useLearningStore((s) => s.quizCorrect);
  const quizTotal = useLearningStore((s) => s.quizTotal);
  const wrongAnswers = useLearningStore((s) => s.wrongAnswers);

  const all = useMemo(() => allLessons(), []);
  const startedIds = new Set(recent);
  let nextLesson: { module: (typeof modules)[number]; lesson: (typeof modules)[number]["lessons"][number]; id: string; started: boolean } | null = null;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const id = `${mod.slug}/${lesson.slug}`;
      if (!completed.includes(id)) {
        nextLesson = { module: mod, lesson, id, started: startedIds.has(id) };
        break;
      }
    }
    if (nextLesson) break;
  }

  const recentLessons = recent
    .map((id) => {
      const found = all.find((x) => `${x.module.slug}/${x.lesson.slug}` === id);
      return found ? { ...found, id } : null;
    })
    .filter(Boolean)
    .slice(0, 6);

  const favoriteLessons = favorites
    .map((id) => {
      const found = all.find((x) => `${x.module.slug}/${x.lesson.slug}` === id);
      return found ? { ...found, id } : null;
    })
    .filter(Boolean)
    .slice(0, 6);

  const moduleProgress = modules.map((m) => {
    const done = m.lessons.filter((l) => completed.includes(`${m.slug}/${l.slug}`)).length;
    return { module: m, done, total: m.lessons.length, percent: done / m.lessons.length };
  });
  const overallPercent = moduleProgress.reduce((s, m) => s + m.percent, 0) / moduleProgress.length;
  const completedModules = moduleProgress.filter((m) => m.percent === 1).length;

  const leaderboard = useMemo(() => {
    const mock = [
      { name: "小林", xp: 1320 },
      { name: "阿哲", xp: 980 },
      { name: "Cathy", xp: 760 },
      { name: "电脑小白", xp: 410 },
    ];
    return [...mock, { name: "我", xp }].sort((a, b) => b.xp - a.xp);
  }, [xp]);

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">我的学习台</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {completed.length > 0 ? "欢迎回来，继续今天的进度。" : "从第一课开始，建立你的第一个学习连胜。"}
          </p>
        </div>
        {nextLesson && (
          <Link href={`/courses/${nextLesson.module.slug}/${nextLesson.lesson.slug}/`}>
            <Button size="lg" className="w-full sm:w-auto">
              <Play className="h-4 w-4" />
              {nextLesson.started ? "继续学习" : "开始下一课"}
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <XpLevelCard />
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 今日目标</p>
            <p className="mt-2 text-3xl font-bold">{formatMinutes(Math.min(totalMinutes, dailyGoal))}</p>
            <Progress value={Math.min(100, (totalMinutes / dailyGoal) * 100)} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">目标 {formatMinutes(dailyGoal)} · 可在设置调整</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Target className="h-4 w-4" /> 整体进度</p>
            <p className="mt-2 text-3xl font-bold">{Math.round(overallPercent * 100)}%</p>
            <Progress value={overallPercent * 100} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {completed.length} 节课完成 · {completedModules} 个模块结课
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">最近学习</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLessons.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                <BookOpen className="mx-auto mb-2 h-6 w-6 opacity-50" />
                还没有学习记录，点上方按钮开始第一课。
              </div>
            ) : (
              <div className="space-y-2">
                {recentLessons.map((item) => (
                  <Link
                    key={item!.id}
                    href={`/courses/${item!.module.slug}/${item!.lesson.slug}/`}
                    className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent/50"
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${item!.module.accent} text-white`}>
                      <Icon name={item!.module.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item!.lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{item!.module.title} · {formatMinutes(item!.lesson.durationMinutes)}</p>
                    </div>
                    {completed.includes(item!.id) && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><ListTodo className="h-4 w-4 text-primary" /> 每日任务</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{t.label}</p>
                  <Badge variant={t.done ? "success" : "outline"}>{t.done ? "+" + t.xp + " XP" : `${Math.min(t.progress, t.target)}/${t.target}`}</Badge>
                </div>
                <Progress value={Math.min(100, (t.progress / t.target) * 100)} className="mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">学习曲线</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4 text-primary" /> 本周排行（本地模拟）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {leaderboard.map((u, i) => (
              <div
                key={u.name}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${u.name === "我" ? "border border-primary/30 bg-primary/10" : ""}`}
              >
                <span className="w-5 text-xs font-bold text-muted-foreground">{i + 1}</span>
                <span className="flex-1 font-medium">{u.name}</span>
                <span className="text-xs text-muted-foreground">{u.xp} XP</span>
                {i === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><Star className="h-4 w-4 text-amber-500" /> 我的收藏</CardTitle>
            <Link href="/courses/" className="text-xs text-primary hover:underline">去课程库</Link>
          </CardHeader>
          <CardContent>
            {favoriteLessons.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                收藏的课程会出现在这里（课程卡片上的星标）。
              </p>
            ) : (
              <div className="space-y-2">
                {favoriteLessons.map((item) => (
                  <Link key={item!.id} href={`/courses/${item!.module.slug}/${item!.lesson.slug}/`} className="flex items-center justify-between rounded-xl border p-3 text-sm hover:bg-accent/50">
                    <span className="truncate font-medium">{item!.lesson.title}</span>
                    <span className="ml-3 shrink-0 text-xs text-muted-foreground">{item!.module.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> 学习表现</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/40 p-4 text-center">
              <p className="text-2xl font-bold">{quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : "—"}%</p>
              <p className="mt-1 text-xs text-muted-foreground">测验正确率</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 text-center">
              <p className="text-2xl font-bold">{wrongAnswers.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">错题本</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 text-center">
              <p className="text-2xl font-bold">{streak}</p>
              <p className="mt-1 text-xs text-muted-foreground"><Flame className="mr-1 inline h-3 w-3 text-orange-500" />连续天数</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 text-center">
              <p className="text-2xl font-bold">{formatMinutes(totalMinutes)}</p>
              <p className="mt-1 text-xs text-muted-foreground">累计学习</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold"><Trophy className="h-4 w-4 text-amber-500" /> 模块进度</p>
              <p className="mt-1 text-xs text-muted-foreground">完成全部课程解锁模块证书。</p>
            </div>
            <Link href="/skill-tree/"><Button variant="outline" size="sm">查看技能树</Button></Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {moduleProgress.slice(0, 8).map((m) => (
              <Link key={m.module.slug} href={`/courses/${m.module.slug}/`} className="rounded-xl border bg-background p-3 hover:bg-accent/40">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium">{m.module.title}</p>
                  <span className="text-[11px] text-muted-foreground">{m.done}/{m.total}</span>
                </div>
                <Progress value={m.percent * 100} className="mt-2" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
