import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Compress and optimize images directly in your browser. No uploads needed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
