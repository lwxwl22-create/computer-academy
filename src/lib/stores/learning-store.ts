import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DailyTask,
  Note,
  WrongAnswerRecord,
} from "@/lib/schema";
import {
  XP_PER_LESSON,
  XP_PER_QUIZ,
  XP_PER_TASK,
  buildDefaultTasks,
  computeStreak,
} from "@/lib/gamification";
import { todayKey } from "@/lib/utils";

export interface StudyDay {
  date: string;
  minutes: number;
  lessons: number;
  xp: number;
  quizCorrect: number;
}

interface LearningState {
  completedLessons: string[];
  startedLessons: string[];
  lessonMinutes: Record<string, number>;
  favorites: string[];
  recentLessons: string[];
  totalMinutes: number;
  xp: number;
  studyDays: StudyDay[];
  dailyTasks: DailyTask[];
  lastActiveDate: string;
  streakDays: string[];
  wrongAnswers: WrongAnswerRecord[];
  quizCorrect: number;
  quizTotal: number;
  notes: Note[];
  markLessonStarted: (lessonId: string) => void;
  markLessonComplete: (lessonId: string, minutes: number) => void;
  toggleFavorite: (lessonId: string) => void;
  pushRecent: (lessonId: string) => void;
  addMinutes: (minutes: number) => void;
  addXp: (amount: number) => void;
  recordQuiz: (correct: number, total: number, wrong: WrongAnswerRecord[]) => void;
  toggleTask: (taskId: string) => void;
  resetDaily: () => void;
  clearAll: () => void;
}

function ensureDay(state: LearningState, date = todayKey()): LearningState {
  const existing = state.studyDays.find((d) => d.date === date);
  const studyDays = existing
    ? state.studyDays
    : [{ date, minutes: 0, lessons: 0, xp: 0, quizCorrect: 0 }, ...state.studyDays].slice(0, 90);
  return { ...state, studyDays };
}

function bumpTask(state: LearningState, taskId: string, amount = 1) {
  const dailyTasks = state.dailyTasks.map((t) =>
    t.id === taskId ? { ...t, progress: Math.min(t.target, t.progress + amount), done: t.progress + amount >= t.target } : t,
  );
  const newlyDone = dailyTasks.filter((t, i) => t.done && !state.dailyTasks[i]?.done);
  const taskXp = newlyDone.reduce((sum, t) => sum + t.xp, 0);
  return { dailyTasks, taskXp };
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      startedLessons: [],
      lessonMinutes: {},
      favorites: [],
      recentLessons: [],
      totalMinutes: 0,
      xp: 0,
      studyDays: [],
      dailyTasks: buildDefaultTasks(),
      lastActiveDate: "",
      streakDays: [],
      wrongAnswers: [],
      quizCorrect: 0,
      quizTotal: 0,
      notes: [],

      markLessonStarted: (lessonId) => {
        const state = get();
        if (state.startedLessons.includes(lessonId)) return;
        const date = todayKey();
        const streakDays = Array.from(new Set([...state.streakDays, date]));
        const next = ensureDay(
          {
            ...state,
            startedLessons: [...state.startedLessons, lessonId],
            streakDays,
            lastActiveDate: date,
          },
          date,
        );
        set(next);
      },

      markLessonComplete: (lessonId, minutes) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) {
          return;
        }
        const date = todayKey();
        const started = state.startedLessons.includes(lessonId)
          ? state.startedLessons
          : [...state.startedLessons, lessonId];
        const completedLessons = [...state.completedLessons, lessonId];
        const studyDays = state.studyDays.map((d) =>
          d.date === date ? { ...d, lessons: d.lessons + 1, minutes: d.minutes + minutes, xp: d.xp + XP_PER_LESSON } : d,
        );
        const taskResult = bumpTask(state, "task-learn");
        const minuteTask = bumpTask(
          { ...state, dailyTasks: taskResult.dailyTasks },
          "task-minutes",
          minutes,
        );
        const streakDays = Array.from(new Set([...state.streakDays, date]));
        const recentLessons = [lessonId, ...state.recentLessons.filter((id) => id !== lessonId)].slice(0, 12);
        set({
          ...state,
          startedLessons: started,
          completedLessons,
          recentLessons,
          totalMinutes: state.totalMinutes + minutes,
          xp: state.xp + XP_PER_LESSON + taskResult.taskXp + minuteTask.taskXp,
          studyDays,
          dailyTasks: minuteTask.dailyTasks,
          streakDays,
          lastActiveDate: date,
        });
      },

      toggleFavorite: (lessonId) => {
        const state = get();
        const favorites = state.favorites.includes(lessonId)
          ? state.favorites.filter((id) => id !== lessonId)
          : [...state.favorites, lessonId];
        set({ ...state, favorites });
      },

      pushRecent: (lessonId) => {
        const state = get();
        const recentLessons = [lessonId, ...state.recentLessons.filter((id) => id !== lessonId)].slice(0, 12);
        set({ ...state, recentLessons });
      },

      addMinutes: (minutes) => {
        const state = get();
        const date = todayKey();
        const studyDays = state.studyDays.map((d) =>
          d.date === date ? { ...d, minutes: d.minutes + minutes } : d,
        );
        const taskResult = bumpTask(state, "task-minutes", minutes);
        set({
          ...state,
          totalMinutes: state.totalMinutes + minutes,
          studyDays,
          xp: state.xp + taskResult.taskXp,
          dailyTasks: taskResult.dailyTasks,
          lastActiveDate: date,
        });
      },

      addXp: (amount) => {
        set({ xp: get().xp + amount });
      },

      recordQuiz: (correct, total, wrong) => {
        const state = get();
        const date = todayKey();
        const studyDays = state.studyDays.map((d) =>
          d.date === date ? { ...d, quizCorrect: d.quizCorrect + correct, xp: d.xp + correct * XP_PER_QUIZ } : d,
        );
        const taskResult = bumpTask(state, "task-quiz", correct);
        const existingIds = new Set(state.wrongAnswers.map((w) => w.id));
        const merged = wrong.filter((w) => !existingIds.has(w.id));
        set({
          ...state,
          quizCorrect: state.quizCorrect + correct,
          quizTotal: state.quizTotal + total,
          wrongAnswers: [...merged, ...state.wrongAnswers].slice(0, 100),
          studyDays,
          dailyTasks: taskResult.dailyTasks,
          xp: state.xp + correct * XP_PER_QUIZ + taskResult.taskXp,
        });
      },

      toggleTask: (taskId) => {
        const state = get();
        const dailyTasks = state.dailyTasks.map((t) =>
          t.id === taskId ? { ...t, done: !t.done, progress: t.done ? t.progress : t.target } : t,
        );
        const toggled = state.dailyTasks.find((t) => t.id === taskId);
        const xpDelta = toggled && !toggled.done ? XP_PER_TASK : 0;
        set({ ...state, dailyTasks, xp: state.xp + xpDelta });
      },

      resetDaily: () => {
        const state = get();
        set({ ...state, dailyTasks: buildDefaultTasks() });
      },

      clearAll: () => {
        set({
          completedLessons: [],
          startedLessons: [],
          lessonMinutes: {},
          favorites: [],
          recentLessons: [],
          totalMinutes: 0,
          xp: 0,
          studyDays: [],
          dailyTasks: buildDefaultTasks(),
          lastActiveDate: "",
          streakDays: [],
          wrongAnswers: [],
          quizCorrect: 0,
          quizTotal: 0,
          notes: [],
        });
      },
    }),
    {
      name: "computer-academy-learning",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        startedLessons: state.startedLessons,
        lessonMinutes: state.lessonMinutes,
        favorites: state.favorites,
        recentLessons: state.recentLessons,
        totalMinutes: state.totalMinutes,
        xp: state.xp,
        studyDays: state.studyDays,
        dailyTasks: state.dailyTasks,
        lastActiveDate: state.lastActiveDate,
        streakDays: state.streakDays,
        wrongAnswers: state.wrongAnswers,
        quizCorrect: state.quizCorrect,
        quizTotal: state.quizTotal,
        notes: state.notes,
      }),
    },
  ),
);

export function useStreak() {
  const streakDays = useLearningStore((s) => s.streakDays);
  return computeStreak(streakDays);
}

export function useLessonComplete(lessonId: string) {
  return useLearningStore((s) => s.completedLessons.includes(lessonId));
}

export function useModuleProgress(moduleSlug: string, lessonIds: string[]) {
  const completed = useLearningStore((s) => s.completedLessons);
  const done = lessonIds.filter((id) => completed.includes(id)).length;
  return { done, total: lessonIds.length, percent: lessonIds.length ? done / lessonIds.length : 0 };
}
