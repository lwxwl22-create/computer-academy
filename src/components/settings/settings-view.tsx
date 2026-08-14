"use client";

import { AlertTriangle, Moon, Sparkles, Timer, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { useLearningStore } from "@/lib/stores/learning-store";
import { useNotesStore } from "@/lib/stores/notes-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useHydrated } from "@/hooks/use-hydrated";

export function SettingsView() {
  const hydrated = useHydrated();
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore();
  const clearLearning = useLearningStore((s) => s.clearAll);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
      <div>
        <p className="text-sm font-semibold text-primary">设置</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">让学习台贴合你</h1>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Moon className="h-4 w-4" /> 外观</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>主题</Label>
              <p className="mt-1 text-xs text-muted-foreground">跟随系统自动切换深浅色。</p>
            </div>
            <Select value={hydrated ? theme : "system"} onValueChange={(v) => setTheme(v)} disabled={!hydrated}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="system">跟随系统</SelectItem>
                <SelectItem value="light">浅色</SelectItem>
                <SelectItem value="dark">深色</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>减少动画</Label>
              <p className="mt-1 text-xs text-muted-foreground">降低页面动效，适合对动画敏感的用户。</p>
            </div>
            <Switch checked={settings.reduceMotion} onCheckedChange={settings.setReduceMotion} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>新手引导提示</Label>
              <p className="mt-1 text-xs text-muted-foreground">在关键位置显示操作提示。</p>
            </div>
            <Switch checked={settings.showGuide} onCheckedChange={settings.setShowGuide} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Timer className="h-4 w-4" /> 学习习惯</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>每日学习目标</Label>
              <p className="mt-1 text-xs text-muted-foreground">仪表盘按这个目标显示今日进度。</p>
            </div>
            <Select value={String(settings.dailyGoalMinutes)} onValueChange={(v) => settings.setDailyGoal(Number(v))}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 15, 20, 30, 45, 60].map((m) => (
                  <SelectItem key={m} value={String(m)}>{m} 分钟</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4" /> 关于内容</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs leading-6 text-muted-foreground">
            本平台的课程文字、测验与模拟器说明由 AI 辅助生成，用于系统化学习。AI 内容可能产生幻觉或细节过时，请以微软、Office 厂商等官方文档为准；执行删除、格式化、重装等操作前，先备份重要数据。
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            学习进度保存在本机，清理浏览器数据前请先导出或备份你的笔记。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base text-destructive"><AlertTriangle className="h-4 w-4" /> 数据</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs leading-6 text-muted-foreground">
            所有进度、XP、笔记、错题都保存在本机浏览器的 LocalStorage，不会上传。清空后不可恢复。
          </p>
          <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" /> 清空全部学习数据
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认清空全部数据？</DialogTitle>
            <DialogDescription>这会删除学习进度、XP、笔记、错题和设置，且无法恢复。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>取消</Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearLearning();
                useNotesStore.getState().clearNotes();
                setConfirmOpen(false);
                toast.success("已清空全部数据");
              }}
            >
              确认清空
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
