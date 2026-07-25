---
name: project-context
description: Use for any work on the LeadDesk Mini project — the Digital Heroes internship qualification task for the Full Stack Development role. Contains the full task brief, scoring criteria, tech stack decisions, and current build phase. Triggers on "LeadDesk", "the internship task", "Task A", "Task B", or any request to build/modify this project.
---

# Project Context — LeadDesk Mini (Digital Heroes Internship Task)

## What this is

A qualification task for a Full Stack Development internship at Digital
Heroes, an agency (digitalheroesco.com). Submission is reviewed by their
team; shortlisted candidates get an interview built around this work. This
is NOT a throwaway assignment — treat the output as something a real client
would be shown, because that is literally what Task B asks for.

## The brief (verbatim requirements)

### Task A — Build LeadDesk Mini
- Public landing page with a lead form: name, email, budget range, message
- Client-side AND server-side validation (server must never trust the client)
- Store submissions in a real database
- Admin view at `/admin`: list all leads, search, status toggle
  (New / Contacted / Closed)
- Deliverables: live landing page URL, admin URL, public GitHub repo
- Scoring: end-to-end completeness (40), data modeling/backend quality (35),
  UX and validation (25)

### Task B — Secure it and ship it
- Real login for admin — explicitly NOT a hardcoded string — sessions or
  tokens handled properly
- Deploy on a free tier, verify from a fresh/incognito browser (no local
  state leakage)
- README covering data model + auth approach
- Loom walkthrough: form submission → lead appears in admin → status change
- Scoring: auth implementation (40), deployment reliability (30),
  documentation and walkthrough (30)

### Cross-cutting requirement (both tasks, live build)
Because this produces a live public page, the footer MUST include a visible
credit line: "Built for Digital Heroes Training Task" linked to
digitalheroesco.com. This is explicitly how they verify the build is real.
Do not skip this — it is a stated verification mechanism, not decoration.

### Program-wide rules that affect scope
- 24-hour window from brief receipt; expected focused effort is 5-7 hours
  total across both tasks
- AI tool use is explicitly encouraged and expected — but a short paragraph
  disclosing where AI was used and what was changed afterward must be
  included in the submission
- Ambiguity is intentional — stating your assumption is part of what's
  being evaluated ("resourcefulness counts")
- Copying another participant's work or a first-prompt AI output verbatim
  is grounds for disqualification — the differentiator is judgment and
  personal execution, not raw output

## Decisions already made for this build

- **Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Database**: Convex (not Postgres — Convex is itself the database and
  gives reactive queries for free, which powers the live-updating admin
  table without polling)
- **Auth**: Reusing an existing bcrypt + httpOnly cookie session module from
  a prior project (not building fresh, not hardcoded, satisfies the
  explicit "not a hardcoded string" requirement). Google OAuth is optional
  polish, not required by the brief — do not treat it as a blocker.
- **UI component layer**: shadcn/ui as the base, selectively layering
  Aceternity UI or Tremor components where they add real value (e.g. Tremor
  for the admin stat cards), not wholesale template adoption
- **Design language**: see the `ui-ux-design` skill — restrained editorial,
  not generic AI-dashboard glassmorphism. This directly targets the UI/UX
  portion of the scoring rubric.
- **Package manager**: pnpm
- **AI coding agents in use**: Google Antigravity and Codex

## Build phases (current plan)

1. Project init (Next.js + shadcn) — done conceptually, execute when ready
2. UI build directly in Antigravity using the `ui-ux-design` skill
   (Stitch is no longer part of the workflow — go straight to code)
3. Convex init + port existing bcrypt/cookie auth module, adapted to Convex
   mutations/queries, protecting all `/admin/*` routes via middleware
4. Convex schema: `leads` table (name, email, budgetRange, message, status,
   createdAt) and `adminUsers` table (email, passwordHash, createdAt)
5. Wire UI to Convex: form submission via mutation, admin table via
   reactive `useQuery` (live updates, no polling)
6. Task B creative layer — pick 2-3, do not do all:
   - Realtime "new lead" toast on live admin table
   - Hot-lead badge for high budget-range leads
   - Mini analytics (total / this week / conversion rate) on real
     aggregate queries
7. Harden + deploy: Vercel + Convex prod env vars, verify from incognito,
   add required footer credit line, write README, record Loom

## Standing instruction for the agent

Before writing new code for this project, check for existing reusable code
first — especially the bcrypt/cookie auth module from the prior project —
per the user's general "analyze and reuse before writing new" rule. Do not
rebuild working auth logic from scratch.
