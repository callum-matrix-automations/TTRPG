import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Use relative asset paths so file:// protocol works in Electron
  assetPrefix: "./",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
