import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decision Spinner",
  description: "Spin the wheel to make random decisions. Fun and fair.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
