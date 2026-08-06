import { describe, expect, it } from "vitest";
import { fillBlank, matchQuestion, orderQuestion, singleChoice, trueFalse } from "@/content/helpers";
import { configBudgetScore, fitCategory, gradeQuiz, isAnswerCorrect } from "@/lib/quiz";

describe("quiz engine", () => {
  it("grades single choice", () => {
    const q = singleChoice("q1", "1+1=?", ["1", "2", "3"], 1, "二");
    expect(isAnswerCorrect(q, 1)).toBe(true);
    expect(isAnswerCorrect(q, 0)).toBe(false);
  });

  it("grades true false", () => {
    const q = trueFalse("q2", "天空是蓝色的", true, "通常");
    expect(isAnswerCorrect(q, true)).toBe(true);
    expect(isAnswerCorrect(q, 0)).toBe(true);
    expect(isAnswerCorrect(q, 1)).toBe(false);
  });

  it("grades false boolean with option index", () => {
    const q = trueFalse("q2b", "内存越大就一定越快", false, "错误");
    expect(isAnswerCorrect(q, 1)).toBe(true);
    expect(isAnswerCorrect(q, 0)).toBe(false);
    expect(isAnswerCorrect(q, false)).toBe(true);
  });

  it("grades fill with acceptable answers", () => {
    const q = fillBlank("q3", "内存英文缩写", "RAM", "随机存取存储器", ["ram", "内存"]);
    expect(isAnswerCorrect(q, "RAM")).toBe(true);
    expect(isAnswerCorrect(q, "内存")).toBe(true);
    expect(isAnswerCorrect(q, "CPU")).toBe(false);
  });

  it("grades order questions", () => {
    const q = orderQuestion("q4", "排序", ["A", "B", "C"], [0, 1, 2], "顺序");
    expect(isAnswerCorrect(q, [0, 1, 2])).toBe(true);
    expect(isAnswerCorrect(q, [2, 1, 0])).toBe(false);
  });

  it("grades match questions", () => {
    const q = matchQuestion("q5", "连线", ["CPU", "硬盘"], ["处理器", "存储器"], [0, 1], "映射");
    expect(isAnswerCorrect(q, [0, 1])).toBe(true);
  });

  it("produces results with explanations", () => {
    const q = singleChoice("q6", "x", ["a", "b"], 1, "解析");
    const results = gradeQuiz([q], [{ questionId: "q6", value: 0 }]);
    expect(results[0].correct).toBe(false);
    expect(results[0].explanation).toBe("解析");
  });

  it("computes config budget and category", () => {
    const total = configBudgetScore({ cpu: 1500, ram: 480, ssd: 620, gpu: 0 });
    expect(total).toBe(2600);
    expect(fitCategory(2600)).toBe("基础学习本");
    expect(fitCategory(8000)).toBe("性能学习本");
  });
});
