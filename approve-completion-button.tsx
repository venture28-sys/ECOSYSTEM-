"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ApproveCompletionButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleApprove() {
    if (!confirm("Approve this job as complete? This releases payment to the contractor and can't be undone.")) return;

    setLoading(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc("approve_job_completion", { p_job_id: jobId });

    setLoading(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <p className="text-sm text-success flex items-center gap-2">
        <CheckCircle2 size={16} /> Completion approved — payout is being processed.
      </p>
    );
  }

  return (
    <div>
      <Button onClick={handleApprove} disabled={loading} className="w-full justify-center">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        {loading ? "Processing..." : "Approve Completion & Release Payment"}
      </Button>
      {error && <p className="text-sm text-danger mt-2">{error}</p>}
    </div>
  );
}
