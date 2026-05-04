import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Flight",
  description: "A mesmerizing flight visualization synced to audio frequencies.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
