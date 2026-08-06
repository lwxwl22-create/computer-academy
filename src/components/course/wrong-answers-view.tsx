"use client";

import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { modules } from "@/content";
import { useLearningStore } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function WrongAnswersView() {
  const wrongAnswers = useLearningStore((s) => s.wrongAnswers);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">错题本</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">错过的题，再学一遍</h1>
          <p className="mt-2 text-sm text-muted-foreground">测验答错的题会自动记录到这里，共 {wrongAnswers.length} 条。</p>
        </div>
      </div>

      {wrongAnswers.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-2xl border border-dashed p-14 text-center">
          <BookOpenCheck className="mb-3 h-9 w-9 text-emerald-500/60" />
          <p className="text-sm font-medium">错题本是空的</p>
          <p className="mt-1 text-xs text-muted-foreground">继续保持，答错的题会在这里等你复习。</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {wrongAnswers.map((w) => {
            const mod = modules.find((m) => m.slug === w.moduleSlug);
            return (
              <Card key={w.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="destructive">答错</Badge>
                    <span className="text-muted-foreground">{w.date}</span>
                    {mod && (
                      <Link href={`/courses/${mod.slug}/`} className="text-primary hover:underline">{mod.title}</Link>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6">{w.prompt}</p>
                  <div className="mt-3 grid gap-2 rounded-xl bg-muted/40 p-3 text-sm sm:grid-cols-2">
                    <p><span className="text-xs text-rose-500">你的答案：</span><span className="block text-muted-foreground">{w.userAnswer || "未作答"}</span></p>
                    <p><span className="text-xs text-emerald-500">正确答案：</span><span className="block text-muted-foreground">{w.correctAnswer}</span></p>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">解析：{w.explanation}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
