import Link from "next/link";
import { MapPin, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "@/components/jobs/save-button";
import type { JobSummary } from "@/lib/jobs";

export function JobCard({ job, initialSaved = false, showSave = false }: { job: JobSummary; initialSaved?: boolean; showSave?: boolean }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          {job.category && <Badge tone="primary">{job.category}</Badge>}
          {showSave && <SaveButton jobId={job.id} initialSaved={initialSaved} />}
        </div>
        <h5 className="font-display font-semibold mb-2">{job.title}</h5>
        <p className="text-sm text-neutral-400 mb-4 flex-1 line-clamp-2">{job.description_excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-neutral-400">
          {job.location && (
            <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
          )}
          {(job.budget_min || job.budget_max) && (
            <span className="flex items-center gap-1">
              <Wallet size={13} />
              {job.budget_min && job.budget_max
                ? `GHS ${job.budget_min.toLocaleString()}–${job.budget_max.toLocaleString()}`
                : `GHS ${(job.budget_min || job.budget_max)!.toLocaleString()}`}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
