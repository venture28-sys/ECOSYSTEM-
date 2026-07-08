"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function PayDepositButton({ listingId, price }: { listingId: string; price: number }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error: invokeError } = await supabase.functions.invoke("rental-paystack-initialize", {
      body: { listingId },
    });

    if (invokeError || data?.error) {
      setError(data?.error ?? invokeError?.message ?? "Payment could not be started.");
      setLoading(false);
      return;
    }
    window.location.href = data.authorization_url;
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={loading} className="w-full justify-center">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
        {loading ? "Starting payment..." : `Pay GHS ${price.toLocaleString()}`}
      </Button>
      {error && <p className="text-sm text-danger mt-2">{error}</p>}
    </div>
  );
}
