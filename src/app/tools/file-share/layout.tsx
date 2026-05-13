import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sooom - File Transfer | Instant P2P Sharing",
  description: "Sooom is the fastest way to share files directly between devices. No server, no clouds, just pure P2P speed in your browser.",
};

export default function FileShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
