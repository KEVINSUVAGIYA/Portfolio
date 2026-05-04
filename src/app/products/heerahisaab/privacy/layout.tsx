import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeeraHisaab Privacy Policy",
  description: "Privacy policy for the HeeraHisaab application.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
