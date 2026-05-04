import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sticky Notes",
  description: "Collaborative sticky notes synced in real-time via Firebase.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
