import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — Engine',
  description: 'Get help with Engine — FAQs, support, and feature requests.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
