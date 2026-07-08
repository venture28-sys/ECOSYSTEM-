import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  errorText?: string;
}

/**
 * Build Me shared Input. Label always visible, 12px radius, 2px orange focus ring, red error state.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, errorText, className = "", id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(errorText);

    return (
      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor={inputId} className="text-sm font-semibold text-secondary dark:text-[var(--text)]">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`rounded border px-3.5 py-3 font-body text-base bg-[var(--surface)] text-[var(--text)]
            focus:outline-none focus:border-2 focus:border-primary
            ${hasError ? "border-danger" : "border-neutral-200 dark:border-[var(--border)]"}
            ${className}`}
          {...props}
        />
        {errorText ? (
          <span className="text-xs text-danger">{errorText}</span>
        ) : helperText ? (
          <span className="text-xs text-neutral-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
