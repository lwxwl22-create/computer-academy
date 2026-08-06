"use client";

import { Command, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { searchAll } from "@/lib/search";
import { modules } from "@/content";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hits = useMemo(() => searchAll(modules, query), [query]);

  function go(path: string) {
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[18%] max-w-xl translate-y-0 p-0">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-muted-foreground" />
            搜索课程、知识点、硬件术语
          </DialogTitle>
          <DialogDescription className="sr-only">输入关键词搜索课程与知识。</DialogDescription>
        </DialogHeader>
        <div className="px-4 py-2">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如：CPU、快捷键、蓝屏、买电脑…"
            className="border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="space-y-2 p-2">
              <p className="text-xs text-muted-foreground">试试搜：</p>
              <div className="flex flex-wrap gap-1.5">
                {["CPU", "内存", "快捷键", "蓝屏", "Word", "AI", "Python"].map((t) => (
                  <button
                    key={t}
                    className="rounded-full border px-3 py-1 text-xs transition-colors hover:bg-accent"
                    onClick={() => setQuery(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : hits.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">没有找到相关结果，换个关键词试试。</p>
          ) : (
            <div className="space-y-1">
              {hits.map((hit) => (
                <button
                  key={hit.path}
                  onClick={() => go(hit.path)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent",
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{hit.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{hit.subtitle}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {hit.kind === "lesson" ? "课程" : "模块"}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Command className="h-3 w-3" /> Ctrl+K 打开搜索
          </span>
          <span>Enter 跳转</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
