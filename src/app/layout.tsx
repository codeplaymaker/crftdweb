import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { cn } from "@/lib/utils";
import RootLayoutShell from '@/components/RootLayoutShell';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const classicismo = localFont({
  src: '../fonts/Classicismo.otf',
  variable: '--font-logo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "CrftdWeb — Premium Web Development Agency",
    template: "%s | CrftdWeb",
  },
  description: "CrftdWeb is a premium web development agency crafting high-performance websites, brands, and digital products for ambitious businesses.",
  keywords: ["web development", "web design", "branding", "UI/UX", "Next.js", "premium agency"],
  authors: [{ name: "CrftdWeb" }],
  creator: "CrftdWeb",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CrftdWeb",
    title: "CrftdWeb — Premium Web Development Agency",
    description: "High-performance websites, brands, and digital products for ambitious businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrftdWeb — Premium Web Development Agency",
    description: "High-performance websites, brands, and digital products for ambitious businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon_io-6/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io-6/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io-6/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon_io-6/favicon.ico',
    apple: '/favicon_io-6/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          classicismo.variable
        )}
      >
        <RootLayoutShell>
          {children}
        </RootLayoutShell>
      </body>
    </html>
  );
}
