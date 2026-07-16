import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Programmer Calculator & Base Converter";
const path = "/tools/calc";
const url = `${SITE_URL}${path}`;
const description = "Convert numbers between Binary, Octal, Decimal, and Hexadecimal, and perform bitwise operations with our free online programmer calculator.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["programmer calculator", "binary calculator", "hex converter", "bitwise operations", "decimal to binary", "base converter online"],
  alternates: { canonical: path },
  openGraph: {
    title: `${toolName} | Sooom Tools`,
    description,
    url: path,
    siteName: "Sooom Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${toolName} | Sooom Tools`,
    description,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolName,
    "url": url,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": description
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
