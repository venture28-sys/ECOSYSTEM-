import Link from "next/link";
import { HardHat, Mail, MapPin, Phone } from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/services", label: "Services" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/professionals", label: "Professionals" },
      { href: "/suppliers", label: "Suppliers" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <span className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <HardHat size={14} />
              </span>
              Build Me
            </div>
            <p className="text-slate-300 text-sm max-w-xs mb-4">
              Africa&apos;s digital construction ecosystem — marketplace, wallet, escrow, and AI, in one
              secure platform. A Venture 28 company.
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-primary shrink-0" /> hello@buildme.africa
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-primary shrink-0" /> +233 000 000 000
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-primary shrink-0" /> Accra, Ghana
              </div>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="font-display font-semibold text-sm mb-4 text-slate-200">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-300 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Build Me · Venture 28. All rights reserved.</span>
          <span className="font-mono">Build Smarter. Build Faster. Build Together.</span>
        </div>
      </div>
    </footer>
  );
}
