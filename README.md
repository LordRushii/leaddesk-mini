# LeadDesk Mini

A lead-capture product built for the Digital Heroes Full Stack Development
internship task: a public landing page with a lead form, and an admin
dashboard to manage submissions.

**Live app:** https://leaddesk-mini-jet-phi.vercel.app/
**Admin:** https://leaddesk-mini-jet-phi.vercel.app/admin

## Stack

- **Framework:** Next.js (App Router), TypeScript, React
- **Database:** Convex — real-time, reactive queries by default, no
  separate ORM or polling needed for the admin table to update live
- **Auth:** bcryptjs for password hashing, custom session tokens stored in
  Convex, httpOnly/secure/sameSite cookies
- **Validation:** Zod, shared between client and server
- **Forms:** React Hook Form + `@hookform/resolvers` (Zod resolver)
- **UI:** Tailwind CSS, shadcn/ui, Base UI primitives, `class-variance-authority`
- **Data table:** TanStack Table (admin lead list — sorting/search)
- **Icons & motion:** lucide-react, Framer Motion
- **Tooling:** ESLint, tsx (for the admin seed script), pnpm

## Data model

**`leads`** — `name`, `email`, `budgetRange`, `message`, `status` (New /
Contacted / Closed), `createdAt`

**`users`** — `name`, `email`, `passwordHash`, `role`, `createdAt`,
indexed by email for login lookup

**`sessions`** — `userId`, `sessionToken`, `expiresAt`, `createdAt`,
indexed by token

## Auth approach

Email + password, not a hardcoded credential. Passwords are hashed with
bcrypt (10 salt rounds). On login, a random session token is generated and
stored in Convex with a 7-day expiry, and set as an `httpOnly`, `secure`
(in production), `sameSite: strict` cookie — so it's never readable from
client-side JS and never sent cross-site. Next.js middleware checks for the
session cookie on every `/admin/*` request and redirects to `/admin/login`
if it's missing; the actual token is then verified against Convex
(existence + expiry) before any admin data is returned.

There's no self-seeding admin account. The first admin is created with
`pnpm seed:admin`, reading `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`
from environment variables — never committed, never hardcoded in source.

## Validation

One Zod schema per form (`leadSchema`, `loginSchema`, `registerSchema`) is
the single source of truth for validation — used by React Hook Form on the
client for instant inline errors, and re-run with `safeParse()` inside the
Convex mutation itself before any write happens. This means the rules can't
drift out of sync between client and server, and a request that skips the
UI entirely and calls the mutation directly still gets rejected if it
doesn't meet the same rules a real user would have to meet.

## Design decisions

1. **Convex over a traditional Postgres/Mongo setup.** Convex is itself the
   database and ships reactive queries by default — the admin lead table
   updates live via `useQuery` with no polling or manual refresh code.
2. **Validation lives in one place.** Rather than writing form rules twice
   (once for the UI, once for the API), the Zod schema is imported into
   both the client form and the Convex mutation, so there's exactly one
   definition of what a valid lead looks like.
3. **Session auth over hardcoded/simple auth.** Given this is explicitly an
   admin-facing tool that a client would use, real hashed passwords and
   expiring server-side sessions were treated as non-negotiable, not a
   nice-to-have.

## What AI was used for

Used Claude for planning, code review, and catching bugs; Google Antigravity
(free plan) and Codex (free plan) to scaffold components and implement
fixes. AI review caught that the Convex mutation wasn't actually enforcing
the Zod schema server-side, and flagged an early version that self-seeded a
default admin account with a fixed password. Both were fixed before this
submission. Design direction, the schema design, and the final auth flow
were my own decisions.

## Scope note

Built exactly what Task A and Task B ask for — public form with client +
server validation, real database, searchable admin view with status
toggle, real session-based login, and deployment. Nothing beyond that was
added, to keep the submission focused on what was actually being
evaluated.
