# Build Me — Public Website (Production-Ready Next.js Build)

This is the full public marketing site for Build Me, built from the Build Me Knowledge Base and Master
Blueprint, using the Build Me Design System (colors, type, radius, components) already established.

## Pages included (all 13 requested)

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Hero, platform modules, user types, escrow flow, trust section |
| About | `/about` | Vision, mission, values, launch phases |
| Services | `/services` | All 19 platform modules, grouped |
| Marketplace | `/marketplace` | How it works + example project listings |
| Professionals | `/professionals` | Contractors, architects, engineers, QS |
| Suppliers | `/suppliers` | Material suppliers, equipment rental, logistics |
| Pricing | `/pricing` | Tiered plans + revenue model (flagged assumption — see below) |
| FAQ | `/faq` | Interactive accordion, sourced from business rules |
| Blog | `/blog` + 3 posts | Index page + 3 full sample articles |
| Contact | `/contact` | Working client-side form with validation |
| Privacy | `/privacy` | Drafted from security/business principles |
| Terms | `/terms` | Drafted from business rules |
| Careers | `/careers` | Values + sample open roles |

## Two things to know before this goes live

1. **Pricing numbers are placeholders.** The Knowledge Base defines *what* Build Me charges for
   (platform fees, commissions, subscriptions, etc.) but not exact figures. The Pricing page flags
   this directly on the page — confirm real numbers with the founders before removing that notice.
2. **The contact form doesn't send anywhere yet.** It validates input and shows a success state, but
   isn't wired to an email service or database. Before production, connect it to Supabase, an email
   API, or a Next.js API route.
3. **Privacy & Terms need legal review.** Both pages say so directly on the page. They're accurate to
   the Knowledge Base's business rules but are not a substitute for a lawyer's review.

## How to run this (no coding knowledge needed)

1. Install Node.js (nodejs.org, LTS version) if you don't have it.
2. Open Terminal (Mac) or Command Prompt (Windows).
3. Type `cd ` (with a space), then drag this unzipped folder into the window, and press Enter.
4. Type `npm install` and press Enter — wait for it to finish.
5. Type `npm run dev` and press Enter.
6. Open http://localhost:3000 in your browser.
7. Click through every page in the navigation menu to see the full site.

## Handing this to a developer

Everything is already wired to the Build Me Design System — tailwind.config.js, app/globals.css,
and shared components in components/ui/ (Button, Input, Textarea, Card, Badge, Accordion). New pages
should reuse these rather than introducing new styles. The two "before production" items above are the
main things a developer needs to finish.
