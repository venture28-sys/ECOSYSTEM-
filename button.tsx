import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "default" | "sm" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

interface LinkButtonProps extends BaseProps {
  href: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:brightness-90 disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed",
  secondary:
    "bg-neutral-50 text-secondary dark:bg-[var(--surface-2)] dark:text-[var(--text)] hover:brightness-95",
  outline:
    "bg-transparent border-[1.5px] border-secondary text-secondary dark:border-[var(--text)] dark:text-[var(--text)] hover:bg-neutral-50 dark:hover:bg-[var(--surface-2)]",
  danger: "bg-danger text-white hover:brightness-90",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  default: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded font-semibold font-body transition-colors duration-fast";

/**
 * Build Me shared Button — renders a <button> or, when `href` is passed, a Next.js <Link>.
 * Radius 12px, Inter Semi-Bold — per Build Me Design System v1.0.
 */
export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = "primary", size = "default", className = "", children } = props;
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href, ...buttonProps } = props as ButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
