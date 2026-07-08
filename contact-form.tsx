"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = ["Client", "Contractor", "Architect / Engineer", "Quantity Surveyor", "Supplier", "Equipment / Logistics", "Other"];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Please enter a valid email address.";
    if (!message) nextErrors.message = "Please add a short message.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      // NOTE: this is a client-side demo submission. Wire this up to Supabase,
      // an email service, or an API route before going to production.
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="mx-auto text-success mb-4" size={40} />
        <h3 className="font-display font-semibold text-xl mb-2">Message received</h3>
        <p className="text-neutral-400 text-sm max-w-sm mx-auto">
          Thanks for reaching out — our team will get back to you within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Input name="name" label="Full name" placeholder="Kwame Mensah" errorText={errors.name} />
        <Input name="email" type="email" label="Email address" placeholder="you@example.com" errorText={errors.email} />
      </div>

      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor="role" className="text-sm font-semibold text-secondary dark:text-[var(--text)]">
          I am a...
        </label>
        <select
          id="role"
          name="role"
          className="rounded border border-neutral-200 dark:border-[var(--border)] px-3.5 py-3 font-body text-base bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-2 focus:border-primary"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <Textarea
        name="message"
        label="Message"
        placeholder="Tell us about your project or question..."
        errorText={errors.message}
      />

      <Button type="submit" className="w-full justify-center mt-2">
        Send Message
      </Button>
    </form>
  );
}
