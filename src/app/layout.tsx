import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Spotlight } from "@/components/ui/Spotlight";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kevinSuvagiya.github.io/Portfolio"),
  title: "Kevin Suvagiya | Salesforce Build & Release Engineer",
  description: "Salesforce Developer & LWC Specialist. I build scalable Salesforce solutions, complex integrations, and intuitive user experiences.",
  keywords: ["Salesforce Developer", "LWC", "Apex", "Salesforce Certified", "Web Developer", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Kevin Suvagiya", url: "https://kevinSuvagiya.github.io/Portfolio" }],
  creator: "Kevin Suvagiya",
  openGraph: {
    title: "Kevin Suvagiya | Salesforce Developer",
    description: "Building the engines behind Salesforce clouds. Explore my projects and certifications.",
    url: "https://kevinSuvagiya.github.io/Portfolio",
    siteName: "Kevin Suvagiya Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Suvagiya | Salesforce Developer",
    description: "Salesforce Developer & LWC Specialist. View my work and experience.",
    creator: "@KevinSuvagiya", // Replace if known, or generic
  },
  icons: {
    icon: "/Portfolio/icon.png", // Explicitly pointing to our new icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-slate-950 min-h-screen relative overflow-x-hidden")}>
        <ParticleBackground />
        <Spotlight className="hidden md:block" />
        <div className="relative z-10 selection:bg-cyan-500/30">
          {children}
        </div>
      </body>
    </html>
  );
}
