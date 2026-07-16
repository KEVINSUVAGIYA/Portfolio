import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Global Meeting Time Planner & Scheduler";
const path = "/tools/meeting";
const url = `${SITE_URL}${path}`;
const description = "Coordinate and schedule meetings across multiple timezones. Find the perfect working hours overlap window for international teams easily.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["meeting time planner", "timezone coordinator", "timezone overlap finder", "team meeting scheduler", "world meeting clock"],
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
