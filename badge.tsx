import { ReactNode } from "react";

type Tone = "primary" | "success" | "warning" | "danger" | "accent" | "neutral";

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary-100 text-primary-700",
  success: "bg-green-50 text-success",
  warning: "bg-amber-50 text-warning",
  danger: "bg-red-50 text-danger",
  accent: "bg-sky-50 text-accent",
  neutral: "bg-neutral-100 text-neutral-500 dark:bg-[var(--surface-2)] dark:text-[var(--text-muted)]",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-body ${toneStyles[tone]}`}>
      {children}
    </span>
  );
}
