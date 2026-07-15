import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Stopwatch, Pomodoro Timer & Alarm Online";
const path = "/tools/timer";
const url = `${SITE_URL}${path}`;
const description = "A versatile, feature-rich online clock and timer utility. Features a high-accuracy stopwatch with lap tracking, customizable Pomodoro focus scheduler, and alarms.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["online timer", "pomodoro stopwatch", "countdown alarm", "custom timer browser", "lap stopwatch", "study focus timer"],
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
