import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ripple Effect",
  description: "Create beautiful ripple animations with touch and mouse.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
