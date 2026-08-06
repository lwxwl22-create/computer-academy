import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLesson, lessonIndex, modules } from "@/content";
import { LessonRenderer } from "@/components/course/lesson-renderer";

export function generateStaticParams() {
  return modules.flatMap((m) => m.lessons.map((l) => ({ module: m.slug, lesson: l.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}): Promise<Metadata> {
  const { module, lesson } = await params;
  const data = getLesson(module, lesson);
  return { title: data ? data.title : "课程" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module, lesson } = await params;
  const mod = getLesson(module, lesson);
  const nav = lessonIndex(module, lesson);
  if (!mod || !nav.module) notFound();
  return (
    <LessonRenderer
      module={nav.module}
      lesson={mod}
      prevLesson={nav.prev}
      nextLesson={nav.next}
    />
  );
}
