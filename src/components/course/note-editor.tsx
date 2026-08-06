"use client";

import { BookMarked, Eye, PencilLine, Save, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useNotesStore } from "@/lib/stores/notes-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function NoteEditor({ lessonId, lessonTitle }: { lessonId: string; lessonTitle: string }) {
  const note = useNotesStore((s) => s.notes.find((n) => n.lessonId === lessonId));
  const saveNote = useNotesStore((s) => s.saveNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const content = note?.content ?? "";
  const tagsInput = note?.tags.join(",") ?? "";

  function save(nextContent = content, nextTags = tagsInput) {
    const tagList = nextTags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);
    saveNote({ lessonId, title: lessonTitle, content: nextContent, tags: tagList });
    toast.success("笔记已自动保存到本机");
  }

  return (
    <Card className="my-8">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <BookMarked className="h-4 w-4 text-primary" /> 课堂笔记
            <span className="text-xs font-normal text-muted-foreground">支持 Markdown，自动保存</span>
          </p>
          <div className="flex gap-1.5">
            <Button size="sm" variant={mode === "edit" ? "default" : "ghost"} onClick={() => setMode("edit")}>
              <PencilLine className="h-3.5 w-3.5" /> 编辑
            </Button>
            <Button size="sm" variant={mode === "preview" ? "default" : "ghost"} onClick={() => setMode("preview")}>
              <Eye className="h-3.5 w-3.5" /> 预览
            </Button>
            <Button size="sm" variant="outline" onClick={() => save()}>
              <Save className="h-3.5 w-3.5" /> 保存
            </Button>
            {note && (
              <Button size="sm" variant="ghost" onClick={() => { deleteNote(lessonId); toast("笔记已删除"); }}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tags className="h-4 w-4 text-muted-foreground" />
          <Input
            value={tagsInput}
            onChange={(e) => save(content, e.target.value)}
            placeholder="标签，用逗号分隔，例如：CPU,考试重点"
            className="h-9 text-sm"
          />
        </div>

        {mode === "edit" ? (
          <Textarea
            value={content}
            onChange={(e) => save(e.target.value, tagsInput)}
            placeholder={"写点什么… 支持 Markdown：\n# 标题\n- 列表\n**加粗**\n`代码`"}
            className="min-h-[180px] font-mono text-sm"
          />
        ) : (
          <div className={cn("markdown-body min-h-[180px] rounded-md border bg-muted/20 p-4 text-sm")}>
            {content.trim() ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">还没有内容，切回编辑模式写一点。</p>
            )}
          </div>
        )}

        {note?.tags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((t) => (
              <Badge key={t} variant="secondary">#{t}</Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
