import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  // Relative paths for Electron file:// protocol, but not in dev
  ...(isDev ? {} : { assetPrefix: "./" }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
