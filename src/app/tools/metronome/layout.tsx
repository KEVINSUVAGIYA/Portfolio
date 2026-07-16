import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Precise Online Metronome | Free Tap Tempo Tool";
const path = "/tools/metronome";
const url = `${SITE_URL}${path}`;
const description = "Keep perfect tempo with our free, highly accurate online metronome. Customize beats per minute (BPM), tap tempo speeds, and rhythm pattern accents.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["online metronome", "free metronome", "tap tempo bpm", "music tempo keeper", "digital metronome", "tempo click track"],
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
