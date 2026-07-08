"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/jobs", label: "Marketplace" },
  { href: "/professionals", label: "Professionals" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/products", label: "Materials" },
  { href: "/rentals", label: "Rentals" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[var(--bg)]/85 border-b border-neutral-100 dark:border-[var(--border)]">
      <Container>
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-secondary dark:text-[var(--text)]">
            <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white">
              <HardHat size={14} />
            </span>
            Build Me
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-400 hover:text-primary transition-colors duration-fast"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button href="/login" variant="secondary" size="sm">
              Log In
            </Button>
            <Button href="/signup" variant="primary" size="sm">
              Sign Up
            </Button>
          </div>

          <button
            className="lg:hidden text-secondary dark:text-[var(--text)]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="lg:hidden border-t border-neutral-100 dark:border-[var(--border)] bg-[var(--bg)]">
          <Container className="py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-neutral-500 dark:text-[var(--text-muted)] font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-3">
              <Button href="/login" variant="secondary" size="sm" className="flex-1 justify-center">
                Log In
              </Button>
              <Button href="/signup" variant="primary" size="sm" className="flex-1 justify-center">
                Sign Up
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-6 ${className}`}>{children}</div>;
}
