import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";

interface SettingsState {
  theme: ThemeMode;
  dailyGoalMinutes: number;
  reduceMotion: boolean;
  showGuide: boolean;
  setTheme: (theme: ThemeMode) => void;
  setDailyGoal: (minutes: number) => void;
  setReduceMotion: (value: boolean) => void;
  setShowGuide: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      dailyGoalMinutes: 20,
      reduceMotion: false,
      showGuide: true,
      setTheme: (theme) => set({ theme }),
      setDailyGoal: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setShowGuide: (showGuide) => set({ showGuide }),
    }),
    { name: "computer-academy-settings", version: 1, skipHydration: true },
  ),
);
