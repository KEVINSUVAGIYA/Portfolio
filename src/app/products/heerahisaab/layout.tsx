import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeeraHisaab",
  description: "A comprehensive diamond accounting and inventory management solution.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
