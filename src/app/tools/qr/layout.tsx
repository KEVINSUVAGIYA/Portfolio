import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generate QR codes from any text or URL instantly.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
