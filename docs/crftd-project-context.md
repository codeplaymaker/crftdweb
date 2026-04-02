# CrftdWeb — Project Context

## What We Are

CrftdWeb is a boutique web design and development studio. We hand-code premium websites and web applications for businesses that understand the value of exceptional design. No templates. No page builders. Every line written from scratch.

We are positioned at the premium end of the market. We do not compete on price.

**One-line pitch:** "Most business websites look fine and do nothing. We fix that."

## What We Build

| Package | Description | Price | Timeline |
|---------|-------------|-------|----------|
| Landing Page | Single page, one goal, one CTA | £1,200 – £2,400 | 1–2 weeks |
| Business Website | 5–7 pages, full SEO, conversion-focused | £3,200 – £6,400 | 3–5 weeks |
| Web Application | Custom app with auth, dashboard, database | £6,400+ | 6–10 weeks |

## Who We Sell To

Small to medium businesses that:
- Have no website, or an outdated one that isn't converting
- Are serious about growth and understand investment
- Make decisions quickly — typically business owners, not procurement departments
- Value quality over cheapness

**Who to avoid:** Anyone who leads with "how cheap can you do it" or wants a site for under £500.

## Tech Stack

- **Framework:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS, CSS variables
- **Animation:** Framer Motion
- **Auth:** Firebase Authentication (email/password)
- **Database:** Firestore
- **AI:** OpenAI API (GPT-4, Whisper, TTS)
- **Email:** Resend
- **Deployment:** Vercel
- **Testing:** Vitest

## Business Model

Revenue comes from project fees. Sales are driven by a commission-only rep program.

### Sales Rep Program

CrftdWeb operates a distributed sales team of independent commission-only reps. Reps find businesses, qualify them, and book discovery calls. CrftdWeb closes the deal.

- **Commission rate:** 15% of confirmed project value
- **Payment:** Within 14 days of client deposit clearing
- **Rep management:** Via the rep portal at crftdweb.com/rep
- **Rep status:** trial → active → inactive
- **Training:** AI-powered roleplay and drill system with 6 scoring categories

## Platform Architecture

The codebase is a single Next.js application containing:

1. **Marketing site** — public-facing pages (home, about, work, services, blog, contact)
2. **Rep portal** (`/rep`) — sales rep management, leads, commissions, training, live call assistant
3. **Admin portal** (`/admin`) — internal management of reps, applicants, leads, commissions
4. **Engine** (`/engine`) — CrftdWeb's internal Truth Engine product (separate product, in development)
5. **Client portal** (`/client`) — client-facing project tracking

## Design Philosophy

Every design decision follows the **TRAIN** system:

| Letter | Principle | Rule |
|--------|-----------|------|
| **T** | Typography | Max 2 font families. Weight, size, and spacing communicate before words do. |
| **R** | Restraint | Max 2–3 colors. Less noise, more signal. |
| **A** | Alignment | Use grids and geometry. Precision = trust. |
| **I** | Image Treatment | Consistent processing creates instant recognition. |
| **N** | Negative Space | Space isn't there to fill — it's there to frame. |

## Copy Principles

1. Problem-first. Every headline answers "what's in it for the visitor."
2. No fluff. Cut "leverage," "synergy," "digital transformation," "crafting excellence."
3. No em dashes. Use periods or commas.
4. Show, don't claim. "Here's what we built" beats "we're the best" every time.
5. One CTA per section.
6. Conversational, not corporate.

## Key Contacts

- **Website:** crftdweb.com
- **Admin email:** admin@crftdweb.com
- **Rep sign in:** crftdweb.com/rep/signin
