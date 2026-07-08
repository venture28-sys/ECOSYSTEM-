"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Quote } from "@/lib/jobs";

const STATUS_TONE = {
  pending: "warning",
  accepted: "success",
  rejected: "danger",
  withdrawn: "neutral",
} as const;

export function QuoteForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const form = new FormData(e.currentTarget);
    const { error: insertError } = await supabase.from("quotes").insert({
      job_id: jobId,
      pro_id: user.id,
      amount: Number(form.get("amount")),
      timeline: String(form.get("timeline") || "").trim() || null,
      message: String(form.get("message") || "").trim(),
    });

    setSubmitting(false);
    if (insertError) {
      // Most common cause: RLS blocked it because this account is a client/admin,
      // or a quote from this pro already exists on this job.
      setError(insertError.message);
      return;
    }
    router.refresh();
  }

  return (
    <Card hover={false}>
      <h3 className="font-display font-semibold text-lg mb-4">Submit a Quote</h3>
      <form onSubmit={handleSubmit}>
        <Input name="amount" type="number" label="Your price (GHS)" placeholder="1200" required />
        <Input name="timeline" label="Timeline" placeholder="e.g. 5 days" />
        <Textarea
          name="message"
          label="Message to client"
          placeholder="Your approach, timeline, and any questions..."
          rows={3}
          helperText="Phone numbers and contact details are automatically hidden — keep the conversation in Build Me until escrow is funded."
        />
        {error && <p className="text-sm text-danger mb-4">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full justify-center">
          {submitting ? "Submitting..." : "Submit Quote"}
        </Button>
      </form>
    </Card>
  );
}

export function QuoteList({
  quotes, isJobOwner, jobId, clientId,
}: {
  quotes: Quote[]; isJobOwner: boolean; jobId: string; clientId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function respond(quoteId: string, status: "accepted" | "rejected") {
    await supabase.from("quotes").update({ status }).eq("id", quoteId);
    router.refresh();
  }

  async function withdraw(quoteId: string) {
    await supabase.from("quotes").update({ status: "withdrawn" }).eq("id", quoteId);
    router.refresh();
  }

  if (quotes.length === 0) {
    return <p className="text-sm text-neutral-400">No quotes yet.</p>;
  }

  return (
    <div className="space-y-3">
      {quotes.map((q) => (
        <Card key={q.id} hover={false}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="font-display font-semibold">
                {q.profiles?.full_name ?? "Pro"} — GHS {q.amount.toLocaleString()}
              </div>
              {q.profiles && (
                <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                  <Star size={12} className="fill-warning text-warning" />
                  {q.profiles.rating_avg.toFixed(1)} ({q.profiles.rating_count})
                </div>
              )}
            </div>
            <Badge tone={STATUS_TONE[q.status]}>{q.status}</Badge>
          </div>
          {q.timeline && <p className="text-xs text-neutral-400 mb-1">Timeline: {q.timeline}</p>}
          {q.message && <p className="text-sm text-neutral-400 mb-3">{q.message}</p>}

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/jobs/${jobId}/chat/${isJobOwner ? q.pro_id : clientId}`}
              className="inline-flex items-center gap-1.5 rounded px-4 py-2 text-sm font-semibold text-secondary dark:text-[var(--text)] bg-neutral-50 dark:bg-[var(--surface-2)]"
            >
              <MessageCircle size={14} /> Message {isJobOwner ? "Pro" : "Client"}
            </Link>

            {isJobOwner && q.status === "pending" && (
              <>
                <Button size="sm" onClick={() => respond(q.id, "accepted")}>
                  <Check size={14} /> Accept
                </Button>
                <Button size="sm" variant="secondary" onClick={() => respond(q.id, "rejected")}>
                  <X size={14} /> Decline
                </Button>
              </>
            )}

            {!isJobOwner && q.status === "pending" && (
              <Button size="sm" variant="secondary" onClick={() => withdraw(q.id)}>
                Withdraw Quote
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
