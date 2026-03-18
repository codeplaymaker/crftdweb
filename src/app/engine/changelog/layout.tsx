import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — Engine',
  description: 'See what\'s new in Engine — latest features, improvements, and fixes.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
