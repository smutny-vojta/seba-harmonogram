import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Online harmonogram",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Online harmonogram",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="cs" className={figtree.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
