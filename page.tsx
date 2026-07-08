import type { Metadata } from "next";
import { Target, Compass, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section, Container, Eyebrow } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "About",
  description: "Build Me is a Venture 28 company building Africa's leading digital construction ecosystem.",
};

const VALUES = [
  "Innovation", "Trust", "Transparency", "Quality", "Efficiency",
  "Security", "Accessibility", "Customer Success", "Continuous Improvement",
];

const PHASES = [
  { phase: "Phase 1", title: "Marketplace MVP", desc: "Core project posting, quotations, and hiring flows." },
  { phase: "Phase 2", title: "Wallet & Escrow", desc: "Secure payments and milestone-based fund release." },
  { phase: "Phase 3", title: "AI Features", desc: "BOQ generation, cost estimation, and construction guidance." },
  { phase: "Phase 4", title: "Mobile Apps", desc: "Native experience for every user type, on the go." },
  { phase: "Phase 5", title: "Expansion Across Africa", desc: "Scaling the ecosystem to new markets and cities." },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-secondary text-white">
        <Container className="py-20 text-center">
          <Eyebrow>About Build Me</Eyebrow>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">
            Not a website. <span className="text-primary">A digital ecosystem.</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Build Me is a Venture 28 company connecting every stakeholder in the construction
            industry through one secure, AI-powered platform.
          </p>
        </Container>
      </div>

      <Section>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card hover={false}>
            <div className="w-11 h-11 rounded bg-primary-100 flex items-center justify-center text-primary mb-4">
              <Compass size={20} />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Our Vision</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              To become Africa&apos;s leading digital construction ecosystem by connecting every
              stakeholder in the construction industry through one secure, AI-powered platform.
            </p>
          </Card>
          <Card hover={false}>
            <div className="w-11 h-11 rounded bg-primary-100 flex items-center justify-center text-primary mb-4">
              <Target size={20} />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Our Mission</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              To simplify planning, hiring, payments, procurement, project management, and financing
              for construction projects using intelligent technology.
            </p>
          </Card>
        </div>
      </Section>

      <Section muted>
        <div className="text-center max-w-xl mx-auto mb-10">
          <Eyebrow>Core Values</Eyebrow>
          <h2>What guides every decision we make</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {VALUES.map((v) => (
            <span
              key={v}
              className="rounded-full border border-neutral-200 dark:border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-secondary dark:text-[var(--text)] shadow-card"
            >
              {v}
            </span>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center max-w-xl mx-auto mb-12">
          <Eyebrow>Launch Strategy</Eyebrow>
          <h2 className="mb-3">How we&apos;re building this, one phase at a time</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {PHASES.map((p, i) => (
            <Card key={p.phase} hover={false}>
              <div className="font-mono text-xs text-primary font-bold mb-2">{p.phase}</div>
              <h5 className="font-display font-semibold mb-1.5">{p.title}</h5>
              <p className="text-sm text-neutral-400">{p.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section muted className="text-center">
        <Sparkles className="mx-auto text-primary mb-4" size={32} />
        <h2 className="mb-3">Backed by Venture 28</h2>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Build Me operates under Venture 28, with a long-term objective of becoming the largest
          construction technology ecosystem in Africa — the safest construction FinTech platform,
          and the most intelligent AI-powered construction platform on the continent.
        </p>
      </Section>
    </>
  );
}
