import { knowledgeIndex, modules } from "@/content";

export interface AssistantProvider {
  reply(input: string): Promise<string>;
}

function findKnowledge(input: string) {
  const q = input.toLowerCase();
  const terms = knowledgeIndex();
  const scored = terms
    .map((t) => {
      let score = 0;
      for (const k of [t.term, ...t.tags]) {
        if (q.includes(k)) score += k.length;
      }
      return { term: t, score };
    })
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.term;
}

function findCourse(input: string) {
  const q = input.toLowerCase();
  for (const mod of modules) {
    const match = mod.lessons.find((l) => {
      const text = `${l.title} ${l.subtitle ?? ""} ${l.tags.join(" ")}`.toLowerCase();
      return q.split(/\s+/).filter(Boolean).some((w) => text.includes(w));
    });
    if (match) return { module: mod, lesson: match };
  }
  return null;
}

function buildReply(input: string) {
  const q = input.toLowerCase();

  if (/练习|出题|测试|quiz/i.test(q)) {
    const course = findCourse(input);
    if (course) {
      const qs = course.lesson.quiz[0];
      return `根据《${course.lesson.title}》给你出一道题：\n\n${qs.prompt}\n\n想让我讲解答案或解析，直接说「解析」。`;
    }
    return "我可以按课程出题。试试说「出一道 CPU 的题」或「关于 Excel 公式的练习题」。";
  }

  if (/总结|概括|重点/.test(q)) {
    const course = findCourse(input);
    if (course) {
      return `《${course.lesson.title}》重点总结：\n${course.lesson.summary.map((s) => `- ${s}`).join("\n")}`;
    }
    return "告诉我想总结哪一课，例如「总结 Windows 快捷键」或「总结 SSD 那一课」。";
  }

  if (/推荐|学什么|课程/.test(q)) {
    const recommended = modules.slice(0, 3).flatMap((m) =>
      m.lessons.slice(0, 2).map((l) => ({ m, l })),
    );
    return `推荐你从这些课开始：\n${recommended
      .map(({ m, l }) => `- 《${l.title}》（${m.title}）`)
      .join("\n")}\n\n零基础建议先学「认识电脑」模块，再学 Windows。`;
  }

  const knowledge = findKnowledge(input);
  if (knowledge) {
    return `${knowledge.answer}\n\n你可以去对应课程深入学：先看看「${knowledge.term}」相关课程，遇到具体问题继续问我。`;
  }

  const course = findCourse(input);
  if (course) {
    return `你在问《${course.lesson.title}》吧？这节课的核心是：${course.lesson.goals.join("；")}。\n\n主要知识点：\n${course.lesson.summary
      .map((s) => `- ${s}`)
      .join("\n")}\n\n想让我展开讲某一点，或者出几道题，都可以直接说。`;
  }

  return "这个问题我还在学习中。你可以问我这些方向：硬件（CPU、内存、SSD、显卡）、Windows 操作、Office、网络与安全、买电脑、AI 工具、编程入门。或者试试「推荐课程」「出题」。";
}

export class LocalAssistantProvider implements AssistantProvider {
  async reply(input: string) {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 600));
    return buildReply(input);
  }
}

export function createAssistantProvider(): AssistantProvider {
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return {
      async reply(input) {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: input }],
          }),
        });
        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? "抱歉，我没有拿到回答。";
      },
    };
  }
  return new LocalAssistantProvider();
}

export const assistant = createAssistantProvider();
