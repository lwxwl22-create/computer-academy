"use client";

import { motion } from "framer-motion";
import { Cpu, Gauge, HardDrive, MemoryStick, MonitorPlay } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fitCategory } from "@/lib/quiz";

const parts = {
  cpu: {
    label: "CPU",
    icon: Cpu,
    options: [
      { id: "i3", name: "i3 入门", price: 900 },
      { id: "i5", name: "i5 均衡", price: 1500 },
      { id: "i7", name: "i7 高性能", price: 2600 },
      { id: "r9", name: "R9 旗舰", price: 3600 },
    ],
  },
  ram: {
    label: "内存",
    icon: MemoryStick,
    options: [
      { id: "8", name: "8GB", price: 260 },
      { id: "16", name: "16GB", price: 480 },
      { id: "32", name: "32GB", price: 900 },
    ],
  },
  ssd: {
    label: "硬盘",
    icon: HardDrive,
    options: [
      { id: "512", name: "512GB SSD", price: 350 },
      { id: "1t", name: "1TB SSD", price: 620 },
      { id: "2t", name: "2TB SSD", price: 1150 },
    ],
  },
  gpu: {
    label: "显卡",
    icon: MonitorPlay,
    options: [
      { id: "igpu", name: "核显", price: 0 },
      { id: "4050", name: "RTX 4050", price: 1800 },
      { id: "4060", name: "RTX 4060", price: 2400 },
      { id: "4070", name: "RTX 4070", price: 3800 },
    ],
  },
} as const;

type PartKey = keyof typeof parts;

export function ConfigBuilder() {
  const [pick, setPick] = useState<Record<PartKey, string>>({ cpu: "i5", ram: "16", ssd: "1t", gpu: "igpu" });

  const total = useMemo(() => {
    const price = (key: PartKey) => parts[key].options.find((o) => o.id === pick[key])?.price ?? 0;
    return price("cpu") + price("ram") + price("ssd") + price("gpu");
  }, [pick]);

  const category = fitCategory(total);
  const ratio = Math.min(100, (total / 12000) * 100);

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(parts) as PartKey[]).map((key) => {
            const part = parts[key];
            return (
              <div key={key} className="rounded-xl border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <part.icon className="h-4 w-4 text-primary" />
                  {part.label}
                </div>
                <Select value={pick[key]} onValueChange={(v) => setPick((p) => ({ ...p, [key]: v }))}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {part.options.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name} · ¥{o.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        <motion.div
          key={total}
          initial={{ scale: 0.96, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs text-slate-300">整机参考价（不含显示器）</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                ¥{total.toLocaleString()}
              </p>
            </div>
            <Badge className="bg-white/15 text-white">{category}</Badge>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <motion.div
              animate={{ width: `${ratio}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
            />
          </div>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-300">
            <Gauge className="h-3.5 w-3.5" />
            预算条：{total <= 4500 ? "基础学习本" : total <= 6500 ? "均衡全能本" : total <= 9000 ? "性能学习本" : "创作/游戏本"}
          </p>
        </motion.div>

        <p className="text-xs text-muted-foreground">
          这是简化模拟器：拖动/选择不同部件，实时估算预算与适合人群。真实选购还要考虑屏幕、散热、接口与品牌售后。
        </p>
      </CardContent>
    </Card>
  );
}
