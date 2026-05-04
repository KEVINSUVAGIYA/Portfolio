import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SipSync Privacy Policy",
  description: "Privacy policy for the SipSync Chrome extension.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
