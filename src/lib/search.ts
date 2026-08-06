import { CourseModule, Lesson } from "@/lib/schema";

export interface SearchHit {
  kind: "module" | "lesson";
  moduleSlug: string;
  lessonSlug?: string;
  title: string;
  subtitle: string;
  path: string;
  score: number;
  tags: string[];
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[\s，。、；：！？·"'-]+/g, "")
    .trim();
}

export function fuzzyMatch(query: string, text: string): number {
  const q = normalize(query);
  const t = normalize(text);
  if (!q) return 0;
  if (t.includes(q)) return 1 + q.length / t.length;
  let score = 0;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi += 1;
      score += 1;
    }
  }
  if (qi === q.length) return 0.5 + score / q.length;
  return 0;
}

function lessonText(lesson: Lesson) {
  const blocks = lesson.content
    .map((b) => {
      if (b.type === "paragraph") return b.text;
      if (b.type === "heading") return b.text;
      if (b.type === "list") return b.items.join(" ");
      if (b.type === "callout") return `${b.title ?? ""} ${b.text}`;
      if (b.type === "card") return `${b.title} ${b.text}`;
      if (b.type === "analogy") return `${b.title} ${b.text}`;
      if (b.type === "code") return b.code;
      if (b.type === "mermaid") return b.chart;
      return "";
    })
    .join(" ");
  return [
    lesson.title,
    lesson.subtitle ?? "",
    lesson.prerequisites ?? "",
    lesson.goals.join(" "),
    blocks,
    lesson.summary.join(" "),
    lesson.mistakes.join(" "),
    lesson.tags.join(" "),
  ].join(" ");
}

export function searchAll(modules: CourseModule[], query: string): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const mod of modules) {
    const moduleScore = Math.max(
      fuzzyMatch(q, mod.title),
      fuzzyMatch(q, mod.description),
      fuzzyMatch(q, mod.subtitle),
    );
    if (moduleScore > 0) {
      hits.push({
        kind: "module",
        moduleSlug: mod.slug,
        title: mod.title,
        subtitle: `${mod.lessons.length} 节课 · ${mod.difficulty}`,
        path: `/courses/${mod.slug}/`,
        score: moduleScore,
        tags: [mod.difficulty],
      });
    }
    for (const lesson of mod.lessons) {
      const score = Math.max(
        fuzzyMatch(q, lesson.title),
        fuzzyMatch(q, lessonText(lesson)),
        fuzzyMatch(q, lesson.tags.join(" ")),
      );
      if (score > 0) {
        hits.push({
          kind: "lesson",
          moduleSlug: mod.slug,
          lessonSlug: lesson.slug,
          title: lesson.title,
          subtitle: `${mod.title} · ${lesson.durationMinutes} 分钟`,
          path: `/courses/${mod.slug}/${lesson.slug}/`,
          score,
          tags: lesson.tags,
        });
      }
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 24);
}
