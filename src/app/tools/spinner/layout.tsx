import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Random Decision Wheel Spinner Online";
const path = "/tools/spinner";
const url = `${SITE_URL}${path}`;
const description = "Spin the wheel to make random choices or decisions easily. Customize list options, names, colors, and spin with elegant physics sound effects and animations.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["decision wheel", "spin the wheel", "random choice generator", "lucky wheel online", "yes or no spinner", "spin name picker"],
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
