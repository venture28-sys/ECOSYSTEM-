"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const STANDARD_FEE_RATE = 0.0088;

function tierCost(jobsPerMonth: number, avgValue: number, subscriptionPrice: number, waivedJobs: number) {
  const feedJobs = Math.max(0, jobsPerMonth - waivedJobs);
  const feeCost = feedJobs * avgValue * STANDARD_FEE_RATE;
  return subscriptionPrice + feeCost;
}

export function SavingsCalculator() {
  const [jobsPerMonth, setJobsPerMonth] = useState(5);
  const [avgValue, setAvgValue] = useState(10000);

  const freeCost = tierCost(jobsPerMonth, avgValue, 0, 0);
  const crewCost = tierCost(jobsPerMonth, avgValue, 54, 3);
  const masterCost = tierCost(jobsPerMonth, avgValue, 164, 5);

  const best = Math.min(freeCost, crewCost, masterCost);
  const bestLabel = best === freeCost ? "Free" : best === crewCost ? "Crew" : "Master";

  return (
    <Card hover={false} className="max-w-2xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-x-6 mb-6">
        <Input
          label="Jobs per month"
          type="number"
          value={jobsPerMonth}
          onChange={(e) => setJobsPerMonth(Math.max(0, Number(e.target.value)))}
        />
        <Input
          label="Average job value (GHS)"
          type="number"
          value={avgValue}
          onChange={(e) => setAvgValue(Math.max(0, Number(e.target.value)))}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className={`rounded border p-4 ${bestLabel === "Free" ? "border-primary bg-primary-100/30" : "border-neutral-100 dark:border-[var(--border)]"}`}>
          <div className="text-xs font-semibold text-neutral-400 mb-1">Free</div>
          <div className="font-display font-bold text-xl">GHS {Math.round(freeCost).toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-1">total this month</div>
          {bestLabel === "Free" && <Badge tone="primary">Cheapest for you</Badge>}
        </div>
        <div className={`rounded border p-4 ${bestLabel === "Crew" ? "border-primary bg-primary-100/30" : "border-neutral-100 dark:border-[var(--border)]"}`}>
          <div className="text-xs font-semibold text-neutral-400 mb-1">Crew (GHS 54/mo)</div>
          <div className="font-display font-bold text-xl">GHS {Math.round(crewCost).toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-1">total this month</div>
          {bestLabel === "Crew" && <Badge tone="primary">Cheapest for you</Badge>}
        </div>
        <div className={`rounded border p-4 ${bestLabel === "Master" ? "border-primary bg-primary-100/30" : "border-neutral-100 dark:border-[var(--border)]"}`}>
          <div className="text-xs font-semibold text-neutral-400 mb-1">Master (GHS 164/mo)</div>
          <div className="font-display font-bold text-xl">GHS {Math.round(masterCost).toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-1">total this month</div>
          {bestLabel === "Master" && <Badge tone="primary">Cheapest for you</Badge>}
        </div>
      </div>

      <p className="text-xs text-neutral-400 mt-5 text-center">
        Based on {jobsPerMonth} jobs/month at GHS {avgValue.toLocaleString()} average value, and the standard 0.88% fee applying after each tier's waived jobs.
      </p>
    </Card>
  );
}
