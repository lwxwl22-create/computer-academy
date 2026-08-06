"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { QuizQuestion } from "@/lib/schema";
import { gradeQuiz, toWrongAnswerRecord } from "@/lib/quiz";
import { useLearningStore } from "@/lib/stores/learning-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, todayKey } from "@/lib/utils";

type Answers = Record<string, unknown>;

function QuestionView({
  q,
  value,
  onChange,
  submitted,
  correct,
}: {
  q: QuizQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
  submitted: boolean;
  correct?: boolean;
}) {
  if (q.type === "single" || q.type === "boolean") {
    return (
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const selected = value === i;
          const isRight =
            submitted &&
            (q.type === "boolean" ? (i === 0 ? q.answer === true : q.answer === false) : q.answer === i);
          const isWrongPick = submitted && selected && q.answer !== i;
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => onChange(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                selected && !submitted && "border-primary bg-primary/10",
                isRight && "border-emerald-500 bg-emerald-500/10",
                isWrongPick && "border-rose-500 bg-rose-500/10",
                submitted && !isRight && !isWrongPick && "opacity-60",
              )}
            >
              <span className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]",
                isRight ? "border-emerald-500 text-emerald-500" : isWrongPick ? "border-rose-500 text-rose-500" : "border-muted-foreground",
              )}>
                {isRight ? <Check className="h-3 w-3" /> : isWrongPick ? <X className="h-3 w-3" /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    );
  }
  if (q.type === "multiple") {
    const chosen = (value as number[]) ?? [];
    return (
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const selected = chosen.includes(i);
          const isRight = submitted && (q.answer as number[]).includes(i);
          const isWrongPick = submitted && selected && !(q.answer as number[]).includes(i);
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() =>
                onChange(selected ? chosen.filter((x) => x !== i) : [...chosen, i])
              }
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                selected && !submitted && "border-primary bg-primary/10",
                isRight && "border-emerald-500 bg-emerald-500/10",
                isWrongPick && "border-rose-500 bg-rose-500/10",
              )}
            >
              <span className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded border text-[10px]",
                isRight ? "border-emerald-500 text-emerald-500" : isWrongPick ? "border-rose-500 text-rose-500" : "border-muted-foreground",
              )}>
                {isRight ? <Check className="h-3 w-3" /> : isWrongPick ? <X className="h-3 w-3" /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
        <p className="text-xs text-muted-foreground">可多选</p>
      </div>
    );
  }
  if (q.type === "fill") {
    return (
      <Input
        value={String(value ?? "")}
        disabled={submitted}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入答案"
        className={cn(
          submitted && (correct ? "border-emerald-500" : "border-rose-500"),
        )}
      />
    );
  }
  if (q.type === "order") {
    const order = (value as number[]) ?? [];
    const remaining = q.items.map((_, i) => i).filter((i) => !order.includes(i));
    const isRight = submitted && order.join(",") === q.answer.join(",");
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {remaining.map((i) => (
            <button
              key={i}
              disabled={submitted}
              onClick={() => onChange([...order, i])}
              className="rounded-full border px-3 py-1.5 text-xs hover:bg-accent"
            >
              {q.items[i]}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          {order.map((i, pos) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{pos + 1}</span>
              <span className="flex-1">{q.items[i]}</span>
              <button
                disabled={submitted}
                onClick={() => onChange(order.filter((x) => x !== i))}
                className="text-muted-foreground hover:text-foreground"
                aria-label="移除"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {order.length === 0 && <p className="text-xs text-muted-foreground">按顺序点击下方选项来排序</p>}
        </div>
        {submitted && <p className={cn("text-xs font-medium", isRight ? "text-emerald-500" : "text-rose-500")}>{isRight ? "顺序正确" : "顺序不对"}</p>}
      </div>
    );
  }
  if (q.type === "match") {
    const pairs = (value as number[]) ?? [];
    const remainingRight = q.right.map((_, i) => i).filter((i) => !pairs.includes(i));
    const isRight = submitted && pairs.join(",") === q.answer.join(",");
    return (
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {q.left.map((l, li) => (
            <div key={li} className="rounded-lg border bg-muted/30 p-2.5 text-sm">
              <p className="font-medium">{l}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {li < pairs.length && pairs[li] !== undefined && (
                  <Badge variant="secondary" className="gap-1">
                    → {q.right[pairs[li]]}
                    <button disabled={submitted} onClick={() => onChange(pairs.filter((_, i) => i !== li))} aria-label="移除">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {remainingRight.map((ri) => (
                  <button
                    key={ri}
                    disabled={submitted}
                    onClick={() => {
                      const next = [...pairs];
                      next[li] = ri;
                      onChange(next);
                    }}
                    className="rounded-full border px-2 py-0.5 text-[11px] hover:bg-accent"
                  >
                    {q.right[ri]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {submitted && <p className={cn("text-xs font-medium", isRight ? "text-emerald-500" : "text-rose-500")}>{isRight ? "匹配正确" : "匹配有误，解析见下"}</p>}
      </div>
    );
  }
  return null;
}

export function QuizRunner({
  moduleSlug,
  lessonId,
  questions,
}: {
  moduleSlug: string;
  lessonId: string;
  questions: QuizQuestion[];
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const recordQuiz = useLearningStore((s) => s.recordQuiz);

  const results = useMemo(
    () => (submitted ? gradeQuiz(questions, Object.entries(answers).map(([questionId, value]) => ({ questionId, value }))) : []),
    [submitted, answers, questions],
  );

  const correctCount = results.filter((r) => r.correct).length;

  function submit() {
    const filled = questions.filter((q) => {
      const v = answers[q.id];
      if (q.type === "multiple") return Array.isArray(v) && v.length > 0;
      return v !== undefined && v !== "" && v !== null;
    }).length;
    if (filled < questions.length) {
      toast.info("还有题目没答完");
      return;
    }
    const graded = gradeQuiz(questions, Object.entries(answers).map(([questionId, value]) => ({ questionId, value })));
    const wrong = questions
      .map((q) => {
        const r = graded.find((g) => g.questionId === q.id)!;
        return { q, r };
      })
      .filter(({ r }) => !r.correct)
      .map(({ q, r }) => toWrongAnswerRecord(moduleSlug, lessonId, q, r, todayKey()));
    recordQuiz(correctCount || graded.filter((r) => r.correct).length, questions.length, wrong);
    setSubmitted(true);
    if (graded.filter((r) => r.correct).length === questions.length) {
      toast.success(`测验满分！+${questions.length * 15} XP`);
    } else {
      toast(`答对 ${graded.filter((r) => r.correct).length}/${questions.length} 题，错题已记入错题本`);
    }
  }

  if (!questions.length) return null;

  return (
    <Card className="my-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent">
        <CardTitle className="text-lg">随堂测验</CardTitle>
        <p className="text-sm text-muted-foreground">每题答对 +15 XP，答错自动进入错题本。</p>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-5">
        {questions.map((q, qi) => {
          const result = results.find((r) => r.questionId === q.id);
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-sm font-semibold leading-6">
                  <span className="mr-2 text-muted-foreground">{qi + 1}.</span>
                  {q.prompt}
                </p>
                <Badge variant={result?.correct ? "success" : "outline"} className="shrink-0">
                  {result ? (result.correct ? "正确" : "错误") : typeLabel(q.type)}
                </Badge>
              </div>
              <QuestionView
                q={q}
                value={answers[q.id]}
                onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                submitted={submitted}
                correct={result?.correct}
              />
              <AnimatePresence>
                {submitted && result && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs leading-6">
                      <p className="font-medium">正确答案：{result.correctAnswer}</p>
                      {!result.correct && <p className="text-rose-500">你的答案：{result.userAnswer || "未作答"}</p>}
                      <p className="mt-1 text-muted-foreground">解析：{result.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <div className="flex flex-wrap items-center gap-3">
          {submitted ? (
            <>
              <Badge variant={correctCount === questions.length ? "success" : "warning"} className="px-3 py-1.5">
                得分：{correctCount}/{questions.length}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> 重做
              </Button>
            </>
          ) : (
            <Button onClick={submit} size="lg" className="w-full sm:w-auto">
              提交答案
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function typeLabel(type: QuizQuestion["type"]) {
  return {
    single: "单选",
    multiple: "多选",
    boolean: "判断",
    fill: "填空",
    order: "排序",
    match: "连线",
  }[type];
}
