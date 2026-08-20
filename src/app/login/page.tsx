import { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = { title: "登录" };

export default function LoginPage() {
  return <LoginView />;
}
