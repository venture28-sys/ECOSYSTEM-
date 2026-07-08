import type { Metadata } from "next";
import { Package, Truck, Warehouse, BadgeCheck, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, Container, Eyebrow } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "List materials or equipment on Build Me and reach construction clients and contractors across Africa.",
};

const ROLES = [
  { icon: Package, title: "Material Suppliers", desc: "List products, manage inventory, and accept orders from clients and contractors." },
  { icon: Truck, title: "Equipment Rental Companies", desc: "List equipment, track availability, and process rental requests." },
  { icon: Warehouse, title: "Logistics Providers", desc: "Handle deliveries, track shipments, and confirm drop-offs." },
];

const WHY = [
  { icon: BadgeCheck, title: "Verified business listing", desc: "Business information verification builds buyer confidence before the first order." },
  { icon: TrendingUp, title: "Built-in demand", desc: "Every marketplace project is a potential material or equipment order." },
];

export default function SuppliersPage() {
  return (
    <>
      <div className="bg-secondary text-white">
        <Container className="py-20 text-center">
          <Eyebrow>For Suppliers</Eyebrow>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Reach every builder on the platform</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8">
            Materials, equipment, and logistics — list your business and start fulfilling orders from
            verified construction projects.
          </p>
          <Button href="/contact" size="lg">List Your Business</Button>
        </Container>
      </div>

      <Section>
        <div className="grid sm:grid-cols-3 gap-5">
          {ROLES.map((r) => (
            <Card key={r.title}>
              <div className="w-11 h-11 rounded bg-primary-100 flex items-center justify-center text-primary mb-4">
                <r.icon size={20} />
              </div>
              <h5 className="font-display font-semibold mb-1.5">{r.title}</h5>
              <p className="text-sm text-neutral-400">{r.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid lg:grid-cols-2 gap-6">
          {WHY.map((w) => (
            <Card key={w.title} hover={false}>
              <w.icon className="text-primary mb-4" size={24} />
              <h5 className="font-display font-semibold mb-1.5">{w.title}</h5>
              <p className="text-sm text-neutral-400">{w.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Requirements</Eyebrow>
            <h2 className="mb-4">Before you list</h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Every supplier verifies their business information before listing products, in line with
              Build Me&apos;s platform-wide trust and security standards. This protects buyers and keeps
              the marketplace credible for every supplier on it.
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Once verified, orders and payments flow through the same wallet and ledger system used
              across the platform — every transaction recorded, every balance reconciled.
            </p>
          </div>
          <Card hover={false} className="p-8 text-center">
            <h4 className="font-display font-semibold text-xl mb-2">Ready to list?</h4>
            <p className="text-neutral-400 text-sm mb-6">Tell us about your business and we&apos;ll guide you through verification.</p>
            <Button href="/contact" className="w-full justify-center">
              Get Started <ArrowRight size={16} />
            </Button>
          </Card>
        </div>
      </Section>
    </>
  );
}
