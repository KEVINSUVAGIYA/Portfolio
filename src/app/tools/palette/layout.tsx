import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "CSS Color Palette Generator & Harmonizer";
const path = "/tools/palette";
const url = `${SITE_URL}${path}`;
const description = "Generate beautiful custom color palettes, match CSS contrast colors, design sleek gradients, and export CSS styling codes for web design projects.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["color palette generator", "css color picker", "hex code generator", "web design colors", "ui color harmonizer", "contrast checker tool"],
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
