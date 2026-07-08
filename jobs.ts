export type JobStatus = "open" | "quoted" | "awarded" | "in_progress" | "completed" | "cancelled" | "disputed";
export type QuoteStatus = "pending" | "accepted" | "rejected" | "withdrawn";
export type EscrowStatus = "pending" | "held" | "released" | "refunded" | "disputed";

export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string | null;
  budget_min: number | null;
  budget_max: number | null;
  location: string | null;
  status: JobStatus;
  images: string[];
  deadline: string | null;
  awarded_pro_id: string | null;
  awarded_quote_id: string | null;
  created_at: string;
}

// Deliberately narrow — used only for the Browse Projects grid, where full
// `description` and `images` are never rendered. Cuts payload size on slow
// connections. `description_excerpt` is a generated column (see migration
// optimize_browse_projects) so Postgres truncates it, not the client.
export interface JobSummary {
  id: string;
  title: string;
  description_excerpt: string;
  category: string | null;
  budget_min: number | null;
  budget_max: number | null;
  location: string | null;
  status: JobStatus;
  created_at: string;
}

export interface Quote {
  id: string;
  job_id: string;
  pro_id: string;
  amount: number;
  timeline: string | null;
  message: string | null;
  status: QuoteStatus;
  created_at: string;
  // Present when joined with profiles in a query
  profiles?: { full_name: string; avatar_url: string | null; rating_avg: number; rating_count: number };
}

export interface EscrowTransaction {
  id: string;
  job_id: string;
  quote_id: string;
  client_id: string;
  pro_id: string;
  amount: number;
  platform_fee: number;
  pro_payout: number;
  status: EscrowStatus;
  paystack_reference: string | null;
  created_at: string;
}

// Roles that can quote on jobs (everyone except client and admin).
// This is the UI-layer "pro" grouping mentioned in the diagnosis —
// the database still stores the specific role.
export const PRO_ROLES = ["worker", "contractor", "architect", "engineer", "quantity_surveyor", "supplier"] as const;
