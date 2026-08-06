import { Metadata } from "next";
import { WrongAnswersView } from "@/components/course/wrong-answers-view";

export const metadata: Metadata = { title: "错题本" };

export default function WrongAnswersPage() {
  return <WrongAnswersView />;
}
