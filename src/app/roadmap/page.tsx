import { Metadata } from "next";
import { RoadmapView } from "@/components/course/roadmap-view";

export const metadata: Metadata = { title: "学习路线" };

export default function RoadmapPage() {
  return <RoadmapView />;
}
