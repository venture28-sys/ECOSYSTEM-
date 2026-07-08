"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PenTool, FileText, Image as ImageIcon, Star, Search, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job, Quote } from "@/lib/jobs";
import type { PortfolioItem } from "@/lib/roles";
import { TierStatusBanner } from "@/components/subscription/tier-status-banner";
import { useUnreadMessages } from "@/lib/hooks/use-unread-messages";

const NAV: DashboardNavItem[] = [
  { href: "/dashboard/payout-details", label: "Payout Details", icon: Wallet },
  { href: "/dashboard/architect", label: "My Dashboard", icon: PenTool },
  { href: "/jobs?category=Design", label: "Browse Design Jobs", icon: Search },
];

const JOB_STATUS_TONE = {
  open: "accent", quoted: "warning", awarded: "warning", in_progress: "primary",
  completed: "success", cancelled: "neutral", disputed: "danger",
} as const;

const QUOTE_STATUS_TONE = { pending: "warning", accepted: "success", rejected: "danger", withdrawn: "neutral" } as const;

export default function ArchitectDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [rating, setRating] = useState({ avg: 0, count: 0 });
  const [subscription, setSubscription] = useState({ tier: "free", expiresAt: null as string | null, jobsUsed: 0 });
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const unread = useUnreadMessages(profileId);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, rating_avg, rating_count, subscription_tier, subscription_expires_at, jobs_used_this_month")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "architect") {
        router.push("/jobs");
        return;
      }
      setProfileId(user.id);
      setRating({ avg: profile.rating_avg, count: profile.rating_count });
      setSubscription({ tier: profile.subscription_tier, expiresAt: profile.subscription_expires_at, jobsUsed: profile.jobs_used_this_month });

      const [{ data: active }, { data: quoteData }, { data: portfolioData }] = await Promise.all([
        supabase.from("jobs").select("*").eq("awarded_pro_id", user.id).order("created_at", { ascending: false }),
        supabase.from("quotes").select("*").eq("pro_id", user.id).order("created_at", { ascending: false }),
        supabase.from("portfolio_items").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
      ]);

      setActiveJobs(active || []);
      setQuotes((quoteData as Quote[]) || []);
      setPortfolio(portfolioData || []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingQuotes = quotes.filter((q) => q.status === "pending").length;

  return (
    <DashboardShell
      title="Architect Dashboard"
      navItems={NAV}
      unreadCount={unread.total}
      stats={
        loading ? (
          <>{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}</>
        ) : (
          <>
            <StatCard icon={PenTool} label="Active Projects" value={activeJobs.length} tone="primary" />
            <StatCard icon={FileText} label="Pending Bids" value={pendingQuotes} tone="accent" />
            <StatCard icon={ImageIcon} label="Portfolio Pieces" value={portfolio.length} tone="neutral" />
            <StatCard icon={Star} label="Rating" value={`${rating.avg.toFixed(1)} (${rating.count})`} tone="success" />
          </>
        )
      }
    >
      {!loading && (
        <TierStatusBanner tier={subscription.tier} expiresAt={subscription.expiresAt} jobsUsedThisMonth={subscription.jobsUsed} />
      )}

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="bids">My Bids</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {loading ? (
            <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-20" />)}</div>
          ) : activeJobs.length === 0 ? (
            <EmptyState
              icon={PenTool}
              title="No active projects yet"
              body="Once a client accepts one of your bids, it'll show up here."
              ctaHref="/jobs?category=Design"
              ctaLabel="Browse Design Jobs"
            />
          ) : (
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <Card key={job.id} hover={false}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h5 className="font-display font-semibold mb-1 flex items-center gap-2">
                        {job.title}
                        {unread.byJob[job.id] > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold">
                            {unread.byJob[job.id]}
                          </span>
                        )}
                      </h5>
                      <Badge tone={JOB_STATUS_TONE[job.status]}>{job.status.replace("_", " ")}</Badge>
                    </div>
                    <Button href={`/jobs/${job.id}`} variant="secondary" size="sm">View</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bids">
          {loading ? (
            <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-20" />)}</div>
          ) : quotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No bids submitted yet"
              body="Browse design projects and submit your first bid."
              ctaHref="/jobs?category=Design"
              ctaLabel="Browse Design Jobs"
            />
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => (
                <Card key={q.id} hover={false}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-display font-semibold">GHS {q.amount.toLocaleString()}</div>
                      {q.message && <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{q.message}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={QUOTE_STATUS_TONE[q.status]}>{q.status}</Badge>
                      <Button href={`/jobs/${q.job_id}`} variant="secondary" size="sm">View Job</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="portfolio">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">{[1, 2].map((i) => <Skeleton key={i} className="h-40" />)}</div>
          ) : portfolio.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Your portfolio is empty"
              body="For architects, a strong portfolio matters more than almost anything else on this platform — add your best renders and drawings."
              ctaHref="/profile/edit"
              ctaLabel="Add Portfolio Pieces"
            />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {portfolio.map((item) => (
                  <Card key={item.id} hover={false}>
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.title} className="w-full h-36 object-cover rounded mb-3" />
                    )}
                    <h5 className="font-display font-semibold text-sm">{item.title}</h5>
                    {item.description && <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{item.description}</p>}
                  </Card>
                ))}
              </div>
              <Button href="/profile/edit" variant="secondary" size="sm">Manage Portfolio</Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function EmptyState({ icon: Icon, title, body, ctaHref, ctaLabel }: {
  icon: typeof PenTool; title: string; body: string; ctaHref: string; ctaLabel: string;
}) {
  return (
    <Card hover={false} className="text-center py-12">
      <Icon className="mx-auto text-neutral-300 mb-3" size={32} />
      <h3 className="font-display font-semibold mb-1">{title}</h3>
      <p className="text-sm text-neutral-400 mb-5">{body}</p>
      <Button href={ctaHref}>{ctaLabel}</Button>
    </Card>
  );
}
