import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaborative Whiteboard",
  description: "A real-time collaborative whiteboard for brainstorming and drawing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
