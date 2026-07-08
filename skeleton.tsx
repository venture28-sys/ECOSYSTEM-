import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-neutral-100 dark:bg-[var(--surface-2)]", className)} />;
}
