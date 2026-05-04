import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meeting Planner",
  description: "Find the best overlap window across multiple timezones.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
