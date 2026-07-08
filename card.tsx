import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

/**
 * Build Me shared Card. 12px radius, soft shadow, 1px hairline border, 24px min padding.
 */
export function Card({ children, className = "", hover = true, ...props }: CardProps) {
  return (
    <div
      className={`rounded shadow-card border border-neutral-100 dark:border-[var(--border)]
        bg-[var(--surface)] p-6 transition-transform duration-base
        ${hover ? "hover:-translate-y-1 hover:shadow-lift" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
