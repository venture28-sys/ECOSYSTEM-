"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function PaymentStatusPoller({ jobId }: { jobId: string }) {
  const supabase = createClient();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Stop after ~30s (10 x 3s) — if the webhook hasn't landed by then,
    // something's actually wrong and repeatedly polling won't fix it.
    if (attempts >= 10) return;

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("escrow_transactions")
        .select("status")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.status === "held") {
        window.location.reload();
      } else {
        setAttempts((n) => n + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [attempts, jobId]);

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
      <Loader2 size={16} className="animate-spin" />
      {attempts >= 10 ? "Still waiting — you can safely check back later." : "Checking..."}
    </div>
  );
}
