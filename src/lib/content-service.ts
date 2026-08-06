"use client";

import { useQuery } from "@tanstack/react-query";
import { modules, totalLessons, totalMinutes } from "@/content";
import { CourseModule, Lesson } from "@/lib/schema";

function delay(ms = 350) {
  return new Promise((r) => setTimeout(r, ms));
}

export function useModules() {
  return useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      await delay();
      return modules as CourseModule[];
    },
  });
}

export function useLesson(moduleSlug: string, lessonSlug: string) {
  return useQuery({
    queryKey: ["lesson", moduleSlug, lessonSlug],
    queryFn: async () => {
      await delay(250);
      const mod = modules.find((m) => m.slug === moduleSlug);
      const lesson = mod?.lessons.find((l) => l.slug === lessonSlug);
      return { module: mod, lesson } as { module?: CourseModule; lesson?: Lesson };
    },
  });
}

export function useCourseStats() {
  return useQuery({
    queryKey: ["course-stats"],
    queryFn: async () => {
      await delay(200);
      return { totalLessons, totalMinutes };
    },
  });
}
