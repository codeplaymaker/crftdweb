'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Don't render on Playbook or Engine pages — they have their own footers
  if (pathname?.startsWith('/playbook') || pathname?.startsWith('/engine')) return null;

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-logo text-2xl tracking-tight block mb-4">
              CrftdWeb
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Premium web design &amp; development studio. Crafting digital excellence since day one.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-white/50 hover:text-white text-sm transition-colors">All Services</Link></li>
              <li><Link href="/services/web-design-for-restaurants" className="text-white/50 hover:text-white text-sm transition-colors">Restaurants</Link></li>
              <li><Link href="/services/web-design-for-dentists" className="text-white/50 hover:text-white text-sm transition-colors">Dentists</Link></li>
              <li><Link href="/services/web-design-for-salons" className="text-white/50 hover:text-white text-sm transition-colors">Salons</Link></li>
              <li><Link href="/services/web-design-for-gyms" className="text-white/50 hover:text-white text-sm transition-colors">Gyms</Link></li>
              <li><Link href="/services/web-design-for-real-estate" className="text-white/50 hover:text-white text-sm transition-colors">Estate Agents</Link></li>
              <li><Link href="/services/website-cost" className="text-white/50 hover:text-white text-sm transition-colors">Pricing Guide</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/50 hover:text-white text-sm transition-colors">About</Link></li>
              <li><Link href="/work" className="text-white/50 hover:text-white text-sm transition-colors">Work</Link></li>
              <li><Link href="/blog" className="text-white/50 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="text-white/50 hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link href="/changelog" className="text-white/50 hover:text-white text-sm transition-colors">Changelog</Link></li>
              <li><Link href="/contact" className="text-white/50 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/answers" className="text-white/50 hover:text-white text-sm transition-colors">Answers</Link></li>
              <li><Link href="/glossary" className="text-white/50 hover:text-white text-sm transition-colors">Glossary</Link></li>
              <li><Link href="/concepts" className="text-white/50 hover:text-white text-sm transition-colors">Concepts</Link></li>
              <li><Link href="/playbook" className="text-white/50 hover:text-white text-sm transition-colors">The Playbook</Link></li>
              <li><Link href="/engine" className="text-white/50 hover:text-white text-sm transition-colors">Engine</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} CrftdWeb. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white/60 text-sm transition-colors">Privacy</Link>
            <Link href="/contact" className="text-white/40 hover:text-white/60 text-sm transition-colors">Contact</Link>
            <Link href="/playbook" className="text-white/40 hover:text-white/60 text-sm transition-colors">Playbook</Link>
            <Link href="/engine" className="text-white/40 hover:text-white/60 text-sm transition-colors">Engine</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
