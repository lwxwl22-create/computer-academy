import { describe, expect, it } from "vitest";
import { allLessons, modules, totalLessons } from "@/content";

describe("course content integrity", () => {
  it("contains 12 modules and 108 lessons", () => {
    expect(modules).toHaveLength(12);
    expect(totalLessons).toBe(108);
  });

  it("every lesson has goals, content, quiz and exercises", () => {
    for (const lesson of allLessons()) {
      expect(lesson.lesson.goals.length).toBeGreaterThan(0);
      expect(lesson.lesson.content.length).toBeGreaterThan(0);
      expect(lesson.lesson.quiz.length).toBeGreaterThan(0);
      expect(lesson.lesson.exercises.length).toBeGreaterThan(0);
      expect(lesson.lesson.summary.length).toBeGreaterThan(0);
    }
  });

  it("lesson slugs are unique within modules", () => {
    for (const mod of modules) {
      const slugs = mod.lessons.map((l) => l.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});
