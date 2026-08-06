import { Metadata } from "next";
import { BadgeWall, XpLevelCard } from "@/components/gamification/gamification";

export const metadata: Metadata = { title: "成就" };

export default function AchievementsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
      <div>
        <p className="text-sm font-semibold text-primary">成就墙</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">徽章与等级</h1>
        <p className="mt-2 text-sm text-muted-foreground">完成课程、连续学习、积累 XP，逐个点亮它们。</p>
      </div>
      <XpLevelCard />
      <BadgeWall />
    </div>
  );
}
