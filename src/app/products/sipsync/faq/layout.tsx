import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SipSync FAQ",
  description: "Frequently asked questions about the SipSync Chrome extension.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
