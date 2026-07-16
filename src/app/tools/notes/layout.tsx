import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Collaborative Shared Notes & Live Text Pad";
const path = "/tools/notes";
const url = `${SITE_URL}${path}`;
const description = "Create a temporary live-synced notepad online. Share the URL to collaborate and edit text together with others in real-time. No signup required.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["collaborative notepad", "shared notes online", "live sync notes", "cloud text editor", "real-time text sharing", "anonymous text doc"],
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
