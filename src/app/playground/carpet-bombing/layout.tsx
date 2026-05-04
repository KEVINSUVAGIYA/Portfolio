import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carpet Bombing",
  description: "An arcade-style carpet bombing game built with HTML5 Canvas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
