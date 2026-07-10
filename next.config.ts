import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) so the app can run on any
  // Node host (Namecheap cPanel/Passenger) without installing node_modules there.
  output: "standalone",
  // Type/lint are checked separately (tsc + eslint) — skipping them during
  // `next build` keeps memory usage low enough for CI build containers.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
