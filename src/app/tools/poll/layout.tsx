import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Poll",
  description: "Create real-time polls and share them instantly. No account needed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
