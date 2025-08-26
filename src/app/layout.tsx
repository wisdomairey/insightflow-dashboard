import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "InsightFlow - Analytics Dashboard",
  description: "Professional executive dashboard analytics platform for business insights and data visualization",
  keywords: ["analytics", "dashboard", "data visualization", "business intelligence", "executive dashboard", "Next.js", "TypeScript"],
  authors: [{ name: "InsightFlow Team" }],
  creator: "InsightFlow",
  publisher: "InsightFlow",
  manifest: "/manifest.json",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://insightflow-dashboard.vercel.app",
    siteName: "InsightFlow Dashboard",
    title: "InsightFlow - Executive Analytics Dashboard",
    description: "Professional executive dashboard analytics platform built with Next.js 14, TypeScript, and Tailwind CSS. Features drag-and-drop customization, real-time data visualization, and comprehensive export capabilities.",
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@insightflow",
    creator: "@insightflow",
    title: "InsightFlow - Executive Analytics Dashboard",
    description: "Professional executive dashboard analytics platform built with Next.js 14, TypeScript, and Tailwind CSS.",
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6"
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
