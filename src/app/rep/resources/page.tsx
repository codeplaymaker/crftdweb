'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Search, MapPin, Instagram, MessageCircle, Globe, Phone, Mail, Zap, Linkedin } from 'lucide-react';

const CALL_SCRIPT = [
  {
    step: 'Step 1: Opening (first 10 seconds)',
    content: `"Hi, can I speak to the owner? … Hi [Name], my name is [Your Name], I'm calling from a web design studio called CrftdWeb. I'll be really quick, I'm not trying to sell you anything today, I just had a quick question."`,
    note: 'Pause. Let them respond.',
  },
  {
    step: 'Step 2: The Hook',
    content: `"I came across your business online and noticed your website, honestly it looks like it could be doing a lot more for you. Is that something you've thought about at all?"`,
    note: "Wait for their response, don't fill the silence.",
  },
  {
    step: 'Step 3a: If Yes / "Yeah actually"',
    content: `"Perfect. I work with a developer who specialises in building clean, fast websites for businesses like yours, starting from £997. Would you be open to a quick 15-minute discovery call to see if it's a fit?"`,
    note: null,
  },
  {
    step: 'Step 3b: If No / "We\'re fine"',
    content: `"Totally get that. Out of curiosity, are you getting enquiries through the site regularly, or do most people find you another way?"`,
    note: "Gets them talking. If the site isn't converting, you're back in.",
  },
  {
    step: 'Step 4: Book the Call',
    content: `"Great, he's pretty flexible. I can get you a slot as early as [day]. What works better for you, mornings or afternoons?"`,
    note: 'Always give a choice. Never ask "when are you free?", too open ended.',
  },
  {
    step: 'Step 5: If Not Interested',
    content: `"No problem at all. Can I just send over a quick email with some examples of his work, just so you have it if things change?"`,
    note: 'Gets the email. Turns a dead call into a warm lead for follow-up.',
  },
];

const EMAIL_TEMPLATES = [
  {
    label: 'After Booking a Call',
    subject: 'Your call with CrftdWeb is confirmed',
    body: `Hi [Name],

Just confirming your free 15-minute consultation with CrftdWeb on [day] at [time].

What to expect:
The site will be reviewed before the call
You'll get straight feedback on what's working and what isn't
If there's a fit, you'll hear exactly what we'd build and what it would cost

No pressure, no hard sell.

Talk soon,
[Your name]
CrftdWeb Rep

crftdweb.com`,
  },
  {
    label: 'Follow-up (No Reply)',
    subject: 'Re: your website',
    body: `Hi [Name],

Tried you on the phone earlier, just wanted to pass this across.

We built sites for [industry, e.g. local tradespeople / gyms / consultants] that are designed to bring in actual enquiries, not just look decent.

If you've got 15 minutes in the next few days, happy to set up a free consultation. We'll be straight with you about whether it makes sense for your business.

Worth it?

[Your name]`,
  },
  {
    label: 'After Sending Portfolio',
    subject: 'Examples from CrftdWeb',
    body: `Hi [Name],

Here are a few recent sites we've built: crftdweb.com/work

The process is quick, most sites are live in 2 to 5 weeks. Starting from £997 for a landing page.

If anything looks relevant to what you're after, I can get you a free 15-minute consultation this week.

[Your name]`,
  },
];

const FAQS = [
  {
    q: 'What exactly am I selling?',
    a: 'Custom websites. Starter from £997 (1 to 2 weeks). Launch from £2,497 (2 to 3 weeks). Growth from £4,997 (3 to 5 weeks). Scale from £9,997+ (6 to 12 weeks). Your job is to book the discovery call, not close the deal. The team handles that.',
  },
  {
    q: 'When do I get paid?',
    a: 'Within 7 days of the client paying their deposit. Commission is 15% of the net project value. So a £2,497 Launch site = £374 to you.',
  },
  {
    q: 'What if they ask technical questions?',
    a: "Don't answer them. Say: \"That's exactly what we'll cover on the call, it's better to explain it properly in context than me get something wrong.\" Then book the call.",
  },
  {
    q: "What if they say it's too expensive?",
    a: "Don't negotiate on price. Say: \"Fair enough, that's something we can discuss on the call. It's completely free and you'll get a proper breakdown. Worth 15 minutes?\"",
  },
  {
    q: 'How do I log a lead?',
    a: "Use the 'My Leads' section in this portal. Add them as soon as you hang up, never at the end of the day. Pick the right status, add a note with what they said.",
  },
  {
    q: 'What counts as a "won" deal?',
    a: "When the client pays their deposit to CrftdWeb. Not when they verbally agree. Update the lead status to 'won' and add the deal value when you get confirmation.",
  },
];

// ─── Lead Sourcing Playbook ────────────────────────────────────────────────

const SOURCING_CHANNELS = [
  {
    id: 'google-maps',
    name: 'Google Maps',
    icon: 'map',
    difficulty: 'Easy',
    speed: 'Fast',
    description: 'The fastest way to build a daily prospect list. Unlimited free leads.',
    steps: [
      'Open Google Maps. Search "[industry] near [city]", e.g. "restaurants near Bristol", "barbers near Leeds", "dentists near Manchester".',,
      'Click each result. Check their website link. If it\'s slow, ugly, not mobile-friendly, or missing entirely, they\'re a prospect.',
      'Run their URL through Google PageSpeed Insights (pagespeed.web.dev). Screenshot the score, you\'ll use this in your outreach.',
      'Note down: business name, phone number, website URL, owner name (check "About" page or Google listing).',
      'Call them directly using the cold call script, or find their Instagram/Facebook for a DM approach.',
    ],
    proTip: 'Sort by "Newest" to find recently opened businesses, they\'re the most likely to need a website and the least likely to have been contacted by other agencies.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    difficulty: 'Easy',
    speed: 'Medium',
    description: 'Best for beauty, fitness, food, and local service businesses. Warm DM outreach.',
    steps: [
      'Search location tags: tap the search icon, go to "Places", type a city. Browse businesses posting from that area.',
      'Search industry hashtags: #bristolrestaurant, #londonbarber, #manchesterfitness, #leedssalon. Find businesses with 500-10K followers.',
      'Check their bio link. If it\'s a Linktree, a dead link, or no link at all, they need a website.',
      'Look at their content. If they\'re posting regularly but have no website, they\'re investing in marketing but missing the conversion piece.',
      'Send a DM using the templates below. Voice notes convert 3x better than text.',
    ],
    proTip: 'Follow them and like 2-3 posts before DMing. Cold DMs from accounts with zero interaction get ignored. Spend 30 seconds warming them up.',
  },
  {
    id: 'facebook',
    name: 'Facebook Groups',
    icon: 'message',
    difficulty: 'Medium',
    speed: 'Slow but high quality',
    description: 'Owners hang out in local business groups. Build relationships first, pitch second.',
    steps: [
      'Join groups: "[City] Small Business Owners", "[City] Business Network", "[Industry] UK". Request to join 5-10 groups.',
      'Don\'t pitch immediately. Spend 2-3 days commenting on posts, answering questions, being helpful.',
      'When someone posts about their website, marketing, or getting more customers, that\'s your opening. Comment helpfully, then DM.',
      'Post value: "3 things I noticed checking local business websites this week", share genuine insights without selling. This positions you as knowledgeable.',
      'DM people who engage with your comments. They already see you as helpful.',
    ],
    proTip: 'Never post "We build websites, DM me!" in a group. You\'ll get kicked. The play is: give value publicly, sell privately.',
  },
  {
    id: 'google-search',
    name: 'Google Search',
    icon: 'search',
    difficulty: 'Easy',
    speed: 'Fast',
    description: 'Page 2+ of Google = weak SEO = weak website = your prospect.',
    steps: [
      'Search "[Industry] [city]", e.g. "plumber Bristol", "accountant Leeds", "gym Manchester".',
      'Skip page 1 (they probably have good sites already). Go to pages 2-5.',
      'Every business there has a website that isn\'t ranking, proof it\'s not working for them.',
      'Also search "[Industry] near me" and check who has no website at all in the Google Business listings.',
      'Cross-reference with their Google reviews. High reviews + bad website = business is good but online presence is letting them down. Strong pitch angle.',
    ],
    proTip: 'Use this search to verify any lead: "[Business name] website", you\'ll instantly see what you\'re working with before you call.',
  },
  {
    id: 'yell',
    name: 'Yell.com / Yelp / Thomson Local',
    icon: 'globe',
    difficulty: 'Easy',
    speed: 'Fast',
    description: 'Business directories with phone numbers. Bulk source leads by area and industry.',
    steps: [
      'Go to yell.com. Enter an industry and location. Filter by category.',
      'Each listing shows: name, phone, website, reviews. If their website is a Yell page or a basic template, they\'re a prospect.',
      'Export 20 businesses per session. Call through the list using the cold call script.',
      'Check who has "No Website" listed, these are the easiest sells. They already know they need one.',
      'Cross-check with Google to find their social media if you prefer DM outreach over calling.',
    ],
    proTip: 'Businesses paying for a Yell listing already spend money on marketing. They understand the value of being found online, you just need to show them a better way.',
  },
  {
    id: 'indeed',
    name: 'Indeed / Gumtree',
    icon: 'zap',
    difficulty: 'Medium',
    speed: 'Medium',
    description: 'Businesses hiring = businesses growing = businesses that need a better online presence.',
    steps: [
      'Search Indeed for businesses hiring in your area, receptionists, sales staff, managers.',
      'A business investing in staff is a business that\'s growing. Growth requires a better front door (website).',
      'Note the company name. Google them. Check their website.',
      'Call and say: "I saw you\'re hiring, congrats on the growth. I actually wanted to speak to you about something else. I noticed your website and..."',
      'This opener works because it shows you did research. It\'s not a cold call from nowhere.',
    ],
    proTip: 'This is one of the least competitive channels. No other agency reps are sourcing leads from job boards. You\'ll have zero competition.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    difficulty: 'Medium',
    speed: 'Slow but highest value',
    description: 'Direct access to business owners and decision-makers. Best for higher-value projects.',
    steps: [
      'Search for job titles: "Owner", "Founder", "Director" + industry + location. E.g. "Restaurant Owner Manchester" or "Salon Founder Bristol".',
      'Filter by "People" and "2nd" or "3rd+" connections. Check their company page, look at their website link.',
      'If their website is outdated, a template, or missing, send a connection request with a short note (under 300 chars).',
      'Once connected, send a personalised message. Reference something from their profile or recent post. Never pitch in the connection request.',
      'Engage with their posts first (like, comment something genuine) before messaging. Warm connections reply 5x more than cold ones.',
    ],
    proTip: 'LinkedIn is the only platform where business owners expect to be contacted about business. Use it for higher-ticket prospects, the average deal from LinkedIn outreach is larger than from Instagram or cold calls.',
  },
];

const DM_TEMPLATES = [
  {
    label: 'Instagram DM: First Contact',
    text: `Hey [Name]! Love what you're doing with [business name], your [specific thing you noticed, e.g. "food photos", "client transformations"] are quality.

Quick question, do you have a proper website for the business? I work with a web designer who builds sites specifically for [their industry] to bring in more bookings/enquiries. Might be worth a quick chat if you're open to it?`,
    note: 'Personalise the compliment. Generic = ignored. Mention something specific from their feed.',
  },
  {
    label: 'Instagram DM: Voice Note',
    text: `[Record a 20-30 second voice note, DO NOT read a script. Hit these points naturally:]

1. Hey [Name], saw your page, [genuine compliment].
2. I work with a web designer who builds sites for businesses like yours.
3. Noticed you don't have a website / your current site could do more for you.
4. Would you be open to a quick 15-min discovery call? Completely free, no pressure.
5. Let me know!`,
    note: 'Voice notes feel personal. 3x higher reply rate than text DMs. Keep it under 30 seconds.',
  },
  {
    label: 'Facebook DM: After Group Interaction',
    text: `Hey [Name], saw your post in [group name] about [topic]. Thought I'd reach out directly.

I work with a developer who specialises in building websites for [their industry]. Not trying to sell you anything, but if you've been thinking about sorting out your online presence, we do free 15-minute audits. Might be useful?`,
    note: 'Only send this after you\'ve interacted with them publicly first. Cold Facebook DMs go to "Message Requests" and get ignored.',
  },
  {
    label: 'WhatsApp: After Getting Number',
    text: `Hi [Name], it's [Your Name] from CrftdWeb. Thanks for chatting earlier.

Just wanted to drop you a quick message so you've got my number. I'll get that consultation booked for [day/time].

Any questions before then, just ping me here.`,
    note: 'Only use WhatsApp after phone/DM contact. Never cold message on WhatsApp.',
  },
  {
    label: 'LinkedIn: Connection Request Note',
    text: `Hey [Name], saw you run [business name] in [city]. Impressive stuff. I work with a web designer who builds sites for [their industry]. Would love to connect.`,
    note: 'Keep connection notes under 300 characters. Do NOT pitch here, just get accepted. Pitch in the follow-up message.',
  },
  {
    label: 'LinkedIn: Follow-Up After Connecting',
    text: `Thanks for connecting, [Name]. Saw [something specific, their latest post, a milestone, their Google reviews].

Quick one, I noticed your website and thought it could be doing more for you. I work with a developer who builds custom sites for [industry] businesses. He does a free 15-minute audit to show you exactly what's costing you enquiries.

Worth a quick chat? No pressure either way.`,
    note: 'Send 1-2 days after connecting. Reference something real from their profile. If they don\'t reply after 5 days, like one of their posts and try once more.',
  },
];

const DAILY_ROUTINE = [
  { time: '30 mins', task: 'Source 20 prospects', detail: 'Google Maps + Instagram. Build your list for the day. Name, phone/DM, website URL, notes.' },
  { time: '60 mins', task: 'Outreach block 1: Calls', detail: '10-15 cold calls from your list. Use the script. Log every call in the portal immediately.' },
  { time: '45 mins', task: 'Outreach block 2: DMs', detail: '10-15 Instagram/Facebook DMs. Personalise each one. No copy-paste blasts.' },
  { time: '15 mins', task: 'Follow-ups', detail: 'Chase yesterday\'s warm leads. Second touch converts more than first. Send the follow-up email template.' },
  { time: '10 mins', task: 'Log and review', detail: 'Update all leads in the portal. Check your numbers: 20 outreaches hit? Calls booked? Notes added?' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-sm text-white/70 font-medium">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />}
      </button>
      {open && (
        <p className="pb-4 text-sm text-white/40 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function ChannelCard({ channel, icon }: { channel: typeof SOURCING_CHANNELS[number]; icon: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/[0.02] border border-white/8 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/70">{channel.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/30 font-medium">{channel.difficulty}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/30 font-medium">{channel.speed}</span>
          </div>
          <p className="text-xs text-white/30 mt-0.5">{channel.description}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/20 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/20 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-white/6">
          <ol className="space-y-2.5 mt-3">
            {channel.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[10px] font-bold text-sky-400/60 bg-sky-500/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs text-white/50 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3">
            <p className="text-[11px] text-amber-400/60 leading-relaxed">
              <span className="font-bold text-amber-400/80">Pro tip:</span> {channel.proTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RepResourcesPage() {
  const [dealValue, setDealValue] = useState('');
  const commission = dealValue ? Math.round(Number(dealValue) * 0.15) : null;

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Resources</h1>
        <p className="text-sm text-white/30 mt-0.5">Everything you need to work a lead end to end.</p>
      </div>

      {/* Commission calculator */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Commission Calculator</p>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">£</span>
            <input
              type="number"
              value={dealValue}
              onChange={e => setDealValue(e.target.value)}
              placeholder="Deal value"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">{commission !== null ? `£${commission.toLocaleString()}` : '£—'}</p>
            <p className="text-[10px] text-white/30">your 15%</p>
          </div>
        </div>
      </div>

      {/* Daily targets */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { num: '20', label: 'Outreaches / day' },
          { num: '10', label: 'Calls / day' },
          { num: '2 to 3', label: 'Booked calls / wk' },
          { num: '1', label: 'Closed deal / wk' },
        ].map(t => (
          <div key={t.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white tracking-tight">{t.num}</p>
            <p className="text-[10px] text-white/30 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {/* ═══ LEAD SOURCING PLAYBOOK ═══ */}
      <div>
        <div className="mb-5">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Where to Find Leads</p>
          <p className="text-xs text-white/20 italic">Your job starts here. Before you can call or DM anyone, you need a list. These are your sourcing channels, aim for 20 fresh prospects every morning.</p>
        </div>

        <div className="space-y-3">
          {SOURCING_CHANNELS.map((channel) => {
            const icons: Record<string, React.ReactNode> = {
              map: <MapPin className="w-4 h-4" />,
              instagram: <Instagram className="w-4 h-4" />,
              message: <MessageCircle className="w-4 h-4" />,
              search: <Search className="w-4 h-4" />,
              globe: <Globe className="w-4 h-4" />,
              zap: <Zap className="w-4 h-4" />,
              linkedin: <Linkedin className="w-4 h-4" />,
            };
            return (
              <ChannelCard
                key={channel.id}
                channel={channel}
                icon={icons[channel.icon] ?? <Globe className="w-4 h-4" />}
              />
            );
          })}
        </div>
      </div>

      {/* ═══ DAILY ROUTINE ═══ */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Your Daily Routine</p>
        <p className="text-xs text-white/20 mb-5 italic">2.5 hours of focused work. Do this consistently and you&apos;ll close 1 deal/week minimum.</p>
        <div className="space-y-2">
          {DAILY_ROUTINE.map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/[0.02] border border-white/8 rounded-xl p-4">
              <div className="bg-white/[0.06] border border-white/10 rounded-lg px-2.5 py-1.5 text-center flex-shrink-0">
                <p className="text-xs font-bold text-white/60">{item.time}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/70">{item.task}</p>
                <p className="text-xs text-white/30 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 mt-2">
            <p className="text-xs text-emerald-400/70 leading-relaxed">
              <span className="font-bold text-emerald-400">The maths:</span> 20 outreaches/day × 5 days = 100/week. At 2% conversion = 2 booked calls. 2 calls → 1 proposal → 1 close every 1-2 weeks. One £2,497 deal = £374 commission. Consistency beats intensity.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ DM TEMPLATES ═══ */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">DM &amp; Social Outreach Templates</p>
        <p className="text-xs text-white/20 mb-5 italic">For Instagram, Facebook, and WhatsApp. Personalise every message, copy-paste blasts get you blocked.</p>
        <div className="space-y-3">
          {DM_TEMPLATES.map((tpl, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/60">{tpl.label}</p>
                <CopyButton text={tpl.text} />
              </div>
              <pre className="text-xs text-white/40 leading-relaxed whitespace-pre-wrap font-sans">{tpl.text}</pre>
              {tpl.note && <p className="text-[10px] text-amber-400/50 mt-3 italic">{tpl.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Call script */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Cold Call Script</p>
        <p className="text-xs text-white/25 mb-5 italic">Know it, don't read it. Your only goal is to book a 15-min call.</p>
        <div className="space-y-3">
          {CALL_SCRIPT.map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{item.step}</p>
              <p className="text-sm text-white/70 leading-relaxed italic">{item.content}</p>
              {item.note && <p className="text-xs text-white/30 mt-2 not-italic">{item.note}</p>}
            </div>
          ))}
        </div>
        <div className="bg-black/30 border border-white/8 rounded-xl p-4 mt-3">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">The Rules</p>
          <ol className="list-decimal list-inside space-y-2">
            {[
              'Never read it word for word, know it, then make it natural',
              'Your only goal is to book a call, not sell the website, the team handles that',
              'Keep calls under 3 minutes, don\'t pitch, don\'t ramble',
              'Log every lead immediately in the portal',
              'Follow up everything, most closes happen on the 2nd or 3rd contact',
            ].map((rule, i) => (
              <li key={i} className="text-xs text-white/40 leading-relaxed">{rule}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Email templates */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Email Templates</p>
        <div className="space-y-3">
          {EMAIL_TEMPLATES.map((tpl, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/60">{tpl.label}</p>
                <CopyButton text={`Subject: ${tpl.subject}\n\n${tpl.body}`} />
              </div>
              <p className="text-[10px] text-white/25 mb-2">Subject: {tpl.subject}</p>
              <pre className="text-xs text-white/40 leading-relaxed whitespace-pre-wrap font-sans">{tpl.body}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">FAQs</p>
        <div>
          {FAQS.map((faq, i) => (
            <Accordion key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
