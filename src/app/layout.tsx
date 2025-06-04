import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';

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
  title: "CrftdWeb",
  description: "Premium Web Development Agency",
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
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
