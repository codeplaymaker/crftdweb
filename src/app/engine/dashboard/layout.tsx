'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, AuthProvider } from '@/lib/firebase';

const sidebarItems = [
  { 
    name: 'Overview', 
    href: '/engine/dashboard', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    name: 'Truth Engine', 
    href: '/engine/dashboard/truth', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  { 
    name: 'Offer Builder', 
    href: '/engine/dashboard/offers', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    name: 'AI Agents', 
    href: '/engine/dashboard/agents', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    name: 'Skills', 
    href: '/engine/dashboard/skills', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    name: 'Workspaces',
    href: '/engine/dashboard/workspaces',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
];


function Sidebar({ credits = 100, plan = 'free', open, onClose }: { credits?: number; plan?: string; open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden" 
          onClick={onClose}
        />
      )}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-black/95 border-r border-white/10 z-40 transform transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/engine" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-semibold text-lg">Engine</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/engine/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Credits */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Credits</span>
            <span className="text-purple-400 font-semibold">∞</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-white/40 text-xs mt-2">{plan === 'free' ? 'Free tier' : plan === 'pro' ? 'Pro plan' : 'Agency plan'}</p>
        </div>
      </div>
    </aside>
    </>
  );
}

function DashboardHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/engine/signin');
  };

  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 text-white/60 hover:text-white transition-colors" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center">
            <span className="text-purple-400 text-sm font-medium">
              {profile?.displayName?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium">{profile?.displayName || 'User'}</p>
            <p className="text-white/40 text-xs">{user?.email || ''}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-white/40 hover:text-white text-sm transition-colors ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function DashboardContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/engine/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar credits={profile?.credits || 100} plan={profile?.plan || 'free'} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <DashboardHeader onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
