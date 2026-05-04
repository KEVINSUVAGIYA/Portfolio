import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeeraHisaab User Guide",
  description: "Complete user guide for HeeraHisaab diamond accounting.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
