import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palette Generator",
  description: "Generate and explore beautiful color palettes for your projects.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
