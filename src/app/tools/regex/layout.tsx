import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester",
  description: "Test and debug regular expressions with live matching and highlighting.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
