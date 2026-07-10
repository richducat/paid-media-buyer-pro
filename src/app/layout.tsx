import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://mediabuyerpro.app"),
  title: {
    default: "MediaBuyerPro — AI Ad Strategy & Creative Packs",
    template: "%s | MediaBuyerPro",
  },
  description:
    "Answer a few questions about your business and get a complete ad starter kit: scroll-stopping hooks, UGC video scripts, copy variants, and a step-by-step launch plan. No ads experience needed.",
  keywords: [
    "ad copy generator",
    "facebook ads",
    "google ads",
    "ad creative",
    "media buying",
    "UGC scripts",
  ],
  openGraph: {
    title: "MediaBuyerPro — AI Ad Strategy & Creative Packs",
    description:
      "Tell us what your business does. We write your ads and a simple launch plan — hooks, scripts, copy, and a testing roadmap.",
    type: "website",
    siteName: "MediaBuyerPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaBuyerPro — AI Ad Strategy & Creative Packs",
    description:
      "Tell us what your business does. We write your ads and a simple launch plan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
