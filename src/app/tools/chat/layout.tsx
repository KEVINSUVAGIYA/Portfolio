import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Instant Private P2P Chat Room";
const path = "/tools/chat";
const url = `${SITE_URL}${path}`;
const description = "Create a temporary private chat room directly in your browser. Fully peer-to-peer and encrypted with no signup, no logs, and no central database.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["p2p chat", "private chatroom", "encrypted browser chat", "direct peer to peer chat", "temp chat room", "no signup chat"],
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
    "applicationCategory": "CommunicationApplication",
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
