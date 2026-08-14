"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Flame,
  Gamepad2,
  GraduationCap,
  Play,
  Route,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { modules, totalLessons, totalMinutes } from "@/content";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLearningStore, useStreak } from "@/lib/stores/learning-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMinutes } from "@/lib/utils";

function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    const particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0005,
      vy: -Math.random() * 0.0004,
      r: Math.random() * 1.8 + 0.6,
      hue: 210 + Math.random() * 60,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = 1;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 0.55)`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function Hero() {
  const completed = useLearningStore((s) => s.completedLessons.length);
  const streak = useStreak();
  const hydrated = useHydrated();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section ref={ref} className="relative flex min-h-[88vh] items-center justify-center overflow-hidden">
      <div className="hero-grid absolute inset-0" />
      <div className="absolute -left-32 top-10 h-96 w-96 animate-aurora rounded-full bg-sky-500/25 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] animate-aurora rounded-full bg-indigo-500/25 blur-3xl [animation-delay:-4s]" />
      <ParticleField />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-xs font-medium backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          12 个模块 · {totalLessons} 节课 · 从零到进阶
          {hydrated && streak > 0 && (
            <span className="flex items-center gap-1 text-orange-500">
              <Flame className="h-3.5 w-3.5" /> {streak} 天
            </span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl"
        >
          Computer Academy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-balance mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
        >
          从零开始，系统学习电脑知识。
          <br />
          你的第一门大学电脑课。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={hydrated && completed > 0 ? "/dashboard" : "/courses/01-intro/what-is-a-computer/"}
            className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40"
          >
            {hydrated && completed > 0 ? <GraduationCap className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {hydrated && completed > 0 ? "继续学习" : "开始学习"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/courses/" className="inline-flex h-12 items-center gap-2 rounded-lg border bg-background/60 px-6 text-sm font-semibold backdrop-blur transition-colors hover:bg-accent">
            <BookOpen className="h-4 w-4" />
            浏览课程
          </Link>
          <Link href="/roadmap/" className="inline-flex h-12 items-center gap-2 rounded-lg px-6 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <Route className="h-4 w-4" />
            学习路线
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: BookOpen, label: "课程", value: `${totalLessons} 节` },
            { icon: Gamepad2, label: "交互模拟", value: "18+" },
            { icon: Trophy, label: "成就徽章", value: "8 枚" },
            { icon: Flame, label: "学习时长", value: formatMinutes(totalMinutes) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-background/55 p-3 backdrop-blur">
              <s.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function ModuleShowcase() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">课程模块</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">十二大模块，一条成长路线</h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
            内容由 AI 辅助生成，仅供学习参考；系统与安全操作请以官方文档为准，重要数据记得先备份。
          </p>
        </div>
        <Link href="/courses/" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          查看全部课程 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m, i) => (
          <motion.div
            key={m.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (i % 3) * 0.08 }}
          >
            <Link href={`/courses/${m.slug}/`} className="card-hover block h-full">
              <Card className="h-full overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${m.accent} text-white shadow`}>
                      <Icon name={m.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">模块 {String(m.order).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.subtitle}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="secondary">{m.lessons.length} 节课</Badge>
                    <Badge variant="outline">{m.difficulty}</Badge>
                    {m.draft && <Badge variant="warning">完善中</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = useMemo(
    () => [
      {
        icon: Gamepad2,
        title: "玩着学",
        text: "拆 CPU、拖文件、模拟 Windows、练 Prompt，每节课都有能动手的交互。",
      },
      {
        icon: Trophy,
        title: "学得有反馈",
        text: "XP、等级、徽章、连学天数、每日任务，学习像游戏一样有进度感。",
      },
      {
        icon: Compass,
        title: "路径清晰",
        text: "从认识硬件到 AI 与编程，12 个模块环环相扣，跟着路线走不迷路。",
      },
      {
        icon: Sparkles,
        title: "AI 助教",
        text: "右下角随时提问，解释概念、出练习题、推荐课程，离线也能用。",
      },
    ],
    [],
  );

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border bg-background p-5"
          >
            <f.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 p-8 text-white sm:p-12">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">现在就开始你的第一课</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
              不用懂术语，不用有基础。十分钟后，你就能说出 CPU、内存和硬盘分别干什么。
            </p>
          </div>
          <Link
            href="/courses/01-intro/what-is-a-computer/"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-slate-900 shadow-xl transition-transform hover:scale-[1.02]"
          >
            <Play className="h-4 w-4" /> 开始学习
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <>
      <Hero />
      <ModuleShowcase />
      <Features />
      <Cta />
    </>
  );
}
