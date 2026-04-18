import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Sales Rep — CrftdWeb',
  description: 'Join CrftdWeb as a commissioned sales rep. Flexible, remote, performance-based.',
};

const STEPS = [
  { step: '01', title: 'You apply', desc: 'Fill in a short task — 5 UK businesses with bad websites. Takes about 20 minutes.' },
  { step: '02', title: 'We review', desc: 'If your task shows the right instincts, we book a quick screening call.' },
  { step: '03', title: 'You get onboarded', desc: 'Access the portal, complete your training, and unlock your pipeline.' },
  { step: '04', title: 'You earn', desc: 'Book discovery calls. When the client signs, you get paid within 7 days.' },
];

const WHAT_YOU_DO = [
  'Find UK businesses that need a website or want to upgrade theirs',
  'Call them using our scripts and proven process',
  'Book a 15-minute discovery call with us',
  'We close the deal — you earn commission',
];

const WHAT_YOU_GET = [
  { label: 'Commission', value: 'Up to 20% per deal at Silver — rising as you progress' },
  { label: 'Flexibility', value: 'Work from anywhere, on your own schedule' },
  { label: 'Training', value: 'AI-powered roleplay, scripts, objection handling — all included' },
  { label: 'Live Call AI', value: 'Real-time assistant that prompts you mid-call' },
  { label: 'No cap', value: 'Unlimited commissions — the more you close, the more you earn' },
];

const RANKS = [
  { emoji: '🥉', label: 'Bronze', desc: 'In training — getting your reps in' },
  { emoji: '🥈', label: 'Silver', desc: 'Training complete — pipeline unlocked, commissions live' },
  { emoji: '🥇', label: 'Gold', desc: '1 booked call — higher rates + warm leads' },
  { emoji: '💎', label: 'Diamond', desc: '2 closed deals — recognised performer' },
  { emoji: '🎯', label: 'Closer', desc: '5 closes — run your own discovery calls' },
];

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <Image src="/CW-logo-white.png" alt="CrftdWeb" width={90} height={25} className="rounded" />
        <Link
          href="/apply/trial"
          className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-white/90 transition-colors"
        >
          Apply now →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-24 space-y-20">

        {/* Hero */}
        <section className="pt-16 space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Sales Rep — Commissioned Role</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            Earn commission selling<br />websites to UK businesses.
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-xl">
            Remote. Flexible. No salary, no cap. You find the businesses, we build the site, you get paid.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/apply/trial"
              className="px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors"
            >
              Start your application →
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 bg-white/5 border border-white/10 text-white/60 text-sm font-medium rounded-xl hover:bg-white/8 hover:text-white/80 transition-colors"
            >
              How it works
            </a>
          </div>
        </section>

        {/* What you actually do */}
        <section className="space-y-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">The role</p>
          <h2 className="text-2xl font-bold">This is a sales role. Nothing else.</h2>
          <p className="text-white/40 text-sm leading-relaxed">No design work. No client management. No cold emailing lists. Your job is one thing: book discovery calls. We handle the rest.</p>
          <div className="space-y-3 pt-2">
            {WHAT_YOU_DO.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
                <span className="text-white/20 font-bold text-xs mt-0.5 shrink-0">→</span>
                <p className="text-sm text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="space-y-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">What you get</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WHAT_YOU_GET.map(({ label, value }) => (
              <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">{label}</p>
                <p className="text-sm text-white/70 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="space-y-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">How it works</p>
          <div className="space-y-3">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4 bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4">
                <span className="text-[11px] font-bold text-white/20 shrink-0 mt-0.5 w-6">{step}</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rank progression */}
        <section className="space-y-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Career progression</p>
          <p className="text-sm text-white/40 leading-relaxed">Your rank goes up as you perform. Each rank unlocks higher commission rates and more tools.</p>
          <div className="space-y-2">
            {RANKS.map(({ emoji, label, desc }) => (
              <div key={label} className="flex items-center gap-4 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
                <span className="text-2xl shrink-0">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/35">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who this is for */}
        <section className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Who this is for</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-2">
              <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-wider">Good fit ✓</p>
              {[
                'Can hold a conversation and handle rejection',
                'Self-motivated — no hand-holding needed',
                'Confident on the phone or willing to get there',
                'Looking for uncapped earnings',
              ].map(t => <p key={t} className="text-xs text-white/50">{t}</p>)}
            </div>
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-2">
              <p className="text-xs font-bold text-red-400/70 uppercase tracking-wider">Not for you ✗</p>
              {[
                'Expecting a salary or guaranteed income',
                'Not willing to make cold calls',
                'Looking for a passive income side hustle',
                'Want to manage designs or client projects',
              ].map(t => <p key={t} className="text-xs text-white/50">{t}</p>)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 text-center space-y-5">
          <h2 className="text-2xl font-bold">Ready to apply?</h2>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            The task takes about 20 minutes. If it passes review, we&apos;ll book a quick call and get you set up.
          </p>
          <Link
            href="/apply/trial"
            className="inline-block px-8 py-3.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors"
          >
            Start your application →
          </Link>
          <p className="text-xs text-white/20">Fully remote · Commission only · No experience required</p>
        </section>

      </div>
    </div>
  );
}
