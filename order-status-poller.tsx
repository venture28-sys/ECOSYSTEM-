"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function OrderStatusPoller({ productId }: { productId: string }) {
  const supabase = createClient();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= 10) return;

    const timer = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("product_orders")
        .select("status")
        .eq("product_id", productId)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.status === "paid") {
        window.location.reload();
      } else {
        setAttempts((n) => n + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [attempts, productId]);

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
      <Loader2 size={16} className="animate-spin" />
      {attempts >= 10 ? "Still waiting — you can safely check back later." : "Checking..."}
    </div>
  );
}
