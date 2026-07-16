import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Global Time Zone Converter & World Clock";
const path = "/tools/timezone";
const url = `${SITE_URL}${path}`;
const description = "Compare times in major cities worldwide, convert timezones dynamically, track GMT/UTC offsets, and coordinate international events smoothly.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["timezone converter", "world clock online", "time difference calculator", "compare timezones", "utc gmt offset tracker", "time zone mapper"],
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
