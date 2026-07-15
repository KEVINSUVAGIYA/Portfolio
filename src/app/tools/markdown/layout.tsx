import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Live Markdown Editor & Real-Time Previewer";
const path = "/tools/markdown";
const url = `${SITE_URL}${path}`;
const description = "Write, edit, and preview Markdown markup online in real time. Features split screen, syntax highlighting, and easy export to HTML format.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["markdown editor", "live markdown preview", "markdown to html", "online markdown viewer", "markdown markup parser"],
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
