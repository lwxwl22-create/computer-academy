"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { modules } from "@/content";
import { useLearningStore } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleCard } from "@/components/course/course-cards";
import { cn } from "@/lib/utils";

export function CourseLibrary() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("全部");
  const [difficulty, setDifficulty] = useState("全部");
  const completed = useLearningStore((s) => s.completedLessons);
  const started = useLearningStore((s) => s.startedLessons);

  const filtered = useMemo(() => {
    return modules
      .map((m) => {
        const ids = m.lessons.map((l) => `${m.slug}/${l.slug}`);
        const doneCount = ids.filter((id) => completed.includes(id)).length;
        const statusOf = doneCount === ids.length ? "已完成" : doneCount > 0 || ids.some((id) => started.includes(id)) ? "学习中" : "未开始";
        const matchStatus = status === "全部" || status === statusOf;
        const matchDifficulty = difficulty === "全部" || m.difficulty === difficulty;
        const matchQuery =
          !query.trim() ||
          `${m.title} ${m.subtitle} ${m.description} ${m.lessons.map((l) => l.title).join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return { m, statusOf, doneCount, matchStatus, matchDifficulty, matchQuery };
      })
      .filter((x) => x.matchStatus && x.matchDifficulty && x.matchQuery);
  }, [query, status, difficulty, completed, started]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">课程库</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">十二大模块，全部课程</h1>
          <p className="mt-2 text-sm text-muted-foreground">筛选状态与难度，找到此刻最该学的一课。</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索课程…"
              className="pl-9 md:w-64"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["全部", "未开始", "学习中", "已完成"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["全部", "入门", "基础", "进阶"].map((s) => (
                <SelectItem key={s} value={s}>{s === "全部" ? "全部难度" : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={status} onValueChange={setStatus} className="mt-6">
        <TabsList className="flex w-full justify-start overflow-x-auto sm:w-auto">
          {["全部", "未开始", "学习中", "已完成"].map((s) => (
            <TabsTrigger key={s} value={s} className="flex-1 sm:flex-none">{s}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-2xl border border-dashed p-14 text-center">
          <SlidersHorizontal className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">没有匹配的模块</p>
          <p className="mt-1 text-xs text-muted-foreground">换个关键词或清空筛选试试。</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ m, statusOf }) => (
            <div key={m.slug} className="relative">
              <ModuleCard module={m} />
              <Badge
                className={cn(
                  "absolute right-4 top-4 z-10",
                  statusOf === "已完成" ? "bg-emerald-500/90 text-white" : statusOf === "学习中" ? "bg-sky-500/90 text-white" : "bg-background/80",
                )}
              >
                {statusOf}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
