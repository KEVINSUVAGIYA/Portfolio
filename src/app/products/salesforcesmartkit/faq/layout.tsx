import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salesforce SmartKit FAQs",
  description: "Frequently Asked Questions about Salesforce SmartKit Chrome extension.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
