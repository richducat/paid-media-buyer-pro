import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Type/lint are checked separately (tsc + eslint) — skipping them during
  // `next build` keeps memory usage low enough for Vercel's build containers.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
