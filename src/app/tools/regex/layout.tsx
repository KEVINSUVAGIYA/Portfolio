import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Interactive Regex Tester, Matcher & Debugger";
const path = "/tools/regex";
const url = `${SITE_URL}${path}`;
const description = "Test, match, and debug Regular Expressions in real time. Features syntax highlighting, match summaries, capture group tables, and substitution replace tool.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["regex tester", "regular expression matcher", "regex debugger", "pattern matching test", "test regex regex101 online", "js regex test"],
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
