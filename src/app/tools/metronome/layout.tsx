import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metronome",
  description: "A precise digital metronome for musicians and producers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
