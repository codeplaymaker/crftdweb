# Engine ↔ Playbook Integration Plan

## The Core Idea

Playbook is the **thinking layer** — diagnose where you are, figure out what to do.  
Engine is the **doing layer** — execute with AI once you know what to build.

Right now they're siloed. They share the same Firebase user and the data bridge already exists (`playbookProgress` collection). The connection is a few reads and context injections, not a rebuild.

---

## Connection Points

| Playbook Stage | Trigger | Engine Action |
|---|---|---|
| **Diagnose** complete | Score calculated, stage identified | Engine dashboard shows stage-appropriate path (launching vs scaling) |
| **Productize** worksheet answered | `worksheetAnswers` saved to Firestore | "Build this in Engine →" button opens Offer Builder pre-filled with their answers |
| **Systemize** — system identified | User marks a system as active | Engine surfaces the relevant AI Agent for that system |
| **Prove** — case study built | Case study saved | Sales Asset Architect opens with client data pre-loaded |
| **Scale** — fulfillment bottleneck identified | Scale module progress | Engine opens Workspaces + Skills Builder with context |

---

## Data Already Available

`playbookProgress` Firestore doc (keyed by userId) contains:
- `diagnosisScore` + `diagnosisStage` → Engine knows where they are
- `businessInfo` (name, type, revenue, goal) → Engine can pre-fill offers and agents
- `worksheetAnswers` → Maps directly to Offer Builder fields
- `milestones` → Engine can surface next logical tool
- `systemStatuses` → Engine knows which systems are built vs gaps

---

## What Playbook Gets From Engine

- After running Truth Engine → Playbook Diagnose can reference niche viability score
- After building an offer → Playbook Productize step auto-marks as complete
- Agent usage → Playbook Systemize can track which systems are being actively used

---

## Implementation Order (when ready)

1. **Read playbookProgress in Engine dashboard** — detect stage, show relevant path prompt
2. **"Continue in Engine" CTA on Playbook productize** — carry `worksheetAnswers` into Offer Builder via localStorage (same pattern as `currentOfferContext`)
3. **Engine→Playbook write-backs** — when offer saved, mark productize milestone; when Truth Engine run, mark diagnose milestone
4. **Unified onboarding** — first login checks if Playbook diagnose is complete; if not, prompt it before Engine dashboard

---

## Why This Matters vs Cook AI

Cook AI has no equivalent of Playbook. Their onboarding is a sales call.  
The **diagnose-then-execute pipeline** is a fuller and more self-serve system — users understand *why* they're using each tool, not just *what* it does. That's a retention and results differentiator.

---

## Status

- [ ] Not started
- Prerequisite: Engine Workspaces concept built first
- Estimated complexity: Low (data bridge already exists, mostly UI and routing)
