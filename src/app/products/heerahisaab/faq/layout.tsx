import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeeraHisaab FAQ",
  description: "Frequently asked questions about HeeraHisaab.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
