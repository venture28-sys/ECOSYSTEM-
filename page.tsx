import type { Metadata } from "next";
import Link from "next/link";
import {
  HardHat, Wallet, ShieldCheck, Bot, ClipboardList, Package, Truck,
  Building2, Ruler, Users, ArrowRight, CheckCircle2, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, Container, Eyebrow } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The operating system for construction across Africa — marketplace, wallet, escrow, AI assistant, and project management in one platform.",
};

const MODULES = [
  { icon: Building2, title: "Construction Marketplace", desc: "Post projects, compare quotations, and hire verified contractors." },
  { icon: Wallet, title: "Digital Wallet", desc: "Available, pending, escrow, and withdrawable balances — always reconciled." },
  { icon: ShieldCheck, title: "Escrow Platform", desc: "Funds released only after milestones are approved. No surprises." },
  { icon: Bot, title: "AI Assistant", desc: "BOQ generation, cost estimation, and construction guidance on demand." },
  { icon: ClipboardList, title: "Project Management", desc: "Track milestones, progress photos, and approvals in one timeline." },
  { icon: Package, title: "Material Marketplace", desc: "Order materials directly from verified suppliers." },
  { icon: Truck, title: "Equipment & Logistics", desc: "Rent equipment and track deliveries end to end." },
  { icon: FileText, title: "Financing & Insurance", desc: "Referral access to project financing and construction insurance." },
];

const USER_TYPES = [
  { icon: Users, title: "Clients", desc: "Post projects, fund escrow, track progress, rate contractors." },
  { icon: HardHat, title: "Contractors", desc: "Quote jobs, get verified, get paid on milestones." },
  { icon: Building2, title: "Architects & Engineers", desc: "Upload drawings, consult, review, and inspect." },
  { icon: Ruler, title: "Quantity Surveyors", desc: "Generate BOQs and manage project budgets." },
  { icon: Package, title: "Suppliers", desc: "List products, manage inventory, fulfill orders." },
  { icon: Truck, title: "Equipment & Logistics", desc: "List equipment and manage deliveries." },
];

const ESCROW_FLOW = [
  "Project Created", "Quotation Accepted", "Contract Generated", "Client Funds Escrow",
  "Contractor Starts Work", "Milestone Completed", "Client Review", "Payment Released",
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden bg-secondary text-white border-b border-white/10">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <Container className="relative py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs text-slate-300 mb-6">
            Africa&apos;s AI-powered construction ecosystem
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto">
            Build Smarter. Build Faster. <span className="text-primary">Build Together.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mt-6">
            Build Me connects clients, contractors, architects, engineers, suppliers, and equipment
            providers on one secure platform — with wallet, escrow, and AI tools built in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button href="/marketplace" size="lg">
              Post a Project <ArrowRight size={18} />
            </Button>
            <Button href="/professionals" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Join as a Professional
            </Button>
          </div>
        </Container>
      </div>

      {/* MODULES */}
      <Section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>Platform</Eyebrow>
          <h2 className="mb-3">One ecosystem, every stakeholder</h2>
          <p className="text-neutral-400">
            Build Me isn&apos;t a website — it&apos;s the connective layer for planning, hiring, paying,
            procuring, and managing construction projects.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES.map((m) => (
            <Card key={m.title}>
              <div className="w-11 h-11 rounded bg-primary-100 flex items-center justify-center text-primary mb-4">
                <m.icon size={20} />
              </div>
              <h5 className="font-display font-semibold mb-1.5">{m.title}</h5>
              <p className="text-sm text-neutral-400">{m.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* USER TYPES */}
      <Section muted>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>Who it&apos;s for</Eyebrow>
          <h2 className="mb-3">Built for every role in construction</h2>
          <p className="text-neutral-400">Every workflow on Build Me is role-aware, from posting a project to approving final payment.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {USER_TYPES.map((u) => (
            <Card key={u.title} hover={false} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-secondary text-white flex items-center justify-center shrink-0">
                <u.icon size={18} />
              </div>
              <div>
                <h5 className="font-display font-semibold mb-1">{u.title}</h5>
                <p className="text-sm text-neutral-400">{u.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ESCROW FLOW */}
      <Section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>How payments work</Eyebrow>
          <h2 className="mb-3">Money moves only when work does</h2>
          <p className="text-neutral-400">Client funds sit safely in escrow and release only after each milestone is approved.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ESCROW_FLOW.map((step, i) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                {i + 1}
              </div>
              <span className="text-sm font-medium text-secondary dark:text-[var(--text)] pt-0.5">{step}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* TRUST */}
      <Section muted>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Security</Eyebrow>
            <h2 className="mb-4">Built on fintech-grade trust</h2>
            <ul className="space-y-3">
              {[
                "Every transaction ledgered — append-only, fully auditable",
                "No negative wallet balances, ever",
                "Role-based access, encrypted communications, MFA for admins",
                "KYC verification required before contractors and suppliers go live",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-400">
                  <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card hover={false} className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-success" size={28} />
              <span className="font-display font-semibold text-lg">Escrow Secured</span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Riverside Apartments — Milestone 3 of 5. Funds held until client approval.
            </p>
            <div className="h-2 rounded-full bg-neutral-100 dark:bg-[var(--surface-2)] overflow-hidden">
              <div className="h-full bg-success" style={{ width: "62%" }} />
            </div>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center">
        <h2 className="mb-4">Ready to build with us?</h2>
        <p className="text-neutral-400 max-w-xl mx-auto mb-8">
          Whether you&apos;re posting a project or offering your services, Build Me gives you a secure
          place to do it.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/marketplace" size="lg">Get Started</Button>
          <Button href="/contact" variant="secondary" size="lg">Talk to Us</Button>
        </div>
      </Section>
    </>
  );
}
