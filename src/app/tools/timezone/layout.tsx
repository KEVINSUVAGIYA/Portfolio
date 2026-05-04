import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Clock",
  description: "Compare time across multiple timezones at a glance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
