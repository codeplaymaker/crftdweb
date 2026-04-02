# CrftdWeb — Project Context File

> Paste this at the start of every Claude conversation when building a website.

---

## Who We Are

CrftdWeb is a web design studio. We hand-code conversion-first websites for startups and service businesses. No templates. No page builders. Every line written from scratch.

## Tech Stack

- **Framework:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS, CSS variables for theming
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Inter (body), Classicismo (brand logo/display)
- **Auth:** Firebase Authentication (email/password)
- **Database:** Firestore
- **AI:** OpenAI API (GPT-4, Whisper speech-to-text, TTS)
- **Email:** Resend API
- **Deployment:** Vercel
- **Testing:** Vitest
- **Performance target:** 90+ PageSpeed, sub-2s load time

## Folder Structure

```
src/
  app/
    page.tsx, about/, work/, services/, blog/, contact/  → Marketing site
    rep/          → Rep portal (dashboard, leads, training, call, resources)
    admin/        → Admin portal (reps, leads, commissions, applicants)
    engine/       → Truth Engine product (separate)
    client/       → Client portal (planned)
    api/          → API routes (rep/*, admin/*)
    actions/      → Server actions (email sending, etc.)
  components/    → Reusable UI components
  lib/
    firebase/     → config, auth, admin SDK, firestore CRUD, AuthContext
    types/        → TypeScript type definitions
    repTrainingService.ts, repKnowledgeBase.ts
  fonts/         → Local font files
  styles/        → Global styles
  __tests__/     → Vitest test suites
public/          → Static assets
docs/            → Project documentation
scripts/         → Seed/admin scripts
.github/agents/  → Custom Copilot agents
```

## The TRAIN Design System

Every design decision follows five principles:

| Letter | Principle | Rule |
|--------|-----------|------|
| **T** | Typography | Typefaces say what you mean. Max 2 font families. Weight, size, and spacing communicate before words do. |
| **R** | Restraint | One decision saves 1,000. Max 2-3 colors. Limited palette forces better ideas. Less noise, more signal. |
| **A** | Alignment | Invisible relationships create trust. Use grids and geometry. Precision = trust. |
| **I** | Image Treatment | Consistent processing creates instant recognition. Same filter, same crop, same feel across all visuals. |
| **N** | Negative Space | Space isn't there to fill. It's there to frame. Let the idea breathe. Generous padding and margins. |

## 12 Visual Devices

Use these to communicate any concept visually:

| Device | Use When |
|--------|----------|
| **Scale** | Showing importance (bigger = more significant) |
| **Comparison** | Before/after, side-by-side contrast |
| **Metaphor** | Making abstract concepts tangible |
| **Pattern Recognition** | Repeated visual elements decoded fast |
| **Flow** | Sequential A → B progression (process steps) |
| **Stacking** | Layered accumulation (building blocks) |
| **Continuum** | Positioning along a range (pricing tiers) |
| **Venn Diagram** | Overlapping factors (skill intersections) |
| **Hierarchy** | Top-to-bottom structure (org charts, priorities) |
| **Cartesian Plot** | Two-axis relationships (effort vs impact) |
| **Loops** | Cyclical feedback processes (flywheels) |
| **Spectrum** | Range between extremes (beginner to expert) |

## Copy Principles

1. **Problem-first.** Every headline answers "what's in it for the visitor." Never lead with who you are.
2. **No fluff.** Cut words like "leverage," "synergy," "digital transformation," "crafting excellence."
3. **No em dashes.** Use periods or commas instead.
4. **No industry-boxing.** Don't say "we build for biotech/wellness/fintech." Say the problem, not the niche.
5. **Trust at every scroll point.** Social proof, process visibility, risk reversal.
6. **Show, don't claim.** "Here's what we built" beats "we're the best" every time.
7. **One CTA per section.** Don't give visitors 5 choices. Give them one clear action.
8. **Conversational, not corporate.** Write like you're explaining to a smart friend, not a boardroom.

## Component Patterns

Standard sections every site should consider:

- **Hero:** Problem headline + subtext + 2 CTAs (primary action, secondary proof) + process mini-flow
- **Features/Differentiators:** What makes this different, framed as outcomes not capabilities
- **Case Studies:** Problem → Process → Result cards with tech tags
- **Process Flow:** Numbered steps (Discover → Design → Develop → Deliver)
- **TRAIN Grid:** 5 cards showing the design system
- **Trust CTA:** Urgency headline + "Free consultation · No commitment · Response within 24 hours"
- **Contact Form:** Minimal fields (name, email, message). No subject field.

## Design Defaults

- **Buttons:** `rounded-full`, `text-sm font-medium`, black bg / white text for primary
- **Cards:** `rounded-xl border bg-background`, `hover:border-black/20 transition-colors`
- **Section spacing:** `py-32` for major sections, `mb-20` between sub-sections
- **Container:** Centered, `max-w-4xl` for content, `2rem` padding
- **Section labels:** `text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block`
- **Headings:** `tracking-tight leading-tight`, `text-4xl md:text-6xl font-bold`
- **Body text:** `text-muted-foreground leading-relaxed`
- **Animations:** Framer Motion `initial={{ opacity: 0, y: 20 }}` → `animate/whileInView={{ opacity: 1, y: 0 }}`

## Anti-Patterns (Never Do This)

- No template language ("elevate your brand," "digital excellence," "world-class solutions")
- No fake metrics or testimonials
- No empty sub-pages (if there's no content, delete the page)
- No features without outcomes (don't say "responsive design," say "works perfectly on every device your customers use")
- No "about us" before "about your problem"
- No more than 2 font weights per page
- No decorative elements that don't serve comprehension
- No walls of text without visual breaks

## Quality Bar

- Mobile-first responsive
- 90+ Google PageSpeed
- SEO meta tags and OG tags on every page
- Analytics-ready (tracking setup)
- Accessible (semantic HTML, alt text, keyboard nav)
- All forms tested with real submissions
- Error states handled and styled
- Loading states present
