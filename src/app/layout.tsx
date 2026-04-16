import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Spotlight } from "@/components/ui/Spotlight";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { cn } from "@/lib/utils";
import { BASE_PATH, SITE_URL } from "@/lib/constants";
import { SpeedInsights } from "@vercel/speed-insights/next";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kevin Suvagiya | Salesforce Developer",
  description: "Salesforce Developer | Curious Explorer. Building the engines behind Salesforce clouds. Specializing in bi-directional integrations, high-performance LWC, and custom AppExchange solutions.",
  keywords: ["Salesforce Developer", "LWC", "Apex", "Salesforce Certified", "Web Developer", "React", "Next.js", "Portfolio", "Kevin Suvagiya", "Salesforce Build Release Engineer", "AppExchange", "Lightning Web Components", "SipSync", "HeeraHisaab", "Web Tools", "Real-time Collaboration", "World Clock", "Peer-to-Peer Chat", "JSON Formatter"],
  authors: [{ name: "Kevin Suvagiya", url: SITE_URL }],
  creator: "Kevin Suvagiya",
  applicationName: "Kevin Suvagiya Portfolio",
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Kevin Suvagiya | Salesforce Developer",
    description: "Salesforce Developer | Curious Explorer. Building the engines behind Salesforce clouds.",
    url: SITE_URL,
    siteName: "Kevin Suvagiya Portfolio",
    images: [
      {
        url: `${BASE_PATH}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Kevin Suvagiya - Salesforce Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Suvagiya | Salesforce Developer",
    description: "Salesforce Developer & LWC Specialist. View my work and experience.",
    creator: "@kevin__suvagiya",
    images: [
      {
        url: `${BASE_PATH}/opengraph-image.png`,
        alt: "Kevin Suvagiya - Salesforce Developer Portfolio",
      },
    ],
  },
  icons: {
    icon: `${BASE_PATH}/icon.png`,
  },
  other: {
    "content-language": "en",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kevin Suvagiya",
  url: SITE_URL,
  jobTitle: "Salesforce Developer",
  description:
    "Salesforce Developer specializing in bi-directional integrations, high-performance LWC, and custom AppExchange solutions.",
  image: `${SITE_URL}${BASE_PATH}/opengraph-image.png`,
  sameAs: [
    "https://github.com/KEVINSUVAGIYA",
    "https://www.linkedin.com/in/kevin-suvagiya/",
    "https://x.com/kevin__suvagiya",
    "https://kevinsuvagiya.medium.com/",
    "https://www.salesforce.com/trailblazer/kevinsuvagiya",
    "https://www.instagram.com/kevin_suvagiya02/",
  ],
  knowsAbout: [
    "Salesforce",
    "Lightning Web Components",
    "Apex",
    "React",
    "Next.js",
    "TypeScript",
    "AppExchange",
  ],
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kevin Suvagiya — Portfolio",
  url: SITE_URL,
  description:
    "Portfolio of Kevin Suvagiya — Salesforce Developer, builder of SipSync and HeeraHisaab.",
  author: {
    "@type": "Person",
    name: "Kevin Suvagiya",
  },
  potentialAction: [
    {
      "@type": "ViewAction",
      name: "Products",
      target: `${SITE_URL}/#products`,
    },
    {
      "@type": "ViewAction",
      name: "Projects",
      target: `${SITE_URL}/#projects`,
    },
    {
      "@type": "ViewAction",
      name: "Experience",
      target: `${SITE_URL}/#experience`,
    },
    {
      "@type": "ViewAction",
      name: "Contact",
      target: `${SITE_URL}/#contact`,
    },
    {
      "@type": "ViewAction",
      name: "SipSync",
      target: `${SITE_URL}/products/sipsync`,
    },
    {
      "@type": "ViewAction",
      name: "HeeraHisaab",
      target: `${SITE_URL}/products/heerahisaab`,
    },
    {
      "@type": "ViewAction",
      name: "Web Tools Suite",
      target: `${SITE_URL}/tools`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body suppressHydrationWarning className={cn(inter.className, "bg-slate-950 min-h-screen relative overflow-x-hidden")}>
        <ParticleBackground />
        <Spotlight className="hidden md:block" />
        <div className="relative z-10 selection:bg-cyan-500/30">
          {children}
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
