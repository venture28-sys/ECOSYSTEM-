"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function FundEscrowButton({ quoteId }: { quoteId: string }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const { data, error: invokeError } = await supabase.functions.invoke("initiate-payment", {
      body: { quoteId },
    });

    if (invokeError || data?.error) {
      setError(data?.error ?? invokeError?.message ?? "Payment could not be started.");
      setLoading(false);
      return;
    }

    // Standard Paystack Checkout — full redirect rather than an inline popup.
    // Keeps the initial page load lighter on 3G; Paystack's own page is only
    // fetched if the client actually proceeds to pay.
    window.location.href = data.authorization_url;
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={loading} className="w-full justify-center">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
        {loading ? "Starting payment..." : "Fund Escrow to Start Work"}
      </Button>
      {error && <p className="text-sm text-danger mt-2">{error}</p>}
    </div>
  );
}
