'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/firebase/AuthContext';
import { getRepProfile, RepProfile } from '@/lib/firebase/firestore';
import { CAREER_RANKS, type CareerRank } from '@/lib/types/repRanks';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Phone, Search, PoundSterling, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/rep/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rep/leads', label: 'My Leads', icon: Users },
  { href: '/rep/train', label: 'Training', icon: GraduationCap },
  { href: '/rep/call', label: 'Live Call', icon: Phone },
  { href: '/rep/audit', label: 'Site Audit', icon: Search },
  { href: '/rep/commissions', label: 'Commissions', icon: PoundSterling },
  { href: '/rep/resources', label: 'Resources', icon: BookOpen },
];

export default function RepLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RepLayoutInner>{children}</RepLayoutInner>
    </AuthProvider>
  );
}

function RepLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [repVerified, setRepVerified] = useState<boolean | null>(null);
  const [repProfile, setRepProfile] = useState<RepProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/rep/signin') return;
    if (loading) return;
    if (!user) {
      router.replace('/rep/signin');
      return;
    }
    // Verify this user is an actual rep
    getRepProfile(user.uid).then((profile) => {
      if (profile) {
        setRepVerified(true);
        setRepProfile(profile);
      } else {
        setRepVerified(false);
        router.replace('/');
      }
    }).catch(() => {
      setRepVerified(false);
      router.replace('/');
    });
  }, [user, loading, router, pathname]);

  // Signin page — no sidebar, no auth gate
  if (pathname === '/rep/signin') {
    return <>{children}</>;
  }

  // Not authenticated or not a verified rep — effect will redirect
  if (!loading && !user) return null;
  if (repVerified === false) return null;
  if (repVerified === null && !loading && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Render portal immediately — effect redirects if auth fails
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-x-hidden">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 border-r border-white/8 px-4 py-6 gap-1 fixed h-full z-20">
        <div className="px-2 mb-8">
          <span className="text-2xl font-logo tracking-tight text-white">CW</span>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Rep Portal</p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-auto space-y-2 border-t border-white/8 pt-4">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-white/80 truncate">{user?.displayName ?? 'Rep'}</p>
            <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            {repProfile && (() => {
              const rank = repProfile.careerRank;
              const info = CAREER_RANKS[rank || 'bronze'];
              return (
                <p className="text-[10px] mt-1 font-medium truncate text-emerald-400">
                  {info.emoji} {info.label}
                </p>
              );
            })()}
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/8 flex items-center justify-between px-4 h-14">
        <span className="text-2xl font-logo tracking-tight text-white">CW</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/60">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-[#0a0a0a] pt-14 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/30 mt-auto">
            <LogOut className="w-4 h-4" />
            Sign out
            {repProfile && (() => {
              const rank = repProfile.careerRank;
              const info = CAREER_RANKS[rank || 'bronze'];
              return (
                <span className="ml-auto text-[10px] font-medium text-emerald-400">
                  {info.emoji} {info.label}
                </span>
              );
            })()}
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 md:ml-56 px-4 py-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
