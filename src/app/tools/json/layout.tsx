import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter",
  description: "Format, validate, and minify JSON data with syntax highlighting.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
