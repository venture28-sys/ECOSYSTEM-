# Build Me — Registration & Profiles Setup Guide

This is the first real piece of software for Build Me: account creation for all 7 user types, and a
LinkedIn-style public profile for each of them. Follow these steps in order — each one builds on the
last.

## What you're building

- Sign up as **Client, Worker, Contractor, Architect, Engineer, Quantity Surveyor, or Supplier**
- A public profile page for every user: photo, bio, location, skills, certificates, ratings,
  portfolio, completed jobs, phone verification badge, availability status
- An edit page where users manage all of the above, including uploading photos/files and verifying
  their phone number by SMS

---

## Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account (use `venture28.limited@gmail.com`
   so the project is owned by the company email, not a personal one).
2. Click **New Project**. Name it `build-me`, choose a strong database password (save it somewhere
   safe — you won't see it again), and pick a region close to your users (e.g. closest to West Africa).
3. Wait ~2 minutes for the project to finish provisioning.

## Step 2 — Run the database schema

1. In your Supabase project, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `supabase/schema.sql` from this package, copy the entire contents, paste it into the SQL
   Editor, and click **Run**.
4. You should see "Success. No rows returned." This one file creates:
   - The 7 user roles
   - The `profiles` table (and 5 related tables: skills, certificates, portfolio, completed jobs, ratings)
   - Automatic profile creation the moment someone signs up
   - Automatic rating average calculation
   - All security rules (Row Level Security) so users can only edit their own data
   - 4 storage buckets for photos and files (avatars, covers, certificates, portfolio)

If anything errors, copy the exact red error message — it almost always means a step above wasn't
completed first (e.g. running it twice without dropping tables).

## Step 3 — Get your API keys

1. In Supabase, go to **Project Settings > API**.
2. Copy the **Project URL** and the **anon public** key.
3. In this project folder, copy `.env.local.example` to a new file named `.env.local`.
4. Paste your values in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Save the file. **Never commit `.env.local` to GitHub** — it's already excluded via `.gitignore`.

## Step 4 — Set up the sender email

1. In Supabase, go to **Authentication > Email Templates**.
2. Under **SMTP Settings** (Authentication > Providers > scroll to SMTP), you can either:
   - Use Supabase's default sender for now (fine for testing), or
   - Connect `venture28.limited@gmail.com` as a custom SMTP sender for production (Gmail requires an
     "App Password" — search "Gmail SMTP App Password" for the exact steps, since Gmail no longer
     allows your normal password for this).
3. Under **Authentication > URL Configuration**, set your **Site URL** to your real domain once you
   have one (for local testing, `http://localhost:3000` is fine).

## Step 5 — Enable phone verification (SMS)

Phone verification requires a real SMS provider — Supabase doesn't send SMS itself.

1. Go to **Authentication > Providers > Phone**.
2. Toggle it on.
3. You'll need a Twilio account (or MessageBird/Vonage) — create one, get your Account SID, Auth
   Token, and a phone number, and paste them into the Supabase Phone provider settings.
4. This step can be skipped for now if you just want to test signup/profiles first — the phone
   verification UI will simply show an error until this is configured. Everything else works without it.

## Step 6 — Install and run

1. Install [Node.js](https://nodejs.org) if you haven't already.
2. Open Terminal, `cd` into this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000/signup`.

## Step 7 — Test the full flow yourself

1. Go to `/signup`, pick a role (try "Contractor"), fill in your details, and submit.
2. Check your email for the confirmation link (Supabase sends this automatically) and click it.
3. You'll land on `/onboarding` — add a photo, bio, location, and a few comma-separated skills.
4. You'll be redirected to your public profile at `/profile/{your-id}` — this is what every other user
   sees.
5. Go to `/profile/edit` to add a certificate, a portfolio item, and try the phone verification flow.
6. Sign up a second test account with a different role to confirm two different profiles work
   independently and both show up correctly.

## What's deliberately left for later (flagged, not invented)

- **Ratings are only insertable by other users, not the profile owner** — but there's currently no UI
  for *leaving* a rating yet, since that naturally belongs on a completed project/contract, which
  isn't built yet. The database is ready for it.
- **Completed Jobs currently has no insert policy** for regular users — on purpose. In production,
  these rows should be created automatically when an escrow milestone closes (via the Escrow module),
  not typed in by the user, to keep them trustworthy. This will be wired up when the Escrow module is
  built.
- **Admin verification** (`verification_status`) has no admin UI yet — that belongs in the Admin
  Portal, which follows once the Marketplace and Escrow modules exist.

## File map

```
supabase/schema.sql          → the entire database, run once in Supabase SQL Editor
lib/supabase/client.ts       → Supabase client for use in the browser
lib/supabase/server.ts       → Supabase client for use in Server Components
lib/roles.ts                 → the 7 roles + shared TypeScript types
middleware.ts                → keeps users logged in across page loads
app/signup/page.tsx          → role-selection signup form
app/login/page.tsx           → login form
app/onboarding/page.tsx      → first-time profile setup after signup
app/profile/[id]/page.tsx    → public LinkedIn-style profile view
app/profile/edit/page.tsx    → self-service profile editor (photos, certs, portfolio, phone)
components/profile/          → AvatarUpload and StarRating, reused across profile pages
```

## Pricing Model v1.3 (updated — replaces the 10% flat fee)

**Standard platform fee: 0.88%** on every completed job (down from the original 10% flat rate modeled in earlier financial projections — if you have that spreadsheet, it needs rebuilding against these numbers, not the old ones).

| Tier | Price | Fee structure | Notes |
|---|---|---|---|
| Free | GHS 0/mo | 0.88% on every job | 8 bids/month cap |
| Crew | GHS 54/mo | **0%** on each pro's first 3 jobs/month, then 0.88% | Unlimited bids |
| Master | GHS 164/mo | **0%** on each pro's first 5 jobs/month, then 0.88% | Unlimited bids, priority ranking, loan eligibility |
| Supplier | GHS 104/mo | 0.5% on product sales | Featured listing — **no product checkout flow exists yet, so this fee has nowhere to apply yet** |

`jobs_used_this_month` resets to 0 automatically on the 1st of every month at 00:00 UTC via a scheduled `pg_cron` job calling the `cron-reset-jobs` Edge Function. It also resets immediately whenever someone activates or renews a subscription.

### What's live vs. what needs you

**Live and tested (SQL-level verification, not yet a real Paystack transaction):**
- `subscription_tier`, `subscription_expires_at`, `jobs_used_this_month` columns on `profiles`
- Dynamic fee calculation in `initiate-payment` (reads the pro's tier/expiry/job-count at charge time)
- Monthly counter reset, scheduled and verified via direct SQL
- Free-tier 8-bids/month cap, enforced at the RLS level (not just hidden in the UI)

**Needs you before it's real money-safe:**
- Run `scripts/test-crew-subscription.mjs` against Paystack **test** keys and confirm a full subscribe → webhook → tier-activation cycle works before touching live keys.
- The `paystack-subscribe` function creates real Paystack Plan objects on first use per tier — sanity-check them in your Paystack dashboard (Plans) after the first real Crew/Master/Supplier subscription attempt.
- If you had the earlier 10%-fee financial model spreadsheet, it's now out of date — ask for it to be rebuilt against 0.88%.
