import { describe, expect, it } from "vitest";
import { badgeProgress, computeStreak, levelFromXp, levelProgress } from "@/lib/gamification";

describe("gamification", () => {
  it("calculates levels from xp", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(80)).toBe(2);
    expect(levelFromXp(320)).toBe(3);
  });

  it("reports level progress between thresholds", () => {
    const p = levelProgress(160);
    expect(p.level).toBe(2);
    expect(p.progress).toBeGreaterThan(0);
    expect(p.progress).toBeLessThan(1);
  });

  it("computes streak from consecutive days", () => {
    const today = new Date();
    const key = (offset: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offset);
      return d.toISOString().slice(0, 10);
    };
    expect(computeStreak([key(0), key(1), key(2)])).toBe(3);
    expect(computeStreak([key(1), key(2)])).toBe(0);
  });

  it("unlocks badges by thresholds", () => {
    const badges = badgeProgress(500, 10, 3, 1);
    const first = badges.find((b) => b.id === "first-lesson");
    const xp = badges.find((b) => b.id === "xp-500");
    expect(first?.unlocked).toBe(true);
    expect(xp?.unlocked).toBe(true);
  });
});
