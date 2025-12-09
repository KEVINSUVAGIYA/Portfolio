import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Spotlight } from "@/components/ui/Spotlight";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kevin Suvagiya | Salesforce Developer",
  description: "Salesforce Developer & LWC Specialist building the engines behind Salesforce clouds.",
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
