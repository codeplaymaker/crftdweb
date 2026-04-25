'use client';

import { useEffect, useState } from 'react';
import { useAuth, AuthProvider } from '@/lib/firebase/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { getClientProfile, ClientProfile } from '@/lib/firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, FolderOpen, MessageSquare, Receipt, FileText, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/client/deliverables', label: 'Deliverables', icon: FolderOpen },
  { href: '/client/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/client/invoices', label: 'Invoices', icon: Receipt },
  { href: '/client/documents', label: 'Documents', icon: FileText },
];

function ClientLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/client/signin') return;
    if (loading) return;
    if (!user) {
      router.replace('/client/signin');
      return;
    }
    getClientProfile(user.uid).then(p => {
      if (!p) { router.replace('/client/signin'); return; }
      setClientProfile(p);
    }).catch(() => {
      router.replace('/client/signin');
    });
  }, [user, loading, router, pathname]);

  if (pathname === '/client/signin') return <>{children}</>;
  // Only block on auth — profile loads in background
  if (loading || !user) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );

  const firstName = clientProfile?.name.split(' ')[0] ?? '';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-white/8 bg-[#0d0d0d] fixed inset-y-0 left-0">
        <div className="px-5 py-5 border-b border-white/8">
          <Image src="/CW-logo-white.png" alt="CrftdWeb" width={80} height={22} className="rounded" />
          <p className="text-[10px] text-white/25 mt-1.5 uppercase tracking-widest">Client Portal</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === href
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/8">
          {clientProfile ? (
            <>
              <p className="text-xs font-medium text-white/70 truncate">{firstName}</p>
              <p className="text-[11px] text-white/30 truncate">{clientProfile.businessName}</p>
            </>
          ) : (
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-2.5 w-28 bg-white/5 rounded animate-pulse" />
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="mt-3 flex items-center gap-2 text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-[#0d0d0d] border-b border-white/8 px-4 py-3 flex items-center justify-between">
        <Image src="/CW-logo-white.png" alt="CrftdWeb" width={70} height={20} className="rounded" />
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/50">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80" onClick={() => setMobileOpen(false)}>
          <div className="w-56 h-full bg-[#0d0d0d] border-r border-white/8 pt-16 px-3 py-4 space-y-0.5" onClick={e => e.stopPropagation()}>
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  pathname === href
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 p-6 md:p-8 max-w-4xl">
        {children}
      </main>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </AuthProvider>
  );
}
