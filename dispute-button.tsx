"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function DisputeButton({ paymentId }: { paymentId: string }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submitDispute() {
    if (!reason.trim()) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("rental_payments")
      .update({ status: "disputed", dispute_reason: reason })
      .eq("id", paymentId);
    setSubmitting(false);
    if (!error) setDone(true);
  }

  if (done) {
    return (
      <p className="text-sm text-warning flex items-center gap-2 mt-2">
        <AlertTriangle size={14} /> Dispute raised — the 48-hour release is paused pending review.
      </p>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-danger underline mt-2">
        Something wrong with this listing? Raise a dispute
      </button>
    );
  }

  return (
    <div className="mt-3">
      <Textarea
        label="What went wrong?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Describe the issue — this pauses the 48-hour payment release."
        rows={3}
      />
      <Button variant="danger" size="sm" onClick={submitDispute} disabled={submitting || !reason.trim()}>
        {submitting ? "Submitting..." : "Submit Dispute"}
      </Button>
    </div>
  );
}
