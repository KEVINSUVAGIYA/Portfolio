import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Encoder / Decoder",
  description: "Encode and decode Base64, URL, and HTML entities instantly.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
