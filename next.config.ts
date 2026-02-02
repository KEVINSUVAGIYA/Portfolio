import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "", // Dynamic basePath for Vercel vs GitHub Pages
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
