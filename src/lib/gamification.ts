import { DailyTask } from "@/lib/schema";

export const XP_PER_LESSON = 50;
export const XP_PER_QUIZ = 15;
export const XP_PER_TASK = 20;

export function levelFromXp(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 80)) + 1;
  return level;
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const currentBase = (level - 1) * (level - 1) * 80;
  const nextBase = level * level * 80;
  const progress = (xp - currentBase) / (nextBase - currentBase);
  return {
    level,
    currentBase,
    nextBase,
    progress: Math.max(0, Math.min(1, progress)),
  };
}

export function nextLessonXp(totalXp: number, lessonCount: number) {
  return totalXp + XP_PER_LESSON * lessonCount;
}

export function buildDefaultTasks(): DailyTask[] {
  return [
    { id: "task-learn", label: "完成 1 节课", target: 1, progress: 0, xp: XP_PER_TASK, done: false },
    { id: "task-minutes", label: "学习 15 分钟", target: 15, progress: 0, xp: XP_PER_TASK, done: false },
    { id: "task-quiz", label: "答对 5 道题", target: 5, progress: 0, xp: XP_PER_TASK, done: false },
    { id: "task-streak", label: "连续学习 3 天", target: 3, progress: 0, xp: XP_PER_TASK * 2, done: false },
  ];
}

export function computeStreak(history: string[]): number {
  if (!history.length) return 0;
  const days = new Set(history);
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 400; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      return 0;
    } else {
      break;
    }
  }
  return streak;
}

export function badgeProgress(
  xp: number,
  completedLessons: number,
  streak: number,
  modulesCompleted: number,
) {
  return [
    { id: "first-lesson", title: "第一课", description: "完成第一节课", icon: "Rocket", target: 1, value: Math.min(1, completedLessons / 1), unlocked: completedLessons >= 1 },
    { id: "ten-lessons", title: "十课成瘾", description: "完成 10 节课", icon: "BookOpenCheck", target: 10, value: completedLessons / 10, unlocked: completedLessons >= 10 },
    { id: "twenty-five-lessons", title: "四分之一", description: "完成 25 节课", icon: "Milestone", target: 25, value: completedLessons / 25, unlocked: completedLessons >= 25 },
    { id: "module-master", title: "模块大师", description: "完成任意一个完整模块", icon: "Trophy", target: 1, value: Math.min(1, modulesCompleted / 1), unlocked: modulesCompleted >= 1 },
    { id: "streak-3", title: "三日之约", description: "连续学习 3 天", icon: "Flame", target: 3, value: streak / 3, unlocked: streak >= 3 },
    { id: "streak-7", title: "一周奇迹", description: "连续学习 7 天", icon: "CalendarCheck", target: 7, value: streak / 7, unlocked: streak >= 7 },
    { id: "xp-500", title: "五百星火", description: "累计获得 500 XP", icon: "Sparkles", target: 500, value: xp / 500, unlocked: xp >= 500 },
    { id: "xp-2000", title: "两千远征", description: "累计获得 2000 XP", icon: "Gem", target: 2000, value: xp / 2000, unlocked: xp >= 2000 },
  ];
}
