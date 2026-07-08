"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SaveButton({ jobId, initialSaved }: { jobId: string; initialSaved: boolean }) {
  const supabase = createClient();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault(); // don't trigger the parent <Link> to the job detail page
    e.stopPropagation();
    if (pending) return;
    setPending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (saved) {
      await supabase.from("saved_jobs").delete().eq("job_id", jobId).eq("pro_id", user.id);
      setSaved(false);
    } else {
      await supabase.from("saved_jobs").insert({ job_id: jobId, pro_id: user.id });
      setSaved(true);
    }
    setPending(false);
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from saved jobs" : "Save job"}
      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-fast
        ${saved ? "bg-primary text-white" : "bg-neutral-100 dark:bg-[var(--surface-2)] text-neutral-400 hover:text-primary"}`}
    >
      <Bookmark size={14} className={saved ? "fill-white" : ""} />
    </button>
  );
}
