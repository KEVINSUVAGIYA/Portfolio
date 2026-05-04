import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview",
  description: "Live markdown editor with instant preview and export.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
