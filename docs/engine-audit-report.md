# Engine Section — Comprehensive Audit Report

**Date:** Generated from full codebase review  
**Scope:** Every file under `src/app/engine/`, `src/app/api/engine/`, `src/lib/engine/`, and related components  
**Files Audited:** 38 files across pages, API routes, and library code

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 HIGH | 16 |
| 🟡 MEDIUM | 14 |
| 🟢 LOW | 8 |

---

## 🔴 HIGH SEVERITY

### H-01: "Delete Account" button has no handler
**File:** `src/app/engine/dashboard/settings/page.tsx` — Line 228  
**Issue:** The "Delete Account" button in the Danger Zone section renders with no `onClick` handler. Clicking it does nothing. This is especially dangerous UX — showing a destructive action that silently does nothing erodes trust.
```tsx
<button className="border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
  Delete Account
</button>
```
**Fix:** Wire to a confirmation modal → `deleteUser()` from Firebase Auth + delete Firestore user doc + sign out.

---

### H-02: Notification bell button has no handler
**File:** `src/app/engine/dashboard/layout.tsx` — Line 172  
**Issue:** The notifications bell icon button in `DashboardHeader` has no `onClick`, no notification count, and no dropdown. It's purely decorative.
```tsx
<button className="p-2 text-white/60 hover:text-white transition-colors">
  <svg>...bell icon...</svg>
</button>
```
**Fix:** Either remove it or wire to a notifications panel/dropdown.

---

### H-03: "Generate New Opportunities" button has no handler
**File:** `src/app/engine/dashboard/page.tsx` — Line 347  
**Issue:** The prominent CTA button at the bottom of the AI Opportunities card has no `onClick`. Users see it, click it, and nothing happens.
```tsx
<button className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl ...">
  Generate New Opportunities
</button>
```
**Fix:** Wire to a handler that navigates to Truth Engine or triggers opportunity generation.

---

### H-04: All help center article links are dead (`href="#"`)
**File:** `src/app/engine/help/page.tsx` — Lines 22-102  
**Issue:** Every single article link across all 6 help categories (24 articles total) points to `href="#"`. Users clicking any help article go nowhere.
```tsx
articles: [
  { title: 'Quick Start Guide', href: '#' },
  { title: 'Creating Your First Truth Report', href: '#' },
  ...
]
```
**Fix:** Create actual help content pages or link to external docs, or mark these as "Coming Soon."

---

### H-05: Help page search input is completely unwired
**File:** `src/app/engine/help/page.tsx` — Lines 125-131  
**Issue:** The search bar has no state, no `onChange`, no search logic. It's a visual-only input.
```tsx
<input
  type="text"
  placeholder="Search for help..."
  className="..."
/>
```
**Fix:** Add state + filter logic or remove the search bar.

---

### H-06: Password validation mismatch on signup
**File:** `src/app/engine/signup/page.tsx`  
**Issue:** The UI hint on line 135 says "Must be at least 8 characters" but the actual validation on line 22 checks `password.length < 6`. Users who enter 6-7 character passwords will succeed despite the on-screen guidance saying 8.
```tsx
// Line 22 - actual validation
if (password.length < 6) {
// Line 135 - displayed hint
<p className="text-white/30 text-xs mt-2">Must be at least 8 characters</p>
```
**Fix:** Align both to the same value (recommend 8 for security).

---

### H-07: Pricing page plan params are ignored by signup
**File:** `src/app/engine/pricing/page.tsx` — Line 42 | `src/app/engine/signup/page.tsx`  
**Issue:** Pricing page links include `?plan=pro` and `?plan=agency` in the signup URLs, but the signup page never reads `searchParams` and doesn't set or store the selected plan.
```tsx
// pricing/page.tsx
href: '/engine/signup?plan=pro',
// signup/page.tsx — no useSearchParams, no plan handling
```
**Fix:** Read `searchParams.get('plan')` in signup and store it in Firestore on account creation.

---

### H-08: Integrations "Connect" fakes the connection
**File:** `src/app/engine/dashboard/integrations/page.tsx` — Lines ~310-340  
**Issue:** Clicking "Connect" on any integration (Notion, Zapier, HubSpot, etc.) just saves a record to Firestore with a random `recordCount`. No real OAuth flow, no API key exchange, no actual connection. Users think they're connected but no data ever syncs.
**Fix:** Implement real OAuth flows or clearly mark all integrations as "Coming Soon."

---

### H-09: Integration "Settings" buttons have no handler
**File:** `src/app/engine/dashboard/integrations/page.tsx` — Connected integration cards  
**Issue:** Each connected integration card has a gear/settings icon, but the button does nothing when clicked.
**Fix:** Add settings modal for API key management, sync preferences, etc.

---

### H-10: "View API Docs" button has no handler
**File:** `src/app/engine/dashboard/integrations/page.tsx` — Line ~510  
**Issue:** The "View API Docs" button in the API Access card has no `onClick`, no `href`, renders as a dead button.
```tsx
<button className="w-full py-3 bg-white/10 text-white rounded-xl ...">
  View API Docs
</button>
```
**Fix:** Either create API docs and link, or remove the button.

---

### H-11: Analytics date range filter doesn't filter data
**File:** `src/app/engine/dashboard/analytics/page.tsx` — Lines 243-254  
**Issue:** The 7d/30d/90d/All buttons update `dateRange` state but the data fetching (`loadAnalytics`) doesn't use `dateRange` at all — it always loads ALL data regardless of selection.
**Fix:** Pass `dateRange` to the Firestore query and filter by `createdAt` timestamp.

---

### H-12: Analytics "Export" button has no handler
**File:** `src/app/engine/dashboard/analytics/page.tsx` — Line 261  
**Issue:** The Export button renders with an icon but no `onClick` handler.
```tsx
<button className="flex items-center gap-2 px-3 py-2 ... text-gray-400 text-sm">
  <Download className="w-4 h-4" />
  Export
</button>
```
**Fix:** Wire to CSV/PDF export functionality.

---

### H-13: Funnel card Settings button has no handler
**File:** `src/app/engine/dashboard/funnels/page.tsx` — Line 132  
**Issue:** The Settings (gear icon) button on each funnel card has no `onClick`.
```tsx
<button className="p-2 bg-white/10 text-white/50 rounded-lg ...">
  <Settings className="w-4 h-4" />
</button>
```
**Fix:** Wire to funnel configuration modal.

---

### H-14: Notification preferences not persisted
**File:** `src/app/engine/dashboard/settings/page.tsx` — Lines 57-59, 196-211  
**Issue:** Notification toggle switches work in local state but are never saved to Firestore. Refreshing the page resets all toggles to defaults (`email: true, reports: true, marketing: true`).
**Fix:** Save notification preferences to the user's Firestore profile on toggle.

---

### H-15: Marketing navbar is not auth-aware
**File:** `src/app/engine/layout.tsx`  
**Issue:** The engine marketing layout never imports `useAuth` or checks authentication state. It always shows "Log in" and "Book a Call" buttons even when the user is already logged in. Should show "Dashboard" or "Go to Dashboard" for authenticated users.
**Fix:** Import `useAuth`, check `user` state, conditionally show "Dashboard" link.

---

### H-16: Changelog "Subscribe" form is unwired
**File:** `src/app/engine/changelog/page.tsx` — Lines 144-152  
**Issue:** The email subscribe input and "Subscribe" button have no state, no `onChange`, no `onSubmit`. Purely decorative.
```tsx
<input type="email" placeholder="Enter your email" className="..." />
<button className="bg-gradient-to-r from-purple-600 ...">Subscribe</button>
```
**Fix:** Wire to a mailing list service or remove.

---

## 🟡 MEDIUM SEVERITY

### M-01: Dashboard "Market Trends" data is entirely hardcoded
**File:** `src/app/engine/dashboard/page.tsx` — Lines 258-263  
**Issue:** The "Market Trends" section shows hardcoded data (AI-Powered Coaching +127%, Done-For-You Services +89%, etc.) labeled as "Real-time trend detection" with a "Live" badge. This is misleading — none of this data comes from any API or database.
**Fix:** Either source from real API data, derive from Truth Engine reports, or clearly label as sample data.

---

### M-02: Dashboard "AI Opportunities" data is entirely hardcoded
**File:** `src/app/engine/dashboard/page.tsx` — Lines 319-324  
**Issue:** Like Market Trends, AI Opportunities shows fabricated data (AI Accountability Partner SaaS, $2.4M/yr TAM, etc.) presented as "AI Scored."
**Fix:** Generate from actual Truth Engine reports or label as sample.

---

### M-03: Dashboard "Getting Started" checklist is static
**File:** `src/app/engine/dashboard/page.tsx` — Line 360  
**Issue:** The getting started checklist doesn't reflect actual user activity. Steps aren't dynamically checked based on whether the user has completed them.
**Fix:** Query Firestore for completed actions and dynamically check items.

---

### M-04: Sidebar credits always show ∞ with 100% bar
**File:** `src/app/engine/dashboard/layout.tsx` — Lines 143-147  
**Issue:** The credits section in the sidebar hardcodes `∞` and `width: '100%'` regardless of the `credits` prop passed in. The `credits` and `plan` props received from the profile are never used in the display.
```tsx
<span className="text-purple-400 font-semibold">∞</span>
...
<div ... style={{ width: '100%' }} />
```
**Fix:** Use the `credits` prop to show actual usage against limits.

---

### M-05: Whitelabel page has hardcoded metrics
**File:** `src/app/engine/whitelabel/page.tsx`  
**Issue:** Stats like "50+ Whitelabel Partners" and "$2.4M Partner Revenue Generated" are hardcoded strings, not sourced from real data.
**Fix:** Source from database or clearly mark as aspirational projections.

---

### M-06: `lib/engine/ai-service.ts` appears to be dead code
**File:** `src/lib/engine/ai-service.ts` (240 lines)  
**Issue:** This entire file duplicates agent system prompts and contains mock response generators, but nothing imports or uses it. The actual API routes (`src/app/api/engine/*.ts`) define their own prompts and call OpenAI directly. The `generateMockAIResponse` function is never called.
**Fix:** Delete the file or consolidate as the single source of truth for agent prompts.

---

### M-07: `generateMockResponse` defined but never used in agents page
**File:** `src/app/engine/dashboard/agents/page.tsx` — ~Lines 157-220  
**Issue:** A large `generateMockResponse` function is defined inside the component but never called — the real API at `/api/engine/chat` is used instead. Dead code inflating bundle size.
**Fix:** Remove the unused function.

---

### M-08: Integration sync activity is fabricated
**File:** `src/app/engine/dashboard/integrations/page.tsx` — `SyncActivity` component  
**Issue:** The "Recent Sync Activity" sidebar generates synthetic activity data from the connected integrations list with random record counts. No real sync ever occurs.
**Fix:** Remove fake activity or connect to real sync events.

---

### M-09: Sidebar doesn't collapse on mobile
**File:** `src/app/engine/dashboard/layout.tsx` — Line 107  
**Issue:** The sidebar is `fixed left-0 w-64` with no responsive collapse mechanism. On mobile viewports (<768px), the 256px fixed sidebar will overlap content with no hamburger menu to toggle it.
```tsx
<aside className="fixed left-0 top-0 h-full w-64 bg-black/50 border-r border-white/10 z-40">
```
**Fix:** Add a responsive hamburger toggle and hide sidebar on mobile by default.

---

### M-10: 30 `console.error` calls across dashboard files
**Files:** Multiple (see list below)  
**Issue:** Production code has 30 `console.error` statements that will leak error details to browser console. No structured error reporting (e.g., Sentry) is used.

Files affected:
- `dashboard/settings/page.tsx` (1)
- `dashboard/agents/page.tsx` (4)
- `dashboard/offers/new/page.tsx` (2)
- `dashboard/offers/page.tsx` (3)
- `dashboard/offers/[id]/page.tsx` (4)
- `dashboard/page.tsx` (1)
- `dashboard/truth/page.tsx` (1)
- `dashboard/content/page.tsx` (2)
- `dashboard/funnels/page.tsx` (4)
- `dashboard/analytics/page.tsx` (1)
- `dashboard/integrations/page.tsx` (3)
- `dashboard/reports/page.tsx` (2)
- `dashboard/reports/[id]/page.tsx` (2)

**Fix:** Replace with a centralized error reporting service and user-facing toast notifications.

---

### M-11: Help page quick links are self-referencing
**File:** `src/app/engine/help/page.tsx` — Lines 149-150  
**Issue:** "Video Tutorials" and "Community Forum" quick links both point to `/engine/help` (the current page). They lead nowhere useful.
```tsx
{ label: 'Video Tutorials', icon: '🎬', href: '/engine/help' },
{ label: 'Community Forum', icon: '💬', href: '/engine/help' },
```
**Fix:** Point to actual destinations or remove.

---

### M-12: Changelog release dates are future-dated
**File:** `src/app/engine/changelog/page.tsx` — Lines 9-55  
**Issue:** Changelog entries reference future dates (February 4, 2026; January 15, 2026) making the changelog appear fabricated rather than historical.
**Fix:** Update to actual release dates or mark as roadmap.

---

### M-13: Duplicate PDF export code (~500 lines each)
**Files:** `src/app/engine/dashboard/truth/page.tsx` and `src/app/engine/dashboard/reports/[id]/page.tsx`  
**Issue:** Both files contain nearly identical PDF export functions using jsPDF, each ~500 lines. This is a significant maintenance burden — any PDF styling change must be replicated in two places.
**Fix:** Extract to a shared utility at `src/lib/engine/pdf-export.ts`.

---

### M-14: Avatar upload handler does nothing
**File:** `src/app/engine/dashboard/settings/page.tsx` — Lines 50-52  
**Issue:** The `handleAvatarClick` opens a hidden file input, but there's no `onChange` handler on the file input to actually upload the selected file.
```tsx
const handleAvatarClick = () => {
  fileInputRef.current?.click();
};
// No onChange handler on the <input type="file">
```
**Fix:** Add file upload to Firebase Storage + update profile avatar URL.

---

## 🟢 LOW SEVERITY

### L-01: Security page claims "Zero-Knowledge Architecture"
**File:** `src/app/engine/security/page.tsx`  
**Issue:** Claims "Zero-Knowledge Architecture — Your research data is completely private. We cannot access your business insights." This is factually incorrect — data is stored in Firestore where admins can access it. Potentially misleading legal claim.
**Fix:** Revise to accurately describe data access model.

---

### L-02: Security page lists certifications not yet achieved
**File:** `src/app/engine/security/page.tsx`  
**Issue:** Lists "SOC 2 (In Progress)" and "ISO 27001 (Planned)" as certifications. While labeled, the visual presentation alongside achieved certifications could be misleading.
**Fix:** Clearly separate achieved vs. in-progress vs. planned certifications.

---

### L-03: Webhook configuration is decorative
**File:** `src/app/engine/dashboard/integrations/page.tsx` — Lines ~520-540  
**Issue:** The Webhooks card shows hardcoded webhook statuses (New Lead: Active, Offer Created: Active, Report Generated: Inactive) with no ability to configure them.
**Fix:** Either wire to real webhook management or remove.

---

### L-04: Truth public page stats are animated but fabricated
**File:** `src/app/engine/truth/page.tsx` — Lines 254-261  
**Issue:** The animated counters (847 Pain Points, 2,400 Demand Signals, 156 Market Gaps, 23 Opportunities) shown on "Scanning 10,000+ Signals" are hardcoded values animated for visual effect.
**Fix:** Minor issue for a marketing page, but consider sourcing from real aggregate data.

---

### L-05: `<select>` elements use `className="bg-black"` for options
**Files:** Multiple dashboard pages  
**Issue:** Some `<option>` elements use `className="bg-black"` which may not render correctly in all browsers (Firefox ignores option styling).
**Fix:** Use a custom select/dropdown component for consistent cross-browser styling.

---

### L-06: No API route authentication
**Files:** `src/app/api/engine/chat/route.ts`, `src/app/api/engine/content/route.ts`, `src/app/api/engine/offer-autofill/route.ts`, `src/app/api/engine/truth/route.ts`  
**Issue:** None of the API routes verify Firebase auth tokens. They check for OpenAI/Perplexity API keys but don't validate the requesting user's identity. Anyone with the API URLs can make requests.
**Fix:** Add Firebase Admin SDK token verification to all API routes.

---

### L-07: No loading/error boundaries on marketing pages
**Files:** `src/app/engine/truth/page.tsx`, `src/app/engine/pricing/page.tsx`, `src/app/engine/whitelabel/page.tsx`  
**Issue:** Marketing pages have no error boundaries. If framer-motion or any component fails, the entire page crashes with the global error page.
**Fix:** Add error boundaries around animated sections.

---

### L-08: Missing `aria-label` on icon-only buttons
**Files:** Multiple dashboard pages  
**Issue:** Several icon-only buttons (notification bell, settings gear, play/pause, export) lack `aria-label` attributes, making them inaccessible to screen readers.
**Fix:** Add descriptive `aria-label` to all icon-only interactive elements.

---

## Files Audited (Complete List)

### Pages (30 files)
| File | Status |
|------|--------|
| `src/app/engine/layout.tsx` | Has issues (H-15) |
| `src/app/engine/page.tsx` | Clean |
| `src/app/engine/signin/page.tsx` | Clean |
| `src/app/engine/signup/page.tsx` | Has issues (H-06) |
| `src/app/engine/forgot-password/page.tsx` | Clean |
| `src/app/engine/pricing/page.tsx` | Has issues (H-07) |
| `src/app/engine/demo/page.tsx` | Clean |
| `src/app/engine/demo/layout.tsx` | Clean |
| `src/app/engine/help/page.tsx` | Has issues (H-04, H-05, M-11) |
| `src/app/engine/whitelabel/page.tsx` | Has issues (M-05) |
| `src/app/engine/changelog/page.tsx` | Has issues (H-16, M-12) |
| `src/app/engine/truth/page.tsx` | Has issues (L-04) |
| `src/app/engine/privacy/page.tsx` | Clean |
| `src/app/engine/terms/page.tsx` | Clean |
| `src/app/engine/security/page.tsx` | Has issues (L-01, L-02) |
| `src/app/engine/dashboard/layout.tsx` | Has issues (H-02, M-04, M-09) |
| `src/app/engine/dashboard/page.tsx` | Has issues (H-03, M-01, M-02, M-03) |
| `src/app/engine/dashboard/truth/page.tsx` | Has issues (M-13) |
| `src/app/engine/dashboard/offers/page.tsx` | Has issues (M-10) |
| `src/app/engine/dashboard/offers/new/page.tsx` | Has issues (M-10) |
| `src/app/engine/dashboard/offers/[id]/page.tsx` | Has issues (M-10) |
| `src/app/engine/dashboard/agents/page.tsx` | Has issues (M-07, M-10) |
| `src/app/engine/dashboard/content/page.tsx` | Has issues (M-10) |
| `src/app/engine/dashboard/funnels/page.tsx` | Has issues (H-13, M-10) |
| `src/app/engine/dashboard/analytics/page.tsx` | Has issues (H-11, H-12, M-10) |
| `src/app/engine/dashboard/integrations/page.tsx` | Has issues (H-08, H-09, H-10, M-08, L-03) |
| `src/app/engine/dashboard/reports/page.tsx` | Has issues (M-10) |
| `src/app/engine/dashboard/reports/[id]/page.tsx` | Has issues (M-13, M-10) |
| `src/app/engine/dashboard/settings/page.tsx` | Has issues (H-01, H-14, M-14) |
| `src/app/engine/pricing/layout.tsx` | Clean |

### API Routes (4 files)
| File | Status |
|------|--------|
| `src/app/api/engine/chat/route.ts` | Has issues (L-06, M-10) |
| `src/app/api/engine/content/route.ts` | Has issues (L-06) |
| `src/app/api/engine/offer-autofill/route.ts` | Has issues (L-06, M-10) |
| `src/app/api/engine/truth/route.ts` | Has issues (L-06) |

### Library (1 file)
| File | Status |
|------|--------|
| `src/lib/engine/ai-service.ts` | Dead code (M-06) |

---

## Recommended Priority Order

**Immediate (ship-blocking):**
1. H-01: Delete Account button (dangerous UX)
2. H-06: Password validation mismatch
3. H-04 + H-05: Dead help center
4. H-08: Fake integrations
5. L-06: Unauthenticated API routes

**Next sprint:**
6. H-03, H-11, H-12, H-13: Dead buttons across dashboard
7. H-07: Plan param not passed through signup
8. H-14: Notification prefs not persisted
9. H-15: Auth-unaware marketing navbar
10. M-09: Mobile sidebar doesn't collapse

**Backlog:**
11. M-01, M-02, M-03, M-04: Hardcoded/fake dashboard data
12. M-06, M-07: Dead code cleanup
13. M-10: Replace console.error with error reporting
14. M-13: Deduplicate PDF export code
15. All LOW items
