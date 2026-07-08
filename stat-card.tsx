import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, tone = "primary" }: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "primary" | "success" | "accent" | "warning" | "neutral";
}) {
  const toneClasses = {
    primary: "bg-primary-100 text-primary",
    success: "bg-green-50 text-success",
    accent: "bg-sky-50 text-accent",
    warning: "bg-amber-50 text-warning",
    neutral: "bg-neutral-100 text-neutral-500 dark:bg-[var(--surface-2)] dark:text-[var(--text-muted)]",
  }[tone];

  return (
    <div className="rounded border border-neutral-100 dark:border-[var(--border)] bg-[var(--surface)] p-5 shadow-card">
      <div className={`w-9 h-9 rounded flex items-center justify-center mb-3 ${toneClasses}`}>
        <Icon size={18} />
      </div>
      <div className="font-display font-bold text-2xl">{value}</div>
      <div className="text-xs text-neutral-400 mt-0.5">{label}</div>
    </div>
  );
}
