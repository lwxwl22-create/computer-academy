import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface AssistantState {
  open: boolean;
  messages: ChatMessage[];
  setOpen: (open: boolean) => void;
  pushMessage: (role: "user" | "assistant", content: string) => void;
  clear: () => void;
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      open: false,
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "你好，我是电脑学院助教。可以问我 CPU、Windows、快捷键、Office、买电脑、AI、编程等问题。",
          time: new Date().toISOString(),
        },
      ],
      setOpen: (open) => set({ open }),
      pushMessage: (role, content) => {
        const message: ChatMessage = {
          id: uid(),
          role,
          content,
          time: new Date().toISOString(),
        };
        set({ messages: [...get().messages, message].slice(-60) });
      },
      clear: () => {
        set({
          messages: [
            {
              id: "welcome",
              role: "assistant",
              content: "聊天记录已清空。有什么想学的？",
              time: new Date().toISOString(),
            },
          ],
        });
      },
    }),
    { name: "computer-academy-assistant", version: 1, skipHydration: true },
  ),
);
