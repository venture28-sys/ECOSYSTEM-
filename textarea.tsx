import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  errorText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, errorText, className = "", id, rows = 5, ...props }, ref) => {
    const areaId = id || label.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(errorText);

    return (
      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor={areaId} className="text-sm font-semibold text-secondary dark:text-[var(--text)]">
          {label}
        </label>
        <textarea
          id={areaId}
          ref={ref}
          rows={rows}
          className={`rounded border px-3.5 py-3 font-body text-base bg-[var(--surface)] text-[var(--text)] resize-none
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

Textarea.displayName = "Textarea";
