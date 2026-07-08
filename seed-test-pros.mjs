/**
 * Seed test Pro/Architect/Supplier accounts with skills, so
 * recommend_pros_for_job() has real data to match against.
 *
 * WHY THIS IS A LOCAL SCRIPT, NOT SOMETHING CLAUDE RAN DIRECTLY:
 * Creating real, loggable-in accounts requires Supabase's Admin Auth API,
 * which requires the SERVICE ROLE KEY — a secret that bypasses every RLS
 * policy on your database. Claude was never given this key and never should
 * be; it's the one credential in this whole project that must stay only on
 * your machine (or a trusted server), never in a chat, never in a repo.
 *
 * HOW TO RUN THIS
 * 1. Get your service role key: Supabase Dashboard → Project Settings → API
 *    → "service_role" key (NOT the anon/publishable one).
 * 2. Run from the project root:
 *      SUPABASE_URL=https://bacjbhsnmlqzxmzwmrel.supabase.co \
 *      SUPABASE_SERVICE_ROLE_KEY=paste-it-here \
 *      node scripts/seed-test-pros.mjs
 *    (Don't save the key in a file that gets committed — pass it inline like
 *    this, or in a .env.seed file that's in .gitignore.)
 * 3. Every seeded account uses a @buildme.test email so they're easy to spot
 *    and delete later — see the cleanup query at the bottom of this file.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. See the comment at the top of this file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const TEST_PROS = [
  {
    email: "test-pro-plumber-accra@buildme.test",
    full_name: "Kofi Mensah",
    role: "worker",
    location: "Accra, Ghana",
    headline: "Licensed plumber, 6 years experience",
    rating_avg: 4.8,
    rating_count: 23,
    skills: ["Plumbing", "Pipe fitting", "Water heater installation"],
  },
  {
    email: "test-pro-electrician-accra@buildme.test",
    full_name: "Ama Owusu",
    role: "contractor",
    location: "Accra, Ghana",
    headline: "Electrical contractor, residential & commercial",
    rating_avg: 4.6,
    rating_count: 15,
    skills: ["Electrical", "Wiring", "Generator installation"],
  },
  {
    email: "test-pro-roofer-kumasi@buildme.test",
    full_name: "Yaw Boateng",
    role: "contractor",
    location: "Kumasi, Ghana",
    headline: "Roofing specialist",
    rating_avg: 4.9,
    rating_count: 31,
    skills: ["Roofing", "Gutter installation"],
  },
  {
    email: "test-architect-accra@buildme.test",
    full_name: "Efua Asante",
    role: "architect",
    location: "Accra, Ghana",
    headline: "Residential & commercial architect",
    rating_avg: 4.7,
    rating_count: 12,
    skills: ["Design", "3D rendering", "Floor planning"],
  },
  {
    email: "test-pro-mason-lagos@buildme.test",
    full_name: "Chidi Okafor",
    role: "contractor",
    location: "Lagos, Nigeria",
    headline: "Masonry & concrete work",
    rating_avg: 4.5,
    rating_count: 19,
    skills: ["Masonry", "Concrete", "Block work"],
  },
];

async function seed() {
  for (const pro of TEST_PROS) {
    console.log(`Creating ${pro.full_name} (${pro.email})...`);

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: pro.email,
      password: "Test-Password-123!",
      email_confirm: true,
      user_metadata: { full_name: pro.full_name, role: pro.role },
    });

    if (createError) {
      console.error(`  Failed: ${createError.message}`);
      continue;
    }

    const userId = created.user.id;

    // handle_new_user() trigger already created a bare profiles row from the
    // metadata above — this fills in the rest for demo/testing purposes.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        location: pro.location,
        headline: pro.headline,
        rating_avg: pro.rating_avg,
        rating_count: pro.rating_count,
        is_available: true,
      })
      .eq("id", userId);

    if (updateError) console.error(`  Profile update failed: ${updateError.message}`);

    const { error: skillsError } = await supabase
      .from("skills")
      .insert(pro.skills.map((name) => ({ profile_id: userId, name })));

    if (skillsError) console.error(`  Skills insert failed: ${skillsError.message}`);

    console.log(`  Done.`);
  }

  console.log("\nSeeding complete. Test these by opening any job's detail page as its client and checking 'Suggested Pros'.");
}

seed();

/**
 * CLEANUP — run this in the Supabase SQL Editor when you're done testing.
 * Deletes both the profiles and their auth.users rows (cascades handle the rest).
 *
 *   delete from auth.users where email like '%@buildme.test';
 */
