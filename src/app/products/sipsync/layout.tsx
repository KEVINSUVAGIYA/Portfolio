import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SipSync",
  description: "Smart hydration tracking Chrome extension with real-time analytics.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
