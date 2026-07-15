import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Collaborative Shared Whiteboard & Drawing Canvas";
const path = "/tools/whiteboard";
const url = `${SITE_URL}${path}`;
const description = "Draw and sketch collaboratively on a real-time digital whiteboard. Share the URL to draw together, design diagrams, or brainstorm with team members.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["online whiteboard", "shared canvas drawing", "team collaborative whiteboard", "virtual sketchpad", "real-time whiteboard sharing", "drawing board browser"],
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
