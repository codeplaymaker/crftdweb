import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { cn } from "@/lib/utils";
import RootLayoutShell from '@/components/RootLayoutShell';
import { LocalBusinessJsonLd, WebSiteJsonLd, PersonJsonLd } from '@/components/seo/JsonLd';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Analytics } from '@vercel/analytics/react';

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
  metadataBase: new URL('https://www.crftdweb.com'),
  title: {
    default: "CrftdWeb — Web Design Agency | Custom Websites That Convert",
    template: "%s | CrftdWeb",
  },
  description: "Premium web design & development agency. Custom-coded websites built in Next.js, delivered in 14 days. 95+ PageSpeed scores. Trusted by UK businesses.",
  keywords: [
    "web design agency", "web development", "custom website", "Next.js developer",
    "web design UK", "small business website", "conversion optimisation",
    "custom website design uk", "next.js web design agency", "14 day website", "fast website design uk",
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: "CrftdWeb" }],
  creator: "CrftdWeb",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CrftdWeb",
    title: "CrftdWeb",
    description: "We build websites that sell. Custom-coded, delivered in 14 days.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrftdWeb",
    description: "We build websites that sell. Custom-coded, delivered in 14 days.",
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
      <head>
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
        <PersonJsonLd />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          classicismo.variable
        )}
      >
        <GoogleAnalytics />
        <RootLayoutShell>
          {children}
        </RootLayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
