import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — Engine',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
