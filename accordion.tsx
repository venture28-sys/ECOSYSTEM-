"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemData {
  question: string;
  answer: ReactNode;
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-neutral-100 dark:divide-[var(--border)] border border-neutral-100 dark:border-[var(--border)] rounded bg-[var(--surface)] shadow-card">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display font-semibold text-secondary dark:text-[var(--text)]">
                {item.question}
              </span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-primary transition-transform duration-fast ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-neutral-400 text-sm leading-relaxed">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
