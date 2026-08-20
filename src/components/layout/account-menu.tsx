"use client";

import { LogIn, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const initialize = useAuthStore((s) => s.initialize);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!hydrated || status === "loading") return null;

  if (!user) {
    return (
      <Link href="/login/" className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-accent">
        <LogIn className="h-3.5 w-3.5" /> 登录
      </Link>
    );
  }

  const email = user.email ?? "账号";
  const initial = email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 items-center gap-2 rounded-full border bg-secondary/50 py-1 pl-1 pr-3 text-xs font-medium transition-colors hover:bg-accent">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {initial}
          </span>
          <span className="max-w-28 truncate">{email}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/settings/")}>
          <Settings className="h-4 w-4" /> 账号与云同步
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            toast.success("已退出登录");
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" /> 退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
