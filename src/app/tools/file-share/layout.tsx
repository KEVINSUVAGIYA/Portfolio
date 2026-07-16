import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

const toolName = "Sooom File Transfer | Instant Secure P2P Sharing";
const path = "/tools/file-share";
const url = `${SITE_URL}${path}`;
const description = "Share files directly between devices with maximum WebRTC P2P speeds. No server uploads, no cloud limits, completely secure and private.";

export const metadata: Metadata = {
  title: `${toolName} | Sooom Tools`,
  description,
  keywords: ["p2p file sharing", "send files online", "web file transfer", "peer to peer file share", "secure file transfer", "instant file drop"],
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
