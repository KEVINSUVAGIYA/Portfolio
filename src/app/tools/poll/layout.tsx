import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Create Real-time Polls & Instant Live Voting";
const path = "/tools/poll";
const url = `${SITE_URL}${path}`;
const description = "Launch a free anonymous poll in seconds. Share the link to gather votes from friends, colleagues, or groups with live updating graphic results.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["make a poll", "free online polling", "real time live vote", "anonymous survey tool", "instant poll maker", "collect group votes"],
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
