import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Custom QR Code Generator & Designer";
const path = "/tools/qr";
const url = `${SITE_URL}${path}`;
const description = "Generate custom branded QR codes with custom logos, pick foreground & background colors, add custom styles, and download in high resolution PNG or SVG formats.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["qr code generator", "make qr code", "custom qr code logo", "download qr code image", "generate dynamic qr", "branded qr code generator"],
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
