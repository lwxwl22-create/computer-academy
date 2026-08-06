"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Compass,
  GraduationCap,
  Home,
  Menu,
  Search,
  Settings,
  ShieldQuestion,
  Sprout,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { AssistantChat } from "@/components/assistant/assistant-chat";
import { useLearningStore } from "@/lib/stores/learning-store";
import { levelProgress } from "@/lib/gamification";
import { useHydrated } from "@/hooks/use-hydrated";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/dashboard", label: "学习台", icon: GraduationCap },
  { href: "/courses", label: "课程库", icon: BookOpen },
  { href: "/roadmap", label: "学习路线", icon: Compass },
  { href: "/skill-tree", label: "技能树", icon: Sprout },
  { href: "/achievements", label: "成就", icon: Trophy },
  { href: "/stats", label: "统计", icon: BarChart3 },
  { href: "/wrong-answers", label: "错题本", icon: ShieldQuestion },
  { href: "/settings", label: "设置", icon: Settings },
];

function NavLinks({ onNavigate, mobile }: { onNavigate?: () => void; mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              mobile && "w-full",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function XpPill() {
  const xp = useLearningStore((s) => s.xp);
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const { level } = levelProgress(xp);
  return (
    <Link
      href="/stats"
      className="hidden items-center gap-1.5 rounded-full border bg-secondary/60 px-3 py-1 text-xs font-medium sm:flex"
    >
      <span className="text-primary">Lv.{level}</span>
      <span className="text-muted-foreground">{xp} XP</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <button
              className="rounded-md p-2 hover:bg-accent md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="打开菜单"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-bold tracking-tight sm:text-base">
                Computer <span className="text-primary">Academy</span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-1.5">
            <XpPill />
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() =>
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))
              }
              aria-label="搜索"
              className="hidden sm:inline-flex"
            >
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t p-2 md:hidden">
            <div className="flex flex-col">
              <NavLinks mobile onNavigate={() => setMobileOpen(false)} />
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row">
          <p>Computer Academy · 从零开始，系统学习电脑知识。</p>
          <p className="text-xs">数据保存在本机浏览器，随时继续学习。</p>
        </div>
      </footer>

      <CommandMenu />
      <AssistantChat />
    </div>
  );
}
