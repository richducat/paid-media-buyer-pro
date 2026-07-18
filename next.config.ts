import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      // Client-facing demo prototype, served from public/demo/
      { source: "/demo/cratecheck", destination: "/demo/cratecheck.html" },
    ];
  },
};

export default nextConfig;
