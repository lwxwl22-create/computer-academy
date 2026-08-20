"use client";

import { AlertCircle, CloudUpload, KeyRound, Loader2, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginView() {
  const router = useRouter();
  const { signIn, signUp, error, clearError, configured } = useAuthStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    clearError();
    if (!email.trim() || password.length < 6) {
      useAuthStore.setState({ error: "请输入邮箱，密码至少 6 位。" });
      return;
    }
    if (mode === "signup" && password !== confirm) {
      useAuthStore.setState({ error: "两次输入的密码不一致。" });
      return;
    }
    setBusy(true);
    const ok = mode === "login" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (ok) router.push("/dashboard/");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/15 to-transparent text-center">
          <CardTitle className="text-xl">账号登录</CardTitle>
          <p className="text-sm text-muted-foreground">登录后可把学习进度、笔记与 XP 同步到云端。</p>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {!configured && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              当前还没有配置 Supabase。填入项目 URL 与 anon key 后，登录与云同步才会真正启用；在这之前你可以先体验界面。
            </div>
          )}

          <div className="grid grid-cols-2 rounded-lg border p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); clearError(); }}
                className={cn(
                  "rounded-md py-1.5 text-sm font-medium transition-colors",
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "登录" : "注册"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  className="pl-9"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>
            </div>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="confirm">确认密码</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="再输入一次"
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-destructive/10 p-2.5 text-xs leading-5 text-destructive">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {mode === "login" ? "登录并同步" : "注册账号"}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
            <CloudUpload className="h-4 w-4" />
            登录后首次同步会把你本机的学习数据上传到云端
          </div>
          <Badge variant="outline" className="w-full justify-center">Supabase Auth · 邮箱密码</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
