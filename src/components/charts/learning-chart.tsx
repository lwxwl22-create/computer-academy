"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useLearningStore } from "@/lib/stores/learning-store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export function LearningChart() {
  const studyDays = useLearningStore((s) => s.studyDays);
  const data = [...studyDays].reverse().slice(-14);

  return (
    <div className="h-56">
      <Line
        data={{
          labels: data.map((d) => d.date.slice(5)),
          datasets: [
            {
              label: "学习分钟",
              data: data.map((d) => d.minutes),
              borderColor: "#6366f1",
              backgroundColor: "rgba(99,102,241,0.15)",
              fill: true,
              tension: 0.35,
              pointRadius: 3,
            },
          ],
        }}
        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
      />
    </div>
  );
}

export function ModuleProgressChart({ progress }: { progress: { title: string; value: number }[] }) {
  return (
    <div className="h-56">
      <Bar
        data={{
          labels: progress.map((p) => p.title),
          datasets: [
            {
              label: "完成率 %",
              data: progress.map((p) => Math.round(p.value * 100)),
              backgroundColor: "rgba(99,102,241,0.65)",
              borderRadius: 6,
            },
          ],
        }}
        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { max: 100 } } }}
      />
    </div>
  );
}

export function DifficultyChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-48">
      <Doughnut
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"],
              borderWidth: 0,
            },
          ],
        }}
        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
      />
    </div>
  );
}
