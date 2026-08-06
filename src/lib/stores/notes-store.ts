import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Note } from "@/lib/schema";

interface NotesState {
  notes: Note[];
  saveNote: (note: Omit<Note, "updatedAt">) => void;
  deleteNote: (lessonId: string) => void;
  setNoteTags: (lessonId: string, tags: string[]) => void;
  clearNotes: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      saveNote: (note) => {
        const notes = get().notes;
        const existing = notes.find((n) => n.lessonId === note.lessonId);
        const updated: Note = { ...note, updatedAt: new Date().toISOString() };
        set({
          notes: existing
            ? notes.map((n) => (n.lessonId === note.lessonId ? updated : n))
            : [updated, ...notes],
        });
      },
      deleteNote: (lessonId) => {
        set({ notes: get().notes.filter((n) => n.lessonId !== lessonId) });
      },
      setNoteTags: (lessonId, tags) => {
        set({
          notes: get().notes.map((n) =>
            n.lessonId === lessonId ? { ...n, tags, updatedAt: new Date().toISOString() } : n,
          ),
        });
      },
      clearNotes: () => set({ notes: [] }),
    }),
    { name: "computer-academy-notes", version: 1 },
  ),
);
