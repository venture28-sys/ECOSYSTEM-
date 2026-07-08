"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function BuyNowButton({ productId, unitPrice }: { productId: string; unitPrice: number }) {
  const router = useRouter();
  const supabase = createClient();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error: invokeError } = await supabase.functions.invoke("initiate-product-payment", {
      body: { productId, quantity },
    });

    if (invokeError || data?.error) {
      setError(data?.error ?? invokeError?.message ?? "Could not start checkout.");
      setLoading(false);
      return;
    }
    window.location.href = data.authorization_url;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-semibold">Quantity</span>
        <div className="flex items-center border border-neutral-200 dark:border-[var(--border)] rounded">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 flex items-center justify-center text-neutral-400"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 flex items-center justify-center text-neutral-400"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-sm text-neutral-400">
          Total: <span className="font-semibold text-secondary dark:text-[var(--text)]">GHS {(unitPrice * quantity).toLocaleString()}</span>
        </span>
      </div>

      <Button onClick={handleBuy} disabled={loading} className="w-full justify-center">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
        {loading ? "Starting checkout..." : "Buy Now"}
      </Button>
      {error && <p className="text-sm text-danger mt-2">{error}</p>}
    </div>
  );
}
