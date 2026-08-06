"use client";

import { BookMarked, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNotesStore } from "@/lib/stores/notes-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NotesView() {
  const notes = useNotesStore((s) => s.notes);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [notes, query]);

  const allTags = useMemo(() => Array.from(new Set(notes.flatMap((n) => n.tags))).slice(0, 20), [notes]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">笔记库</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">你的全部课堂笔记</h1>
          <p className="mt-2 text-sm text-muted-foreground">每节课都能记 Markdown 笔记，自动保存在本机。</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索笔记或标签…" className="pl-9" />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {allTags.map((t) => (
            <button key={t} onClick={() => setQuery(t)} className="rounded-full border px-3 py-1 text-xs hover:bg-accent">#{t}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-2xl border border-dashed p-14 text-center">
          <BookMarked className="mb-3 h-9 w-9 text-muted-foreground/50" />
          <p className="text-sm font-medium">{notes.length === 0 ? "还没有笔记" : "没有匹配的笔记"}</p>
          <p className="mt-1 text-xs text-muted-foreground">在任意课程页的「课堂笔记」里写第一篇。</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((n) => (
            <Card key={n.lessonId}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{n.title}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{n.updatedAt.slice(0, 10)}</span>
                </div>
                <div className="markdown-body mt-2 line-clamp-4 min-h-[80px] text-xs">
                  {n.content.trim() ? <ReactMarkdown>{n.content}</ReactMarkdown> : <span className="text-muted-foreground">空笔记</span>}
                </div>
                {n.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {n.tags.map((t) => <Badge key={t} variant="secondary">#{t}</Badge>)}
                  </div>
                )}
                <Link href={`/courses/${n.lessonId.split("/")[0]}/${n.lessonId.split("/")[1]}/`} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
                  回到课程 →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
