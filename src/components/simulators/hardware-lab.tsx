"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cpu, HardDrive, MemoryStick, MonitorPlay, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function CpuExplorer() {
  const [active, setActive] = useState<string | null>("core");
  const [spin, setSpin] = useState(false);

  const parts = [
    { id: "core", name: "计算核心", desc: "真正执行算术和逻辑运算的地方。核心越多，能并行处理的任务越多。" },
    { id: "cache", name: "缓存 L1/L2/L3", desc: "紧贴核心的超快小容量存储。常用数据先放这里，避免每次都访问慢得多的内存。" },
    { id: "imc", name: "内存控制器", desc: "CPU 与内存之间的桥梁，决定内存频率上限和双通道支持。" },
    { id: "igpu", name: "核显", desc: "集成在 CPU 里的图形单元，能看视频、办公、轻量剪辑，功耗低。" },
  ];
  const activePart = parts.find((p) => p.id === active) ?? parts[0];

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-slate-900 to-indigo-950 p-6">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:18px_18px]" />
        <motion.div
          animate={{ rotateY: spin ? 360 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="relative h-40 w-40 rounded-2xl border-2 border-indigo-300/40 bg-gradient-to-br from-slate-700 to-slate-900 p-2 shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 rounded-xl border border-white/10 bg-black/40 p-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.15, backgroundColor: "rgba(129,140,248,0.35)" }}
                onClick={() => setActive(i < 2 ? "core" : i < 5 ? "cache" : i < 7 ? "imc" : "igpu")}
                className="cursor-pointer rounded-md bg-indigo-400/20"
              />
            ))}
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-0.5 text-[10px] font-medium text-indigo-200">
            CPU
          </div>
        </motion.div>
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4 bg-black/40 text-white"
          onClick={() => setSpin((v) => !v)}
        >
          <Zap className="mr-1 h-3.5 w-3.5" />
          {spin ? "停止旋转" : "旋转芯片"}
        </Button>
      </div>

      <div className="space-y-2">
        {parts.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={cn(
              "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
              active === p.id
                ? "border-primary/60 bg-primary/10 shadow-sm"
                : "border-border hover:bg-accent/60",
            )}
          >
            <span className="font-medium">{p.name}</span>
            <AnimatePresence>
              {active === p.id && (
                <motion.span
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-1 block text-xs leading-relaxed text-muted-foreground"
                >
                  {p.desc}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
        <p className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
          当前选中：<span className="font-medium text-foreground">{activePart.name}</span> · {activePart.desc}
        </p>
      </div>
    </div>
  );
}

function MemoryExplorer() {
  const [running, setRunning] = useState(false);
  const [openApps, setOpenApps] = useState(2);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => { setRunning((v) => !v); setOpenApps(2); }}>
          {running ? "暂停演示" : "打开程序"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpenApps((v) => Math.min(6, v + 1))}>
          再开一个程序
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpenApps((v) => Math.max(1, v - 1))}>
          关闭一个
        </Button>
      </div>
      <div className="relative h-40 overflow-hidden rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="absolute inset-x-4 top-3 flex justify-between text-[11px] text-slate-400">
          <span>硬盘（长期仓库）</span>
          <span>内存工作台 {openApps}/6 格</span>
          <span>CPU</span>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-400/10 text-center text-[11px] text-amber-200">
            文件<br />Word 论文
          </div>
          {running && (
            <motion.div
              animate={{ x: [0, 70, 70, 0], y: [0, -26, -60, -26] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="z-10 h-5 w-5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.8)]"
            />
          )}
          <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-sky-300/30 bg-sky-400/10 p-2">
            <div className="grid w-full grid-cols-2 gap-1.5">
              {Array.from({ length: openApps }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 items-center justify-center rounded bg-sky-400/40 text-[9px] text-sky-100"
                >
                  App {i + 1}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-indigo-300/40 bg-indigo-400/10 text-[11px] text-indigo-200">
            CPU
          </div>
        </div>
        {openApps >= 6 && (
          <p className="mt-4 text-center text-xs font-medium text-amber-300">
            工作台满了：程序开始卡顿，系统不得不把数据来回搬动。
          </p>
        )}
        {openApps < 6 && (
          <p className="mt-4 text-center text-xs text-slate-400">
            数据先从硬盘加载到内存，CPU 再从内存取用；断电后内存清空。
          </p>
        )}
      </div>
    </div>
  );
}

function SsdExplorer() {
  const [open, setOpen] = useState(false);
  const layers = [
    { name: "外壳", desc: "金属或塑料外壳，散热并保护内部。" },
    { name: "主控芯片", desc: "SSD 的 CPU：管理数据读写、磨损均衡与垃圾回收。" },
    { name: "缓存 DRAM", desc: "小容量高速缓存，暂存映射表与写入数据。" },
    { name: "闪存颗粒 NAND", desc: "真正存数据的地方，TLC/QLC 指每颗粒存储密度。" },
  ];

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setOpen((v) => !v)}>
        {open ? "装回去" : "拆解 SSD"}
      </Button>
      <div className="relative mx-auto h-64 w-full max-w-md">
        {layers.map((layer, i) => {
          const offset = open ? i * 34 : 0;
          return (
            <motion.div
              key={layer.name}
              animate={{ y: offset, zIndex: open ? 20 - i : 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="absolute inset-x-0 top-[calc(50%-34px)] mx-auto h-[68px] w-[78%] rounded-xl border p-3 shadow-lg"
              style={{
                background: open
                  ? `linear-gradient(135deg, ${["#1e293b", "#0f172a", "#1e3a5f", "#312e81"][i]}, #0b1220)`
                  : "linear-gradient(135deg, #1e293b, #0f172a)",
                borderColor: "rgba(148,163,184,0.35)",
              }}
            >
              <p className="text-sm font-medium text-slate-100">{layer.name}</p>
              {open && <p className="text-[11px] leading-snug text-slate-300">{layer.desc}</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function GpuExplorer() {
  const [mode, setMode] = useState<"cpu" | "gpu">("cpu");
  const jobs = 12;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={mode === "cpu" ? "default" : "outline"}>CPU 单线程</Badge>
        <Badge variant={mode === "gpu" ? "default" : "outline"}>GPU 并行</Badge>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <button
          onClick={() => setMode("cpu")}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full border text-xs font-medium transition-all",
            mode === "cpu" ? "border-indigo-300/50 bg-indigo-400/20 text-white" : "border-white/10 text-slate-400",
          )}
        >
          CPU
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {mode === "cpu" ? (
            <motion.div
              key="cpu"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-wrap gap-1.5"
            >
              {Array.from({ length: jobs }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.25, 1] }}
                  transition={{ delay: i * 0.35, repeat: Infinity, repeatType: "reverse" }}
                  className="h-4 w-6 rounded bg-indigo-400/50"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="gpu"
              initial="hidden"
              animate="show"
              className="grid grid-cols-6 gap-1.5"
            >
              {Array.from({ length: jobs }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0.2, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08 * i }}
                  className="h-4 rounded bg-emerald-400/70"
                />
              ))}
            </motion.div>
          )}
        </div>
        <button
          onClick={() => setMode("gpu")}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full border text-xs font-medium transition-all",
            mode === "gpu" ? "border-emerald-300/50 bg-emerald-400/20 text-white" : "border-white/10 text-slate-400",
          )}
        >
          GPU
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        {mode === "cpu"
          ? "CPU 一次只能处理一个任务，虽然每步都很强，但任务要排队。"
          : "GPU 用上千个小核心同时开工，大量简单任务瞬间完成——这就是 AI 和渲染爱用 GPU 的原因。"}
      </p>
    </div>
  );
}

const tabs = [
  { id: "cpu", label: "CPU", icon: Cpu, comp: CpuExplorer },
  { id: "memory", label: "内存", icon: MemoryStick, comp: MemoryExplorer },
  { id: "ssd", label: "SSD", icon: HardDrive, comp: SsdExplorer },
  { id: "gpu", label: "GPU", icon: MonitorPlay, comp: GpuExplorer },
] as const;

export function HardwareLab({ kind }: { kind: string }) {
  const [activeTab, setActiveTab] = useState<string>(kind in ["cpu", "memory", "ssd", "gpu"] ? kind : "cpu");
  const Active = tabs.find((t) => t.id === activeTab)?.comp ?? CpuExplorer;

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
