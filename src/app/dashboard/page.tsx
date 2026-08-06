import { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = { title: "学习台" };

export default function DashboardPage() {
  return <DashboardView />;
}
