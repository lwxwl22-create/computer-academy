"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/lib/supabase/client";
import { useLearningStore } from "@/lib/stores/learning-store";
import { useNotesStore } from "@/lib/stores/notes-store";

type AuthStatus = "loading" | "signed-in" | "signed-out";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  lastSyncedAt: string | null;
  configured: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  syncLocalToCloud: () => Promise<boolean>;
  syncCloudToLocal: () => Promise<boolean>;
  clearError: () => void;
}

function cloudData() {
  return {
    learning: useLearningStore.getState(),
    notes: useNotesStore.getState().notes,
    exportedAt: new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: "loading",
      error: null,
      lastSyncedAt: null,
      configured: supabaseConfigured,

      initialize: async () => {
        if (!supabase) {
          set({ status: "signed-out", configured: false, user: null });
          return;
        }
        const { data } = await supabase.auth.getSession();
        set({ user: data.session?.user ?? null, status: data.session ? "signed-in" : "signed-out" });
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user ?? null, status: session ? "signed-in" : "signed-out" });
        });
      },

      signIn: async (email, password) => {
        if (!supabase) {
          set({ error: "Supabase 尚未配置：请在项目设置里填入 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY。" });
          return false;
        }
        set({ error: null });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          set({ error: error.message });
          return false;
        }
        set({ user: data.user, status: "signed-in" });
        return true;
      },

      signUp: async (email, password) => {
        if (!supabase) {
          set({ error: "Supabase 尚未配置：请在项目设置里填入 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY。" });
          return false;
        }
        set({ error: null });
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          set({ error: error.message });
          return false;
        }
        if (data.session) {
          set({ user: data.user, status: "signed-in" });
        } else {
          set({ error: "注册成功，请前往邮箱完成验证后登录。" });
        }
        return true;
      },

      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
        set({ user: null, status: "signed-out", lastSyncedAt: null });
      },

      syncLocalToCloud: async () => {
        if (!supabase || !get().user) {
          set({ error: "请先登录，并确认 Supabase 已配置。" });
          return false;
        }
        const { error } = await supabase.from("user_data").upsert(
          {
            user_id: get().user!.id,
            data: cloudData(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
        if (error) {
          set({ error: error.message });
          return false;
        }
        set({ error: null, lastSyncedAt: new Date().toISOString() });
        return true;
      },

      syncCloudToLocal: async () => {
        if (!supabase || !get().user) {
          set({ error: "请先登录，并确认 Supabase 已配置。" });
          return false;
        }
        const { data, error } = await supabase
          .from("user_data")
          .select("data, updated_at")
          .eq("user_id", get().user!.id)
          .maybeSingle();
        if (error) {
          set({ error: error.message });
          return false;
        }
        if (data?.data) {
          const remote = data.data as { learning?: Partial<ReturnType<typeof cloudData>["learning"]>; notes?: unknown[] };
          if (remote.learning) {
            useLearningStore.setState(remote.learning as Parameters<typeof useLearningStore.setState>[0]);
          }
          if (Array.isArray(remote.notes)) {
            useNotesStore.setState({ notes: remote.notes as never });
          }
        }
        set({ error: null, lastSyncedAt: new Date().toISOString() });
        return true;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "computer-academy-auth",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({
        user: state.user,
        status: state.status,
        lastSyncedAt: state.lastSyncedAt,
        configured: state.configured,
      }),
    },
  ),
);
