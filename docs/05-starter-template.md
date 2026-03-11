# Starter Template Setup Guide

> Instructions for creating and using your CrftdWeb starter template repo.
> This doc describes what the template contains and how to use it for new client projects.

---

## Quick Start (Per New Project)

```bash
# 1. Clone the starter template
git clone https://github.com/codeplaymaker/crftdweb-starter.git client-name-site
cd client-name-site

# 2. Remove git history and start fresh
rm -rf .git
git init

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev

# 5. Open in Claude with your Project Context File + filled Client Intake
```

## What the Template Includes

### Folder Structure
```
src/
  app/
    layout.tsx          → Root layout with font, metadata, analytics
    page.tsx            → Homepage (Hero, Features, Work, CTA)
    globals.css         → CSS variables, Tailwind base
    contact/
      page.tsx          → Contact form (name, email, message)
    work/
      page.tsx          → Case studies page
    services/
      page.tsx          → Services with process, TRAIN, inclusions
    about/
      page.tsx          → About page with ecosystem/methodology
    actions/
      sendEmail.ts      → Server action for contact form
  components/
    Hero.tsx            → Problem-first hero with CTAs
    Features.tsx        → Differentiator cards
    Work.tsx            → Case study cards (Problem → Process → Result)
    CTA.tsx             → Trust CTA with urgency
    ProcessFlow.tsx     → Numbered step flow
    TrainGrid.tsx       → TRAIN design system visual
    Navbar.tsx          → Navigation
    Footer.tsx          → Footer with links
  lib/
    utils.ts            → cn() utility for Tailwind merging
  fonts/                → Local font files
  types/                → TypeScript definitions
public/
  favicon_io/           → Favicons (replace per project)
docs/
  01-project-context.md → Your system prompt (already included)
  02-client-intake.md   → Fill out per client
```

### Pre-Configured

- **Next.js 15** with App Router
- **TypeScript 5** strict mode
- **Tailwind CSS** with CSS variables for theming
- **Framer Motion** for animations
- **Lucide React** for icons
- **Inter font** via next/font
- **ESLint** configured
- **Vercel** deploy-ready (vercel.json if needed)

### CSS Variables (globals.css)

The template uses CSS variables so you can theme per client by changing a few values:

```css
:root {
  --background: 0 0% 100%;          /* White */
  --foreground: 0 0% 3.9%;          /* Near-black */
  --muted-foreground: 0 0% 45.1%;   /* Gray text */
  --accent: 0 0% 96.1%;             /* Light gray bg */
  --border: 0 0% 89.8%;             /* Border color */
}
```

### Placeholder Content

All pages ship with placeholder copy that follows the Copy Principles:
- Problem-first headlines
- No template language
- Trust signals and CTAs in place
- Just swap the specific business details

## Per-Project Customization Workflow

1. **Fill out Client Intake** → know the problem, customer, and goal
2. **Update metadata** in `layout.tsx` → title, description, OG tags
3. **Swap hero copy** → client's problem headline and subtext
4. **Update case studies** in `Work.tsx` → client's projects or remove if N/A
5. **Customize services/process** → adjust steps to match their offering
6. **Add real proof** → testimonials, logos, metrics when available
7. **Replace favicon and images** → client's brand assets
8. **Adjust CSS variables** → match client's brand colors
9. **Run Post-Launch Checklist** → verify everything before deploy
10. **Deploy to Vercel** → connect repo, push, live

## Creating the Repo

To create the actual starter template repo from your current CrftdWeb site:

```bash
# Create a new clean repo
mkdir crftdweb-starter && cd crftdweb-starter
git init

# Copy the structure from crftdweb (selectively)
# - Copy src/ (with placeholder content replacing your specific content)
# - Copy public/ (favicon structure only)
# - Copy config files (next.config.js, tailwind.config.ts, tsconfig.json, etc.)
# - Copy docs/01-project-context.md and docs/02-client-intake.md
# - Don't copy .env.local, .next/, node_modules/, or project-specific assets

# Initialize
npm install
git add -A
git commit -m "Initial starter template"
git remote add origin https://github.com/codeplaymaker/crftdweb-starter.git
git push -u origin main
```

## Notes

- Keep this template updated as your patterns improve
- After every project, ask: "Did I build a component worth adding to the template?"
- The template is your floor, not your ceiling. Every client project should exceed it.
