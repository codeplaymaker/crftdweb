# CrftdWeb — Project Overview

## What We Do

CrftdWeb builds premium, hand-coded websites and web applications for businesses that understand the value of exceptional design. We are not a template agency. We compete on quality, not price.

## Current Platform

The CrftdWeb codebase is a Next.js 14+ monorepo running on Vercel. It hosts multiple products:

| Product | Route | Status |
|---------|-------|--------|
| Marketing site | `/` | Live |
| Rep portal | `/rep` | In development — making production-ready |
| Admin portal | `/admin` | In development |
| Truth Engine | `/engine` | In development |
| Client portal | `/client` | Planned |

## Services & Pricing

| Package | What It Is | Price | Timeline |
|---------|------------|-------|----------|
| Starter | One page, one goal, one CTA | £997 | 1–2 weeks |
| Launch | Full conversion-focused site | £2,497 | 2–3 weeks |
| Growth | Launch + blog, booking, CMS | £4,997 | 3–5 weeks |
| Scale | Custom web app, auth, dashboard | £9,997+ | 6–12 weeks |

## Sales Model

Sales are driven by a **commission-only rep program**. Independent reps cold outreach businesses, qualify them, and book discovery calls. CrftdWeb closes the deal and pays tiered commission (20% Starter, 15% Launch, 12% Growth, 10% Scale) within 7 days of client deposit.

Reps operate through the rep portal at `/rep` which provides:
- Lead pipeline management (Kanban: contacted → won/lost)
- Commission tracking (pending/paid)
- AI-powered sales training (drills, roleplay, 6-category scoring)
- Live call assistant (AI prep, transcription, real-time coaching)
- Daily activity targets and rank progression (rookie → ace)

## Tech Stack

- **Framework:** Next.js 14+ App Router, TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Auth:** Firebase Auth (email/password for reps, cookie token for admin)
- **Database:** Firestore
- **AI:** OpenAI (GPT-4, Whisper, TTS)
- **Email:** Resend API
- **Deployment:** Vercel
- **Testing:** Vitest

## Design System — TRAIN

| Letter | Principle |
|--------|-----------|
| T | Typography — max 2 font families, hierarchy through weight/size |
| R | Restraint — max 2–3 colors, no decoration for decoration's sake |
| A | Alignment — grid-based, geometric precision |
| I | Image Treatment — consistent processing across all visuals |
| N | Negative Space — generous padding, let ideas breathe |

## Immediate Priorities (April 2026)

1. **Rep portal production-ready** — every feature functional, tests passing, reps can sign in and use it
2. **First batch of reps onboarded** — trial reps active, pipeline being filled
3. **Admin portal complete** — admin can manage reps, view all leads, mark commissions paid

## Repository Structure

```
src/
  app/           → Pages (App Router, file-based routing)
  components/    → Reusable UI components
  lib/           → Firebase, utilities, hooks, services, types
  fonts/         → Local font files
  styles/        → Global styles
  types/         → TypeScript type definitions
  __tests__/     → Vitest test suites
public/          → Static assets
docs/            → Project documentation
scripts/         → Seed scripts, admin utilities
.github/
  agents/        → Custom VS Code Copilot agents
```
