import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Particle Galaxy",
  description: "An interactive particle system forming cosmic patterns.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
