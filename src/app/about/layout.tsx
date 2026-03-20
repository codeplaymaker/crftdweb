import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CrftdWeb | The Team Behind Your Next Website",
  description: "Meet CrftdWeb — a premium web design & development studio building custom-coded websites for ambitious businesses. Our mission, values, and story.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About CrftdWeb',
    description: 'Meet the team building custom-coded websites for ambitious businesses.',
    url: 'https://www.crftdweb.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
