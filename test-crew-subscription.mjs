/**
 * Test script: GHS 54 Crew subscription payment.
 *
 * Run this against your Paystack TEST keys first — never live keys, until
 * you've watched this succeed end-to-end at least once.
 *
 * HOW TO RUN
 * 1. Make sure PAYSTACK_SECRET_KEY set as an Edge Function secret is your
 *    TEST secret key (starts with sk_test_), not live, while testing.
 * 2. Run:
 *      SUPABASE_URL=https://bacjbhsnmlqzxmzwmrel.supabase.co \
 *      SUPABASE_ANON_KEY=your-anon-key \
 *      TEST_EMAIL=your-test-pro-account@example.com \
 *      TEST_PASSWORD=your-test-password \
 *      node scripts/test-crew-subscription.mjs
 * 3. The script prints a Paystack checkout URL. Open it in a browser and
 *    pay with a Paystack TEST card (e.g. 4084 0840 8408 4081, any future
 *    expiry, any CVV, OTP 123456) — see Paystack's test cards docs.
 * 4. After paying, check the result:
 *      select subscription_tier, subscription_expires_at, jobs_used_this_month
 *      from profiles where id = 'your-test-pro-id';
 *    subscription_tier should be 'crew' and jobs_used_this_month should be 0.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !TEST_EMAIL || !TEST_PASSWORD) {
  console.error("Missing required env vars. See the comment at the top of this file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log(`Logging in as ${TEST_EMAIL}...`);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (authError || !authData.session) {
    console.error("Login failed:", authError?.message);
    process.exit(1);
  }
  console.log(`Logged in as ${authData.user.id}`);

  console.log("\nCalling paystack-subscribe with tier=crew (GHS 54)...");
  const { data, error } = await supabase.functions.invoke("paystack-subscribe", {
    body: { tier: "crew" },
  });

  if (error || data?.error) {
    console.error("Subscribe call failed:", data?.error ?? error?.message);
    process.exit(1);
  }

  console.log("\n✅ Checkout initialized successfully.");
  console.log(`Reference: ${data.reference}`);
  console.log(`\nOpen this URL in a browser to complete the test payment:\n${data.authorization_url}\n`);
  console.log(`After paying, verify with SQL:`);
  console.log(`  select subscription_tier, subscription_expires_at, jobs_used_this_month`);
  console.log(`  from profiles where id = '${authData.user.id}';`);
  console.log(`Expect: subscription_tier = 'crew', jobs_used_this_month = 0.`);
}

run();
