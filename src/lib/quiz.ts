import { QuizQuestion, WrongAnswerRecord } from "@/lib/schema";

export interface QuizAnswer {
  questionId: string;
  value: unknown;
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

function formatValue(value: unknown, question: QuizQuestion): string {
  if (question.type === "boolean") return value === true ? "正确" : "错误";
  if (question.type === "single") {
    const idx = value as number;
    return question.options[idx] ?? "";
  }
  if (question.type === "multiple") {
    return (value as number[]).map((i) => question.options[i]).join("、");
  }
  if (question.type === "fill") return String(value);
  if (question.type === "order") {
    const order = value as number[];
    return order.map((i) => question.items[i]).join(" → ");
  }
  if (question.type === "match") {
    const pairs = value as number[];
    return pairs.map((rightIdx, leftIdx) => `${question.left[leftIdx]} → ${question.right[rightIdx]}`).join("；");
  }
  return "";
}

function correctLabel(question: QuizQuestion): string {
  if (question.type === "boolean") return question.answer === true ? "正确" : "错误";
  if (question.type === "single") return question.options[question.answer as number];
  if (question.type === "multiple") return (question.answer as number[]).map((i) => question.options[i]).join("、");
  if (question.type === "fill") return question.answer;
  if (question.type === "order") return question.answer.map((i) => question.items[i]).join(" → ");
  if (question.type === "match") return question.answer.map((rightIdx, leftIdx) => `${question.left[leftIdx]} → ${question.right[rightIdx]}`).join("；");
  return "";
}

export function isAnswerCorrect(question: QuizQuestion, value: unknown): boolean {
  if (question.type === "single" || question.type === "boolean") {
    return question.answer === value;
  }
  if (question.type === "multiple") {
    const given = (value as number[] | undefined) ?? [];
    const expected = (question.answer as number[]).slice().sort();
    return given.slice().sort().join(",") === expected.join(",");
  }
  if (question.type === "fill") {
    const given = String(value ?? "").trim().toLowerCase();
    const acceptable = (question.acceptable ?? []).concat(question.answer).map((a) => a.toLowerCase());
    return acceptable.includes(given);
  }
  if (question.type === "order") {
    const given = (value as number[] | undefined) ?? [];
    return given.join(",") === (question.answer as number[]).join(",");
  }
  if (question.type === "match") {
    const given = (value as number[] | undefined) ?? [];
    return given.join(",") === (question.answer as number[]).join(",");
  }
  return false;
}

export function gradeQuiz(questions: QuizQuestion[], answers: QuizAnswer[]): QuizResult[] {
  return questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    const value = answer?.value;
    const correct = isAnswerCorrect(q, value);
    return {
      questionId: q.id,
      correct,
      userAnswer: formatValue(value, q),
      correctAnswer: correctLabel(q),
      explanation: q.explanation,
    };
  });
}

export function toWrongAnswerRecord(
  moduleSlug: string,
  lessonId: string,
  question: QuizQuestion,
  result: QuizResult,
  date: string,
): WrongAnswerRecord {
  return {
    id: `${lessonId}-${question.id}`,
    lessonId,
    moduleSlug,
    questionId: question.id,
    prompt: question.prompt,
    userAnswer: result.userAnswer,
    correctAnswer: result.correctAnswer,
    explanation: result.explanation,
    date,
  };
}

export function configBudgetScore(parts: { cpu: number; ram: number; ssd: number; gpu: number }) {
  return parts.cpu + parts.ram + parts.ssd + parts.gpu;
}

export function fitCategory(total: number) {
  if (total <= 4500) return "基础学习本";
  if (total <= 6500) return "均衡全能本";
  if (total <= 9000) return "性能学习本";
  return "创作/游戏本";
}
