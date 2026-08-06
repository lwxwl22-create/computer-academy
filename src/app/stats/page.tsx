import { Metadata } from "next";
import { StatsView } from "@/components/dashboard/stats-view";

export const metadata: Metadata = { title: "统计" };

export default function StatsPage() {
  return <StatsView />;
}
