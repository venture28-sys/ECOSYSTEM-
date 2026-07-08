import { HTMLAttributes, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-6 ${className}`}>{children}</div>;
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  muted?: boolean;
}

export function Section({ children, className = "", muted = false, ...props }: SectionProps) {
  return (
    <section className={`py-16 sm:py-20 ${muted ? "bg-[var(--surface-2)]" : ""} ${className}`} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary font-bold mb-3">
      <span className="w-4 h-0.5 bg-primary inline-block" />
      {children}
    </div>
  );
}
