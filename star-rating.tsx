import { Star } from "lucide-react";

export function StarRating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={15}
            className={i <= Math.round(value) ? "fill-warning text-warning" : "text-neutral-200 dark:text-[var(--border)]"}
          />
        ))}
      </div>
      <span className="text-sm text-neutral-400">
        {value.toFixed(1)} ({count})
      </span>
    </div>
  );
}
