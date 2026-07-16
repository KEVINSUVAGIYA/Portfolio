import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Typing Speed Test & Words Per Minute (WPM)";
const path = "/tools/typing";
const url = `${SITE_URL}${path}`;
const description = "Test and measure your typing speed and accuracy. Take the 1-minute speed typing test to calculate your precise WPM performance rating locally.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["typing speed test", "wpm test", "check typing accuracy", "words per minute calculator", "typing practice online", "keyboard speed test"],
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
