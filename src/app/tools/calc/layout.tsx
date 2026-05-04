import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator",
  description: "A fast, elegant calculator right in your browser. No ads, no tracking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
