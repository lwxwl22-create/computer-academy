import { Metadata } from "next";
import { NotesView } from "@/components/notes/notes-view";

export const metadata: Metadata = { title: "笔记" };

export default function NotesPage() {
  return <NotesView />;
}
