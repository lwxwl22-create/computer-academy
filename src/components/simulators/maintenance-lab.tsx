"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  HardDrive,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function ThreatScanner() {
  const [mode, setMode] = useState<"idle" | "quick" | "full" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [threats, setThreats] = useState<string[]>([]);
  const [action, setAction] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode !== "quick" && mode !== "full") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + (mode === "quick" ? 7 + Math.random() * 6 : 2 + Math.random() * 2);
        if (next >= 100) {
          clearInterval(interval);
          setMode("done");
          setThreats(
            mode === "quick"
              ? Math.random() > 0.4
                ? []
                : ["下载器全家桶.exe"]
              : ["伪装成照片的勒索木马", "后台挖矿程序", "浏览器主页劫持插件"],
          );
          return 100;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [mode]);

  function start(nextMode: "quick" | "full") {
    setMode(nextMode);
    setProgress(0);
    setThreats([]);
    setAction({});
  }

  const resolved = threats.every((t) => action[t] === "隔离" || action[t] === "允许");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => start("quick")} disabled={mode === "quick" || mode === "full"}>
          快速扫描
        </Button>
        <Button size="sm" variant="outline" onClick={() => start("full")} disabled={mode === "quick" || mode === "full"}>
          完全扫描
        </Button>
        {(mode === "quick" || mode === "full") && (
          <Badge variant="info" className="gap-1">
            <RefreshCcw className="h-3 w-3 animate-spin" /> 扫描中
          </Badge>
        )}
      </div>

      <div className="rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Windows 安全中心 · 病毒和威胁防护</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="mt-3 h-2 bg-white/15 [&>div]:bg-emerald-400" />
        <p className="mt-2 text-xs text-slate-400">
          {mode === "idle" && "选择扫描模式开始（模拟）。"}
          {mode === "quick" && "正在检查常见位置：启动项、下载目录、系统关键路径…"}
          {mode === "full" && "正在全盘扫描：每个文件都会检查，请耐心等待…"}
          {mode === "done" && (threats.length ? "扫描完成，发现威胁，请处理。" : "扫描完成，未发现威胁。")}
        </p>
      </div>

      {mode === "done" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {threats.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5" /> 设备状态良好，无需处理。
            </div>
          ) : (
            threats.map((t) => (
              <div key={t} className="flex flex-wrap items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm">
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
                <span className="flex-1">{t}</span>
                {action[t] ? (
                  <Badge variant={action[t] === "隔离" ? "destructive" : "success"}>{action[t]} 已处理</Badge>
                ) : (
                  <>
                    <Button size="sm" variant="destructive" onClick={() => setAction((a) => ({ ...a, [t]: "隔离" }))}>
                      隔离
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setAction((a) => ({ ...a, [t]: "允许" }))}>
                      允许
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
          {threats.length > 0 && resolved && (
            <p className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300">
              已处理全部威胁。真实系统中“允许”只适用于你确认可信的软件。
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

function DiskCleaner() {
  const items = [
    { id: "temp", label: "临时文件", size: 420, desc: "系统与软件产生的临时数据" },
    { id: "recycle", label: "回收站", size: 180, desc: "已删除但未清空的文件" },
    { id: "update", label: "Windows 更新缓存", size: 650, desc: "旧更新包残留" },
    { id: "browser", label: "浏览器缓存", size: 96, desc: "网页临时缓存（清后重开稍慢）" },
  ];
  const [checked, setChecked] = useState<Record<string, boolean>>({ temp: true, recycle: true });
  const [cleaning, setCleaning] = useState(false);
  const [freed, setFreed] = useState(0);

  const selected = items.filter((i) => checked[i.id]);
  const total = selected.reduce((s, i) => s + i.size, 0);

  useEffect(() => {
    if (!cleaning) return;
    const interval = setInterval(() => {
      setFreed((f) => {
        const next = Math.min(total, f + Math.max(10, Math.round(total / 8)));
        if (next >= total) {
          clearInterval(interval);
          setCleaning(false);
        }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [cleaning, total]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((i) => (
          <label
            key={i.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
              checked[i.id] ? "border-primary/40 bg-primary/5" : "border-border",
            )}
          >
            <input
              type="checkbox"
              checked={!!checked[i.id]}
              onChange={(e) => setChecked((c) => ({ ...c, [i.id]: e.target.checked }))}
              className="h-4 w-4"
            />
            <span className="flex-1">
              <span className="font-medium">{i.label}</span>
              <span className="block text-xs text-muted-foreground">{i.desc}</span>
            </span>
            <Badge variant="outline">{i.size} MB</Badge>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/40 p-3">
        <div>
          <p className="text-sm font-medium">可释放约 {total} MB</p>
          <p className="text-xs text-muted-foreground">勾选项目后点击清理（模拟磁盘清理）。</p>
        </div>
        <Button size="sm" onClick={() => { setCleaning(true); setFreed(0); }} disabled={cleaning || total === 0}>
          <Trash2 className="h-4 w-4" /> {cleaning ? "清理中…" : "清理"}
        </Button>
      </div>

      <AnimatePresence>
        {freed > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
              <p className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> 已释放 {freed} MB
              </p>
              <Progress value={(freed / total) * 100} className="mt-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BackupPlanner() {
  const [cloud, setCloud] = useState(false);
  const [local, setLocal] = useState(false);
  const [offline, setOffline] = useState(false);
  const [restorePoint, setRestorePoint] = useState<string | null>(null);

  const count = [cloud, local, offline].filter(Boolean).length;
  const hasOfflineCopy = offline;
  const meets321 = count >= 2 && hasOfflineCopy;

  const options = [
    { id: "cloud", label: "云盘自动同步", desc: "如 OneDrive/坚果云，异地一份", enabled: cloud, set: setCloud },
    { id: "local", label: "本地第二份副本", desc: "如外接硬盘或另一分区", enabled: local, set: setLocal },
    { id: "offline", label: "离线介质", desc: "不联网的移动硬盘/U 盘，防勒索关键", enabled: offline, set: setOffline },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => o.set(!o.enabled)}
            className={cn(
              "rounded-xl border p-3 text-left text-sm transition-all",
              o.enabled ? "border-primary/50 bg-primary/10 shadow-sm" : "border-border hover:bg-accent/50",
            )}
          >
            <p className="font-medium">{o.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/40 p-3">
        <div>
          <p className="text-sm font-medium">已启用 {count}/3 份副本</p>
          <p className="text-xs text-muted-foreground">3-2-1 需要至少 2 份副本且包含 1 份离线介质。</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setRestorePoint(`还原点 ${new Date().toLocaleTimeString("zh-CN")}`)}>
          <RefreshCcw className="h-4 w-4" /> 创建还原点
        </Button>
      </div>

      <div className="rounded-xl border p-3 text-sm">
        {meets321 ? (
          <p className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" /> 方案满足 3-2-1 原则，重要数据有离线兜底。
          </p>
        ) : (
          <p className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-5 w-5" /> {count === 0 ? "还没有任何备份，建议从云盘同步开始。" : "还差一份离线副本，勒索软件面前只有它最可靠。"}
          </p>
        )}
        {restorePoint && (
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 已创建：{restorePoint}
          </p>
        )}
      </div>
    </div>
  );
}

const tabs = [
  { id: "scan", label: "威胁扫描", icon: ShieldCheck, comp: ThreatScanner },
  { id: "clean", label: "磁盘清理", icon: Trash2, comp: DiskCleaner },
  { id: "backup", label: "备份计划", icon: HardDrive, comp: BackupPlanner },
] as const;

export function MaintenanceLab() {
  const [activeTab, setActiveTab] = useState<string>("scan");
  const Active = tabs.find((t) => t.id === activeTab)?.comp ?? ThreatScanner;

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                activeTab === t.id
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
        <Active />
      </CardContent>
    </Card>
  );
}
