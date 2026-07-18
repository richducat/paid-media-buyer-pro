import type { NextConfig } from "next";

// CSP tuned for Salt's self-contained pages (inline script/style), LIFX cloud
// for lighting, and same-origin API/asset fetches. Scoped to Salt paths only
// so the main product's pages are untouched.
const SALT_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self' https://api.lifx.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SALT_HEADERS = [
  { key: "Content-Security-Policy", value: SALT_CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // the app needs the mic (Listen tool) and fullscreen (projector); nothing else
  { key: "Permissions-Policy", value: "microphone=(self), fullscreen=(self), geolocation=(), camera=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      { source: "/demo/:path*", headers: SALT_HEADERS },
      { source: "/salt", headers: SALT_HEADERS },
      { source: "/api/dj/:path*", headers: SALT_HEADERS },
    ];
  },
  async rewrites() {
    return [
      // Salt marketing landing page (indexable) and the live app
      { source: "/salt", destination: "/salt-landing.html" },
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
