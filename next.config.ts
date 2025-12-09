import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Portfolio", // Required for GitHub Project Pages
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
