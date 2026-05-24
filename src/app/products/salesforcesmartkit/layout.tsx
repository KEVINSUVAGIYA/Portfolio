import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salesforce SmartKit",
  description: "The ultimate admin Chrome extension for Salesforce. Features SOQL IDE, SmartEdit, and Command Palette.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
