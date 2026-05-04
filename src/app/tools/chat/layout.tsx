import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instant Chat",
  description: "Peer-to-peer chat rooms powered by Firebase. No signup, no login required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
