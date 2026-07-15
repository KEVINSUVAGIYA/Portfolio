import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Base64 & URL Encoder/Decoder Online";
const path = "/tools/encoder";
const url = `${SITE_URL}${path}`;
const description = "Encode and decode text strings using Base64, URL encoding, Hex, HTML Entities, and UTF-8 formats safely and locally in your browser.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["base64 encoder", "base64 decoder", "url encode online", "url decode", "base64 to text", "hex decoder", "html entity encoder"],
  alternates: { canonical: url },
  openGraph: {
    title: `${toolName} | Sooom Tools`,
    description,
    url,
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
