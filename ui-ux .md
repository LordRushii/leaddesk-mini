---
name: ui-ux-design
description: Use when building or styling any UI in this project — landing pages, dashboards, forms, tables, or any React/Next.js component with visual output. Enforces a restrained, editorial design language (Linear/Stripe-inspired) instead of generic dark-glassmorphism-purple-gradient AI-template defaults. Triggers on "build the landing page", "style this", "make it look good", "design the dashboard", "create the UI for X".
---

# UI/UX Design Language — Restrained Editorial

## Why this skill exists

The default AI-generated look — dark background, purple-to-indigo gradient,
glassmorphism cards, glowing borders — is what almost every AI coding agent
produces when asked for a "modern SaaS UI." It looks polished at a glance but
is generic and interchangeable with a thousand other AI-built products. This
skill exists to actively steer away from that default toward something a
paying client would trust and a design-literate evaluator would call
distinctive.

## When to use this skill

- Any time you are building a new page, screen, or component with visual UI
- Any time you are asked to "polish", "make it look better", or "add design"
- Before writing any Tailwind classes or shadcn component usage

## Hard constraints — always apply these

**Color**
- Background: near-black (`#0A0A0B` / `zinc-950`) OR off-white (`#FAFAFA` /
  `zinc-50`). Never a purple/indigo gradient background.
- Exactly ONE accent color for the whole product. Pick either a confident
  indigo (`#4F46E5`) or a warm amber (`#F59E0B`) at project start and commit —
  do not mix accent colors across screens.
- No gradients on backgrounds, buttons, or cards. Solid fills only.
- No glassmorphism (no `backdrop-blur` + translucent white/black overlay
  combo). Cards get a solid background one shade off the page background,
  plus a thin 1px border — never blur.
- No glow/shadow-heavy hover effects. Hover states change via a subtle
  background shade shift or border color change, not a glow.

**Typography**
- Use Inter or Geist. Hierarchy comes from font-size and font-weight jumps,
  not color changes.
- Headings: tight letter-spacing (`tracking-tight`), bold weight.
- Body text: regular weight, comfortable line-height (`leading-relaxed`).
- At least 3 distinct visual weights on any given screen (e.g. a large bold
  heading, medium-weight subheading, regular body).

**Layout & structure**
- Generous whitespace over dense packing. When in doubt, add padding.
- Borders: thin (1px), low-contrast (e.g. `border-zinc-800` on dark,
  `border-zinc-200` on light). Structure comes from alignment and spacing,
  not decoration.
- Status indicators (badges/pills): solid small fill with the accent or a
  semantic color (green/amber/red), never oversized, never glowing.
- Optional editorial touch: number sections or table rows with a muted
  monospace label (e.g. "01", "02") — this is a Digital Heroes house style
  signal, use sparingly, not on every element.

**What to avoid explicitly**
- Purple-to-blue gradient buttons or backgrounds
- Frosted-glass cards with blur
- Neon glow on hover/focus
- Emoji as UI icons (use lucide-react instead)
- More than one accent color per screen

## Reference feel

Linear's dashboard and Stripe's admin panel: restrained neutral palette, one
accent color used sparingly, real typographic hierarchy, confident use of
whitespace, no visual noise. When unsure whether an effect fits, ask: "would
this look at home in Stripe's dashboard?" If not, cut it.

## Process

1. Before generating any component, restate which single accent color is
   being used for this project (check if one was already chosen earlier in
   the session — stay consistent).
2. Build layout and hierarchy first with no color at all (just spacing and
   type scale) — then add the single accent color only to primary actions
   and key status indicators.
3. Review your own output against the "hard constraints" list above before
   presenting it.
