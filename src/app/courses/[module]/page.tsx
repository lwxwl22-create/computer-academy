import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getModule, modules } from "@/content";
import { ModulePage } from "@/components/course/module-page";

export function generateStaticParams() {
  return modules.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module } = await params;
  const mod = getModule(module);
  return { title: mod ? mod.title : "课程模块" };
}

export default async function CourseModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const mod = getModule(module);
  if (!mod) notFound();
  return <ModulePage mod={mod} />;
}
