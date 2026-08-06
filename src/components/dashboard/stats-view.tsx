"use client";

import { Clock, Flame, Target, Trophy } from "lucide-react";
import { useMemo } from "react";
import { modules } from "@/content";
import { useLearningStore, useStreak } from "@/lib/stores/learning-store";
import { levelProgress } from "@/lib/gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DifficultyChart, LearningChart, ModuleProgressChart } from "@/components/charts/learning-chart";
import { useHydrated } from "@/hooks/use-hydrated";

export function StatsView() {
  const hydrated = useHydrated();
  const xp = useLearningStore((s) => s.xp);
  const completed = useLearningStore((s) => s.completedLessons);
  const totalMinutes = useLearningStore((s) => s.totalMinutes);
  const quizCorrect = useLearningStore((s) => s.quizCorrect);
  const quizTotal = useLearningStore((s) => s.quizTotal);
  const streak = useStreak();
  const { level } = levelProgress(xp);

  const moduleProgress = useMemo(
    () =>
      modules.map((m) => ({
        title: m.title,
        value: m.lessons.filter((l) => completed.includes(`${m.slug}/${l.slug}`)).length / m.lessons.length,
      })),
    [completed],
  );

  const difficulty = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of modules) {
      for (const l of m.lessons) {
        if (completed.includes(`${m.slug}/${l.slug}`)) counts[l.difficulty] = (counts[l.difficulty] ?? 0) + 1;
      }
    }
    return [
      { label: "入门", value: counts["入门"] ?? 0 },
      { label: "基础", value: counts["基础"] ?? 0 },
      { label: "进阶", value: counts["进阶"] ?? 0 },
    ].filter((d) => d.value > 0);
  }, [completed]);

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />)}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
      <div>
        <p className="text-sm font-semibold text-primary">学习统计</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">用数据看见成长</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card><CardContent className="p-4 text-center"><Trophy className="mx-auto h-5 w-5 text-amber-500" /><p className="mt-2 text-2xl font-bold">Lv.{level}</p><p className="text-xs text-muted-foreground">等级</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Target className="mx-auto h-5 w-5 text-primary" /><p className="mt-2 text-2xl font-bold">{completed.length}</p><p className="text-xs text-muted-foreground">完成课程</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Clock className="mx-auto h-5 w-5 text-sky-500" /><p className="mt-2 text-2xl font-bold">{Math.round(totalMinutes / 60)}h</p><p className="text-xs text-muted-foreground">累计时长</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Flame className="mx-auto h-5 w-5 text-orange-500" /><p className="mt-2 text-2xl font-bold">{streak}</p><p className="text-xs text-muted-foreground">连续天数</p></CardContent></Card>
        <Card className="col-span-2 lg:col-span-1"><CardContent className="p-4 text-center"><Trophy className="mx-auto h-5 w-5 text-emerald-500" /><p className="mt-2 text-2xl font-bold">{quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0}%</p><p className="text-xs text-muted-foreground">测验正确率</p></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">近 14 天学习时长</CardTitle></CardHeader>
          <CardContent><LearningChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">各模块完成率</CardTitle></CardHeader>
          <CardContent><ModuleProgressChart progress={moduleProgress} /></CardContent>
        </Card>
      </div>

      {difficulty.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">已完成课程难度分布</CardTitle></CardHeader>
          <CardContent><DifficultyChart data={difficulty} /></CardContent>
        </Card>
      )}
    </div>
  );
}
