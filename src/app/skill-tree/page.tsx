import { Metadata } from "next";
import { SkillTree } from "@/components/gamification/gamification";

export const metadata: Metadata = { title: "技能树" };

export default function SkillTreePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">技能树</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">按顺序点亮每个模块</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          模块按推荐顺序排列，完成上一模块的任意课程即可解锁下一个模块。
        </p>
      </div>
      <SkillTree />
    </div>
  );
}
