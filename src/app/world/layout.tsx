import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Spirit World | 3D Interactive WebGL Playground | Kevin Suvagiya",
  description: "Explore the Spirit World, an immersive 3D interactive WebGL playground built by Kevin Suvagiya using React Three Fiber, Three.js, and custom shaders.",
  keywords: ["Three.js", "React Three Fiber", "3D WebGL", "Interactive Web Playground", "Creative Coding", "Kevin Suvagiya", "Spirit World 3D"],
  alternates: {
    canonical: `${SITE_URL}/world`,
  },
  openGraph: {
    title: "The Spirit World | 3D Interactive WebGL Playground | Kevin Suvagiya",
    description: "Explore the Spirit World, an immersive 3D interactive WebGL playground built by Kevin Suvagiya using React Three Fiber, Three.js, and custom shaders.",
    url: `${SITE_URL}/world`,
    siteName: "Kevin Suvagiya Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Spirit World | 3D Interactive WebGL Playground | Kevin Suvagiya",
    description: "Explore the Spirit World, an immersive 3D interactive WebGL playground built by Kevin Suvagiya using React Three Fiber, Three.js, and custom shaders.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
