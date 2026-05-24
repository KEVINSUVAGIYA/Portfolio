import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salesforce SmartKit Privacy Policy",
  description: "Privacy policy for Salesforce SmartKit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
