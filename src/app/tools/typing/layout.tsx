import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Speed Test",
  description: "Test your typing speed and accuracy with real-time WPM tracking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
