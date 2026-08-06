"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLearningStore } from "@/lib/stores/learning-store";
import { useNotesStore } from "@/lib/stores/notes-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useAssistantStore } from "@/lib/stores/assistant-store";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
        },
      }),
  );
  useEffect(() => {
    useLearningStore.persist.rehydrate();
    useNotesStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
    useAssistantStore.persist.rehydrate();
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster richColors position="top-center" />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
