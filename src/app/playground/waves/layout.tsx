import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sound Waves",
  description: "Visualize dynamic sound wave patterns in real-time.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
