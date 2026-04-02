# Post-Launch Checklist

> Run through this before every deployment. Can also be used as an audit tool on existing sites.

---

## 1. Playbook Alignment

- [ ] Every page headline is problem-first (about the visitor, not about you)
- [ ] No template language ("digital transformation," "crafting excellence," "world-class")
- [ ] No fake metrics or testimonials
- [ ] Trust signals present (proof, process visibility, risk reversal)
- [ ] One clear CTA per section
- [ ] No empty pages (if there's nothing to say, delete the page)
- [ ] Copy is conversational, not corporate

## 2. TRAIN Design Check

- [ ] **Typography:** Max 2 font families, clear hierarchy, readable at all sizes
- [ ] **Restraint:** Max 2-3 colors used consistently, no rainbow UI
- [ ] **Alignment:** Grid consistency, nothing feels "off" or misaligned
- [ ] **Image Treatment:** All images processed consistently (same style, same quality)
- [ ] **Negative Space:** Generous padding, nothing feels cramped, content can breathe

## 3. Mobile QA

- [ ] Tested at 375px (iPhone SE / small phones)
- [ ] Tested at 768px (iPad / tablets)
- [ ] Tested at 1440px (desktop)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Text is readable without zooming on mobile
- [ ] Buttons and links are easily tappable (44px minimum hit area)
- [ ] Images don't overflow or break layout on mobile
- [ ] Navigation works on mobile (hamburger menu, drawer, etc.)

## 4. Performance

- [ ] Google PageSpeed score 90+ (mobile)
- [ ] Google PageSpeed score 90+ (desktop)
- [ ] Sub-2 second load time
- [ ] Images optimized (WebP/AVIF, proper sizing, lazy loading)
- [ ] No unused CSS or JavaScript bundles
- [ ] Fonts preloaded or using `next/font`

## 5. SEO

- [ ] Unique `<title>` on every page
- [ ] Unique `<meta name="description">` on every page
- [ ] Open Graph tags present (og:title, og:description, og:image)
- [ ] Twitter card meta present
- [ ] Semantic HTML (h1 → h2 → h3 hierarchy, not just styling)
- [ ] Alt text on all images
- [ ] Sitemap generated
- [ ] robots.txt present
- [ ] Canonical URLs set

## 6. Functionality

- [ ] All forms tested with real submissions (not just visual check)
- [ ] Form validation works (required fields, email format, error messages)
- [ ] Success states show after form submission
- [ ] All internal links work (no 404s)
- [ ] All external links open in new tabs
- [ ] Authentication flows work (if applicable: signup, signin, signout)
- [ ] Error pages styled (404, 500)
- [ ] Loading states present where needed

## 7. Accessibility

- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] Screen reader friendly (semantic HTML, aria labels where needed)
- [ ] No content depends solely on color to convey meaning

## 8. Analytics & Tracking

- [ ] Google Analytics or equivalent installed
- [ ] Form submissions tracked as conversions
- [ ] Key pages have event tracking (CTA clicks, outbound links)
- [ ] No tracking scripts blocking page render

## 9. Security & Hosting

- [ ] HTTPS enabled (SSL certificate active)
- [ ] Environment variables secured (not in client-side code, not in git)
- [ ] Firebase API keys restricted to allowed domains in Firebase Console
- [ ] No API keys (OpenAI, Resend, Firebase Admin) exposed in client-side bundles
- [ ] Firebase Admin SDK credentials in server-only env vars
- [ ] Admin routes protected (middleware checks `admin_token` cookie)
- [ ] Rep routes protected (Firebase Auth redirect in place)
- [ ] Firestore security rules deployed and tested
- [ ] Domain configured correctly (www redirect, etc.)
- [ ] Favicon and app icons present

## 10. Final Visual Pass

- [ ] Screenshot every page on mobile and desktop
- [ ] Compare against the TRAIN principles one more time
- [ ] Read all copy out loud (catches awkward phrasing)
- [ ] Have someone who hasn't seen it browse for 30 seconds and tell you what the site does

---

## Rep Portal — Production Readiness Checklist

Run through this before releasing the rep portal to reps.

### Auth & Access
- [ ] Rep can sign in with email/password at `/rep/signin`
- [ ] Unauthenticated users redirected to signin from all `/rep/*` routes
- [ ] Admin can log in at `/admin/login` with token cookie
- [ ] Unauthenticated users redirected from all `/admin/*` routes
- [ ] Sign out works and clears session

### Rep Portal Features
- [ ] Dashboard loads with real Firestore data (leads count, commissions, weekly additions)
- [ ] Rep can add a new lead
- [ ] Rep can edit an existing lead
- [ ] Rep can delete a lead
- [ ] Rep can move leads through all pipeline stages (contacted → interested → call_booked → proposal_sent → won/lost)
- [ ] Commissions page shows pending and paid commissions accurately
- [ ] Training drill completes and returns a score
- [ ] Training roleplay completes and scores all 6 categories (discovery, listening, objection_handling, closing, rapport, control)
- [ ] Rep rank updates correctly based on scores (rookie → canvasser → booker → hunter → ace)
- [ ] Unlock threshold (avg 60+) enforces rep status correctly
- [ ] Live call assistant generates prep notes
- [ ] Live call transcription works
- [ ] Live call AI suggestions generate correctly
- [ ] Resources page shows commission calculator and daily targets

### Admin Features
- [ ] Admin can view all reps
- [ ] Admin can create a new rep (Firebase Auth + Firestore profile)
- [ ] Admin can send login email to rep (Resend)
- [ ] Admin can view all leads from all reps
- [ ] Admin can view all commissions
- [ ] Admin can mark a commission as paid
- [ ] Applicant pipeline works (view applicants, update status, send booking links)

### Tests & Quality
- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] No console errors on any rep or admin page
- [ ] No broken loading states or unhandled error states

These are the last gaps holding the site back. Code is done. These require real client input.

### 1. Get testimonials from your 3 clients
Email each one. Ask: *"What was the problem before, and what changed after we launched?"*
One sentence is enough. Get their name, role, and company.

- [ ] Microbiome Design — contact client for quote
- [ ] The Life Lab HQ — contact client for quote
- [ ] MPM Trading — contact client for quote

Once you have the quotes, fill them into `src/components/Testimonials.tsx` (placeholder structure is already built).

Then add `<Testimonials />` to `src/app/page.tsx` between `<Work />` and `<Industries />`.

### 2. Add one real metric to at least one case study
In `src/components/Work.tsx`, update the `result` field for whichever client can give you a number.
Even one stat changes everything — sign-ups, inquiries, load time improvement, anything measurable.

### 3. Add Testimonials to the homepage
```tsx
// src/app/page.tsx — add this import
import Testimonials from "@/components/Testimonials";

// Add between <Work /> and <Industries />
<Testimonials />
```

