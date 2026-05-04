import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SipSync User Guide",
  description: "Complete user guide for the SipSync hydration tracker.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
