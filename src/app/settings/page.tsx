import { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "设置" };

export default function SettingsPage() {
  return <SettingsView />;
}
