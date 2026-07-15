import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Online Image Compressor | Bulk Optimize JPEG, PNG & WebP";
const path = "/tools/imagecompress";
const url = `${SITE_URL}${path}`;
const description = "Compress and optimize your image files directly in your browser. Reduce the file size of JPEGs, PNGs, and WebPs locally, securely, and instantly.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["compress image", "jpeg optimizer", "png compressor", "shrink image size", "webp converter", "local image compression"],
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
