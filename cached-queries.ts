import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Deliberately NOT the cookie-aware server client from lib/supabase/server.ts —
// unstable_cache can't depend on per-request cookies (that would defeat caching
// entirely, and Next.js disallows it). This is safe specifically because every
// query in this file only ever touches genuinely public data — RLS on these
// tables/columns already permits anyone to read them (jobs where status='open',
// products, active listings, categories) — so a cookie-free anon client returns
// exactly the same rows a logged-in user would see for these specific queries.
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const REVALIDATE_SECONDS = 60;

const JOB_LIST_COLUMNS = "id, title, description_excerpt, category, budget_min, budget_max, location, status, created_at";

export const getCachedOpenJobs = unstable_cache(
  async (filters: { category?: string; location?: string; budgetMin?: string; budgetMax?: string; page: number; pageSize: number }) => {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;

    let query = publicClient().from("jobs").select(JOB_LIST_COLUMNS, { count: "exact" }).eq("status", "open");
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.location) query = query.ilike("location", `%${filters.location}%`);
    if (filters.budgetMin) query = query.gte("budget_max", Number(filters.budgetMin));
    if (filters.budgetMax) query = query.lte("budget_min", Number(filters.budgetMax));

    const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
    return { jobs: data ?? [], count: count ?? 0 };
  },
  ["open-jobs-list"],
  { revalidate: REVALIDATE_SECONDS, tags: ["jobs"] }
);

export const getCachedCategories = unstable_cache(
  async () => {
    const { data } = await publicClient().from("categories").select("name, slug").order("name");
    return data ?? [];
  },
  ["categories-list"],
  { revalidate: 3600, tags: ["categories"] } // categories change rarely — cache longer
);

const PRODUCT_LIST_COLUMNS = "id, name, price, category, location, is_active, images, created_at";

export const getCachedProducts = unstable_cache(
  async (filters: { category?: string; page: number; pageSize: number }) => {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;

    let query = publicClient().from("products").select(PRODUCT_LIST_COLUMNS, { count: "exact" });
    if (filters.category) query = query.eq("category", filters.category);

    const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
    return { products: data ?? [], count: count ?? 0 };
  },
  ["products-list"],
  { revalidate: REVALIDATE_SECONDS, tags: ["products"] }
);

const LISTING_LIST_COLUMNS = "id, user_id, category, listing_type, title, price, price_period, location, city, images, specs, status, is_featured, created_at";

export const getCachedListings = unstable_cache(
  async (filters: { category?: string; city?: string; type?: string; page: number; pageSize: number }) => {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;

    let query = publicClient().from("listings").select(LISTING_LIST_COLUMNS, { count: "exact" }).eq("status", "active");
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.city) query = query.ilike("city", `%${filters.city}%`);
    if (filters.type) query = query.eq("listing_type", filters.type);

    const { data, count } = await query
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);
    return { listings: data ?? [], count: count ?? 0 };
  },
  ["listings-list"],
  { revalidate: REVALIDATE_SECONDS, tags: ["listings"] }
);
