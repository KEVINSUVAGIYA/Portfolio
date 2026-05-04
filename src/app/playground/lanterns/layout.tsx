import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lanterns",
  description: "Release glowing lanterns into a serene night sky.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
