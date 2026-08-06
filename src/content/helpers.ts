import {
  CourseModule,
  Difficulty,
  Lesson,
  QuizQuestion,
  SimulatorKey,
} from "@/lib/schema";

export interface QuickLessonOptions {
  slug: string;
  title: string;
  subtitle?: string;
  durationMinutes: number;
  difficulty: Difficulty;
  prerequisites?: string;
  goals: string[];
  overview: string;
  points: { title: string; text: string }[];
  analogy?: string;
  summary: string[];
  mistakes: string[];
  thinking: string[];
  exercises: string[];
  quiz: QuizQuestion[];
  tags: string[];
  simulator?: SimulatorKey;
  draft?: boolean;
}

export function quickLesson(opts: QuickLessonOptions): Lesson {
  return {
    slug: opts.slug,
    title: opts.title,
    subtitle: opts.subtitle,
    durationMinutes: opts.durationMinutes,
    difficulty: opts.difficulty,
    prerequisites: opts.prerequisites,
    goals: opts.goals,
    content: [
      { type: "paragraph", text: opts.overview },
      ...opts.points.map((p) => ({ type: "card" as const, title: p.title, text: p.text })),
      ...(opts.analogy
        ? [{ type: "analogy" as const, title: "生活类比", text: opts.analogy }]
        : []),
      ...(opts.simulator
        ? [
            {
              type: "simulator" as const,
              kind: opts.simulator,
              title: "动手试一试",
              description: "用下面的模拟器直观感受这一课的核心概念。",
            },
          ]
        : []),
      { type: "heading", text: "重点总结" },
      { type: "list", items: opts.summary },
      { type: "heading", text: "常见错误" },
      { type: "list", items: opts.mistakes },
    ],
    summary: opts.summary,
    mistakes: opts.mistakes,
    thinking: opts.thinking,
    exercises: opts.exercises.map((prompt) => ({ prompt })),
    quiz: opts.quiz,
    tags: opts.tags,
    simulator: opts.simulator,
    draft: opts.draft,
  };
}

export function moduleMeta(opts: {
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accent: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  draft?: boolean;
}): Omit<CourseModule, "lessons"> {
  return opts;
}

export function singleChoice(
  id: string,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
): QuizQuestion {
  return { id, type: "single", prompt, options, answer, explanation };
}

export function multipleChoice(
  id: string,
  prompt: string,
  options: string[],
  answer: number[],
  explanation: string,
): QuizQuestion {
  return { id, type: "multiple", prompt, options, answer, explanation };
}

export function trueFalse(
  id: string,
  prompt: string,
  answer: boolean,
  explanation: string,
): QuizQuestion {
  return { id, type: "boolean", prompt, options: ["正确", "错误"], answer, explanation };
}

export function fillBlank(
  id: string,
  prompt: string,
  answer: string,
  explanation: string,
  acceptable?: string[],
): QuizQuestion {
  return { id, type: "fill", prompt, answer, explanation, acceptable };
}

export function orderQuestion(
  id: string,
  prompt: string,
  items: string[],
  answer: number[],
  explanation: string,
): QuizQuestion {
  return { id, type: "order", prompt, items, answer, explanation };
}

export function matchQuestion(
  id: string,
  prompt: string,
  left: string[],
  right: string[],
  answer: number[],
  explanation: string,
): QuizQuestion {
  return { id, type: "match", prompt, left, right, answer, explanation };
}
