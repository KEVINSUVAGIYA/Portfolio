import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salesforce SmartKit User Guide",
  description: "Complete user guide for the Salesforce SmartKit extension.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
