import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      // Client-facing demo prototype, served from public/demo/
      { source: "/demo/salt", destination: "/demo/salt.html" },
    ];
  },
  async redirects() {
    return [
      // Pre-rename links shared with the client keep working
      { source: "/demo/cratecheck", destination: "/demo/salt", permanent: false },
      { source: "/demo/cratecheck.html", destination: "/demo/salt", permanent: false },
    ];
  },
};

export default nextConfig;
