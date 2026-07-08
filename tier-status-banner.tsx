import { Zap, Crown, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TIER_CONFIG: Record<string, { label: string; icon: typeof Zap; waivedJobs: number }> = {
  crew: { label: "Crew", icon: Zap, waivedJobs: 3 },
  master: { label: "Master", icon: Crown, waivedJobs: 5 },
};

interface TierStatusBannerProps {
  tier: string;
  expiresAt: string | null;
  jobsUsedThisMonth: number;
}

/**
 * Shows nothing for free/supplier tiers — this is specifically the "how many
 * of my waived jobs have I used this month" countdown for Crew/Master.
 */
export function TierStatusBanner({ tier, expiresAt, jobsUsedThisMonth }: TierStatusBannerProps) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;

  const isActive = expiresAt && new Date(expiresAt) > new Date();
  const Icon = config.icon;

  if (!isActive) {
    return (
      <Card hover={false} className="mb-6 border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-warning shrink-0" size={20} />
          <div className="flex-1">
            <div className="font-display font-semibold text-sm">Your {config.label} subscription has expired</div>
            <div className="text-xs text-neutral-400">You're currently being charged the standard 0.88% fee on every job.</div>
          </div>
          <Button href="/dashboard/pro/subscription" size="sm">Renew</Button>
        </div>
      </Card>
    );
  }

  const remaining = Math.max(0, config.waivedJobs - jobsUsedThisMonth);
  const usedCapped = Math.min(jobsUsedThisMonth, config.waivedJobs);
  const pct = (usedCapped / config.waivedJobs) * 100;

  return (
    <Card hover={false} className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="text-primary shrink-0" size={20} />
        <div className="flex-1">
          <div className="font-display font-semibold text-sm">
            {config.label} plan — {usedCapped} of {config.waivedJobs} free jobs used this month
          </div>
          <div className="text-xs text-neutral-400">
            {remaining > 0
              ? `${remaining} more job${remaining > 1 ? "s" : ""} at 0% fee, then 0.88% for the rest of the month.`
              : "You've used all your fee-free jobs this month — 0.88% applies until your count resets."}
          </div>
        </div>
        {expiresAt && (
          <span className="text-xs text-neutral-400 shrink-0">
            Renews {new Date(expiresAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-[var(--surface-2)] overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </Card>
  );
}
