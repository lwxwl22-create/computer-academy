"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHydrated } from "@/hooks/use-hydrated";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const hydrated = useHydrated();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="切换主题">
          {hydrated ? <Sun className="h-4 w-4 dark:hidden" /> : <Sun className="h-4 w-4" />}
          {hydrated ? <Moon className="hidden h-4 w-4 dark:block" /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>浅色</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>深色</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>跟随系统</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
