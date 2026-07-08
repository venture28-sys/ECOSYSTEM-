"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HardHat, type LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardShellProps {
  title: string;
  navItems: DashboardNavItem[];
  stats?: ReactNode;
  children: ReactNode;
  unreadCount?: number;
}

/**
 * The one shell every dashboard (Client, Pro, Architect, Supplier, Admin) uses.
 * Pass role-specific `navItems` and `stats` — the layout itself never changes.
 */
export function DashboardShell({ title, navItems, stats, children, unreadCount = 0 }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--bg-sub)]">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-neutral-100 dark:border-[var(--border)] bg-[var(--surface)]">
        <div className="h-16 flex items-center gap-2 px-6 font-display font-bold border-b border-neutral-100 dark:border-[var(--border)]">
          <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white">
            <HardHat size={14} />
          </span>
          Build Me
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors duration-fast
                  ${active ? "bg-primary-100/50 text-primary" : "text-neutral-500 dark:text-[var(--text-muted)] hover:bg-neutral-50 dark:hover:bg-[var(--surface-2)]"}`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-neutral-100 dark:border-[var(--border)] bg-[var(--surface)]">
          <button className="lg:hidden text-secondary dark:text-[var(--text)]" onClick={() => setMobileNavOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="font-display font-semibold text-lg flex items-center gap-2">
            {title}
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-danger text-white text-xs font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </h1>
          <div className="w-6 lg:hidden" />
        </header>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-64 bg-[var(--surface)] p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold">Build Me</span>
                <button onClick={() => setMobileNavOpen(false)}><X size={20} /></button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-neutral-500 dark:text-[var(--text-muted)]"
                  >
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-1 bg-secondary/50" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {stats && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{stats}</div>}
          {children}
        </main>
      </div>
    </div>
  );
}
