import type { Metadata } from "next";
import { ToolsAuthWrapper } from "./ToolsAuthWrapper";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Developer Tools & Web Utilities | Sooom Tools",
  description: "Explore a secure, fast, and feature-rich collection of free developer tools including formatters, P2P file sharing, collaborative whiteboard, metronomes, regex tester, and more.",
  keywords: ["developer tools", "web utilities", "p2p file sharing", "collaborative whiteboard", "regex tester", "json formatter", "metronome online", "free web tools"],
  alternates: {
    canonical: `${SITE_URL}/tools`,
  },
  openGraph: {
    title: "Free Developer Tools & Web Utilities | Sooom Tools",
    description: "Explore a secure, fast, and feature-rich collection of free developer tools including formatters, P2P file sharing, collaborative whiteboard, metronomes, regex tester, and more.",
    url: `${SITE_URL}/tools`,
    siteName: "Sooom Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Developer Tools & Web Utilities | Sooom Tools",
    description: "Explore a secure, fast, and feature-rich collection of free developer tools including formatters, P2P file sharing, collaborative whiteboard, metronomes, regex tester, and more.",
  }
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <ToolsAuthWrapper>{children}</ToolsAuthWrapper>;
}
