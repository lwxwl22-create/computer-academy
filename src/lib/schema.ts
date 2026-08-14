export type Difficulty = "入门" | "基础" | "进阶";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; variant: "info" | "tip" | "warning"; title?: string; text: string }
  | { type: "card"; title: string; text: string; icon?: string }
  | { type: "analogy"; title: string; text: string }
  | { type: "code"; language: string; code: string; caption?: string }
  | { type: "mermaid"; chart: string; caption?: string }
  | { type: "simulator"; kind: SimulatorKey; title: string; description?: string };

export type QuizQuestion =
  | {
      id: string;
      type: "single" | "multiple" | "boolean";
      prompt: string;
      options: string[];
      answer: number | number[] | boolean;
      explanation: string;
    }
  | {
      id: string;
      type: "fill";
      prompt: string;
      answer: string;
      explanation: string;
      acceptable?: string[];
    }
  | {
      id: string;
      type: "order";
      prompt: string;
      items: string[];
      answer: number[];
      explanation: string;
    }
  | {
      id: string;
      type: "match";
      prompt: string;
      left: string[];
      right: string[];
      answer: number[];
      explanation: string;
    };

export interface LessonExercise {
  prompt: string;
  hint?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  subtitle?: string;
  durationMinutes: number;
  difficulty: Difficulty;
  prerequisites?: string;
  goals: string[];
  content: ContentBlock[];
  summary: string[];
  mistakes: string[];
  thinking: string[];
  exercises: LessonExercise[];
  quiz: QuizQuestion[];
  simulator?: SimulatorKey;
  tags: string[];
  draft?: boolean;
}

export interface CourseModule {
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accent: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  lessons: Lesson[];
  draft?: boolean;
}

export type SimulatorKey =
  | "cpu"
  | "memory"
  | "ssd"
  | "gpu"
  | "motherboard"
  | "windows-desktop"
  | "shortcuts"
  | "file-manager"
  | "word"
  | "excel"
  | "powerpoint"
  | "pdf"
  | "config-builder"
  | "maintenance"
  | "prompt-coach"
  | "python"
  | "html"
  | "ai-tools";

export interface WrongAnswerRecord {
  id: string;
  lessonId: string;
  moduleSlug: string;
  questionId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  date: string;
}

export interface DailyTask {
  id: string;
  label: string;
  target: number;
  progress: number;
  xp: number;
  done: boolean;
}

export interface Note {
  lessonId: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
}
