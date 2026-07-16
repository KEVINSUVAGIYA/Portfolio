import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "JSON Formatter, Validator & Beautifier Online";
const path = "/tools/json";
const url = `${SITE_URL}${path}`;
const description = "Format, validate, parse, and beautify raw JSON data online. Features syntax highlighting, error detection, minification, and visual tree view.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["json formatter", "json validator", "beautify json online", "parse json", "validate json syntax", "json parser", "json minifier"],
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
