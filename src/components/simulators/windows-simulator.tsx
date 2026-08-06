/* eslint-disable jsx-a11y/alt-text */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AppWindow,
  Check,
  ClipboardPaste,
  Copy,
  FileText,
  Folder,
  FolderOpen,
  Image,
  Keyboard,
  Monitor,
  Music,
  Power,
  Search,
  Settings,
  Trash2,
  Undo2,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WinFile {
  id: string;
  name: string;
  type: "folder" | "doc" | "image" | "music" | "video";
}

const initialFiles: WinFile[] = [
  { id: "f1", name: "课程资料", type: "folder" },
  { id: "f2", name: "高数笔记.docx", type: "doc" },
  { id: "f3", name: "宿舍合照.png", type: "image" },
  { id: "f4", name: "迎新晚会.mp4", type: "video" },
  { id: "f5", name: "开学歌单.mp3", type: "music" },
  { id: "f6", name: "社团招新", type: "folder" },
  { id: "f7", name: "英语作业.docx", type: "doc" },
];

const fileIcon = {
  folder: Folder,
  doc: FileText,
  image: Image,
  music: Music,
  video: Video,
};

const fileColor = {
  folder: "text-amber-400",
  doc: "text-sky-400",
  image: "text-emerald-400",
  music: "text-fuchsia-400",
  video: "text-rose-400",
};

function DesktopSimulator() {
  const [startOpen, setStartOpen] = useState(false);
  const [context, setContext] = useState<{ x: number; y: number } | null>(null);
  const [windowOpen, setWindowOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const icons = [
    { name: "此电脑", icon: Monitor, action: () => setWindowOpen(true), label: "打开资源管理器" },
    { name: "回收站", icon: Trash2, action: () => setToast("回收站里还没有文件（这是一次模拟）") },
    { name: "设置", icon: Settings, action: () => setSettingsOpen(true), label: "Win+I 打开设置" },
    { name: "浏览器", icon: Search, action: () => setToast("模拟浏览器：地址栏输入网址试试") },
  ];

  return (
    <div
      className="relative h-[420px] overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400"
      onContextMenu={(e) => {
        e.preventDefault();
        setContext({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => {
        setStartOpen(false);
        setContext(null);
      }}
    >
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="absolute left-4 top-4 grid grid-cols-2 gap-4">
        {icons.map((icon) => (
          <button
            key={icon.name}
            className="group flex w-20 flex-col items-center gap-1 rounded-md p-2 text-white transition-colors hover:bg-white/15"
            onClick={(e) => {
              e.stopPropagation();
              icon.action();
            }}
            title={icon.label}
          >
            <icon.icon className="h-8 w-8 drop-shadow" />
            <span className="text-[11px] font-medium drop-shadow">{icon.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {windowOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/25 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <FolderOpen className="h-4 w-4 text-amber-400" /> 文件资源管理器
              </span>
              <button onClick={() => setWindowOpen(false)} className="rounded bg-rose-500/80 px-2 py-0.5">×</button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {initialFiles.slice(0, 6).map((f) => {
                const IconComp = fileIcon[f.type];
                return (
                  <div key={f.id} className="flex flex-col items-center gap-1 rounded-md p-2 hover:bg-white/10">
                    <IconComp className={cn("h-6 w-6", fileColor[f.type])} />
                    <span className="text-[10px] leading-tight">{f.name}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 rounded bg-black/30 p-2 text-[10px] text-slate-300">
              Win+E 打开资源管理器 · 点击文件夹可进入 · 右键桌面有菜单
            </p>
          </motion.div>
        )}

        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className="absolute right-3 top-3 w-64 rounded-lg border border-white/25 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between text-xs font-medium">
              设置（模拟）
              <button onClick={() => setSettingsOpen(false)} className="rounded bg-white/10 px-2 py-0.5">×</button>
            </div>
            {[
              ["系统", "显示、声音、电源"],
              ["网络和 Internet", "Wi-Fi、以太网"],
              ["个性化", "背景、主题、颜色"],
              ["应用", "安装、卸载、默认应用"],
              ["账户", "PIN、登录选项"],
              ["隐私和安全性", "Windows 安全中心"],
            ].map(([title, desc]) => (
              <button
                key={title}
                className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-white/10"
                onClick={() => setToast(`打开「${title}」：${desc}（真实系统按 Win+I）`)}
              >
                <span className="font-medium">{title}</span>
                <span className="block text-[10px] text-slate-400">{desc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {context && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-30 w-44 rounded-lg border border-white/20 bg-slate-900/95 p-1.5 text-white shadow-2xl backdrop-blur"
          style={{ left: Math.min(context.x - 60, 260), top: Math.min(context.y - 40, 260) }}
          onClick={(e) => e.stopPropagation()}
        >
          {["查看", "排序方式", "刷新", "新建文件夹", "个性化"].map((item) => (
            <button
              key={item}
              className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-white/15"
              onClick={() => {
                setToast(`桌面右键 → ${item}`);
                setContext(null);
              }}
            >
              {item}
            </button>
          ))}
        </motion.div>
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs text-white backdrop-blur"
        >
          {toast}
        </motion.div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-between border-t border-white/20 bg-slate-900/85 px-3 text-white backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 items-center gap-1 rounded-md bg-sky-500 px-3 text-xs font-semibold hover:bg-sky-400"
            onClick={(e) => {
              e.stopPropagation();
              setStartOpen((v) => !v);
            }}
          >
            <AppWindow className="h-4 w-4" /> 开始
          </button>
          <button className="rounded-md p-2 hover:bg-white/15" onClick={() => setWindowOpen(true)} title="资源管理器">
            <Folder className="h-5 w-5" />
          </button>
          <button className="rounded-md p-2 hover:bg-white/15" onClick={() => setToast("Win+Shift+S 可以截图")}>
            <Image className="h-5 w-5" />
          </button>
          <button className="rounded-md p-2 hover:bg-white/15" onClick={() => setToast("Alt+Tab 切换窗口")}>
            <AppWindow className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button onClick={() => setToast("Win+L 锁屏")} className="rounded-md px-2 py-1 hover:bg-white/15">09:41</button>
          <Power className="h-4 w-4" />
        </div>
      </div>

      <AnimatePresence>
        {startOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute bottom-14 left-3 w-72 rounded-xl border border-white/20 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-slate-300">
              <Search className="h-4 w-4" /> 搜索应用、设置、文件
            </div>
            <p className="px-2 text-[10px] uppercase tracking-wide text-slate-400">已固定</p>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {[
                ["浏览器", Search],
                ["Word", FileText],
                ["Excel", AppWindow],
                ["设置", Settings],
                ["资源管理器", Folder],
                ["截图", Image],
              ].map(([name, IconComp]) => (
                <button
                  key={name as string}
                  className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-white/10"
                  onClick={() => setToast(`打开 ${name}（真实系统在开始菜单里找它）`)}
                >
                  <IconComp className="h-6 w-6 text-sky-300" />
                  <span className="text-[10px]">{name as string}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 border-t border-white/10 pt-2">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-white/10"
                onClick={() => setToast("关机（模拟）")}
              >
                <Power className="h-4 w-4" /> 关机
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShortcutTrainer() {
  const [pressed, setPressed] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "control" || key === "alt" || key === "shift" || key === "meta") return;
      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
      if (e.altKey) parts.push("Alt");
      if (e.shiftKey) parts.push("Shift");
      parts.push(key.toUpperCase() === key ? key : key.toUpperCase());
      const combo = parts.join("+");
      setPressed([combo]);

      if (e.ctrlKey && key === "c") {
        setCopied("这是一段被复制的内容");
        setLog((l) => [combo + "：内容已复制到剪贴板（模拟）", ...l].slice(0, 5));
      } else if (e.ctrlKey && key === "v") {
        setLog((l) => [combo + "：粘贴了「" + (copied ?? "剪贴板内容") + "」", ...l].slice(0, 5));
      } else if (e.altKey && key === "tab") {
        setLog((l) => [combo + "：切换到下一个窗口（模拟）", ...l].slice(0, 5));
      } else if (e.ctrlKey && key === "z") {
        setLog((l) => [combo + "：撤销上一步（模拟）", ...l].slice(0, 5));
      } else if (e.ctrlKey && key === "s") {
        setLog((l) => [combo + "：保存成功（模拟）", ...l].slice(0, 5));
      } else if (e.ctrlKey && key === "a") {
        setLog((l) => [combo + "：全选（模拟）", ...l].slice(0, 5));
      } else if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        setLog((l) => [key + "：普通按键", ...l].slice(0, 5));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copied]);

  const targets = ["Ctrl+C 复制", "Ctrl+V 粘贴", "Alt+Tab 切换", "Ctrl+Z 撤销", "Ctrl+S 保存", "Ctrl+A 全选"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-1.5 text-slate-300">
          <Keyboard className="h-5 w-5" />
          <span className="text-sm">在这个区域按快捷键试试</span>
        </div>
        <div className="flex min-h-[64px] items-center justify-center gap-2">
          {pressed.length ? (
            <motion.span
              key={pressed[0]}
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-lg bg-sky-400/20 px-4 py-2 font-mono text-lg font-bold text-sky-200 shadow-[0_0_30px_rgba(56,189,248,0.35)]"
            >
              {pressed[0]}
            </motion.span>
          ) : (
            <span className="text-sm text-slate-500">等待按键…</span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {targets.map((t) => (
            <Badge key={t} variant="outline" className="border-white/15 text-slate-300">{t}</Badge>
          ))}
        </div>
      </div>
      {log.length > 0 && (
        <div className="space-y-1.5">
          {log.map((line, i) => (
            <motion.p
              key={line + i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg bg-muted px-3 py-2 text-xs"
            >
              {line}
            </motion.p>
          ))}
        </div>
      )}
    </div>
  );
}

function FileManager() {
  const [files, setFiles] = useState<WinFile[]>(initialFiles);
  const [trash, setTrash] = useState<WinFile[]>([]);
  const [clipboard, setClipboard] = useState<WinFile | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  function copy() {
    if (!selected) return setToast("先点选一个文件");
    const f = files.find((x) => x.id === selected);
    if (f) {
      setClipboard(f);
      setToast(`已复制 ${f.name}`);
    }
  }

  function paste() {
    if (!clipboard) return setToast("剪贴板为空");
    setFiles((fs) => [
      { ...clipboard, id: clipboard.id + "-copy", name: `副本-${clipboard.name}` },
      ...fs,
    ]);
    setToast(`粘贴了 ${clipboard.name}`);
  }

  function remove() {
    if (!selected) return setToast("先点选一个文件");
    const f = files.find((x) => x.id === selected);
    if (!f) return;
    setFiles((fs) => fs.filter((x) => x.id !== selected));
    setTrash((t) => [f, ...t]);
    setSelected(null);
    setToast(`${f.name} 已移到回收站`);
  }

  function restore() {
    const f = trash[0];
    if (!f) return setToast("回收站是空的");
    setTrash((t) => t.slice(1));
    setFiles((fs) => [f, ...fs]);
    setToast(`${f.name} 已还原`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={copy} disabled={!selected}>
          <Copy className="h-3.5 w-3.5" /> 复制
        </Button>
        <Button size="sm" variant="outline" onClick={paste}>
          <ClipboardPaste className="h-3.5 w-3.5" /> 粘贴
        </Button>
        <Button size="sm" variant="outline" onClick={remove} disabled={!selected}>
          <Trash2 className="h-3.5 w-3.5" /> 删除
        </Button>
        <Button size="sm" variant="ghost" onClick={restore}>
          <Undo2 className="h-3.5 w-3.5" /> 还原 ({trash.length})
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-muted/40 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <FolderOpen className="h-4 w-4 text-amber-500" /> 桌面 / 文件
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {files.map((f) => {
              const IconComp = fileIcon[f.type];
              return (
                <button
                  key={f.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", f.id);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    if (id && id !== f.id) {
                      setFiles((fs) => {
                        const arr = [...fs];
                        const from = arr.findIndex((x) => x.id === id);
                        const to = arr.findIndex((x) => x.id === f.id);
                        if (from < 0 || to < 0) return fs;
                        const [moved] = arr.splice(from, 1);
                        arr.splice(to, 0, moved);
                        return arr;
                      });
                      setToast("文件已移动/排序");
                    }
                  }}
                  onClick={() => setSelected(selected === f.id ? null : f.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border p-2 text-left transition-all",
                    selected === f.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  <IconComp className={cn("h-5 w-5", fileColor[f.type])} />
                  <span className="line-clamp-2 text-[11px] leading-tight">{f.name}</span>
                </button>
              );
            })}
            {files.length === 0 && <p className="col-span-full py-6 text-center text-xs text-muted-foreground">桌面空了，去回收站还原。</p>}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">提示：可以拖动文件改变顺序，点选后复制/删除。</p>
        </div>
        <div className="rounded-xl border border-dashed p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Trash2 className="h-4 w-4 text-rose-400" /> 回收站
          </p>
          {trash.length ? (
            <div className="space-y-1.5">
              {trash.map((f) => {
                const IconComp = fileIcon[f.type];
                return (
                  <div key={f.id} className="flex items-center gap-2 rounded-lg border bg-background px-2 py-1.5 text-xs">
                    <IconComp className={cn("h-4 w-4", fileColor[f.type])} />
                    {f.name}
                    <button className="ml-auto text-primary" onClick={restore}>还原</button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-xs text-muted-foreground">回收站为空。删除的文件在这里可以还原。</p>
          )}
        </div>
      </div>
      {toast && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
        >
          <Check className="mr-1 inline h-3.5 w-3.5" />
          {toast}
        </motion.p>
      )}
    </div>
  );
}

export function WindowsSimulator({ kind }: { kind: string }) {
  const content = useMemo(() => {
    if (kind === "shortcuts") return <ShortcutTrainer />;
    if (kind === "file-manager") return <FileManager />;
    return <DesktopSimulator />;
  }, [kind]);

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">{content}</CardContent>
    </Card>
  );
}
