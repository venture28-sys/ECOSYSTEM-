"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <Container className="py-24 max-w-md">
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-3xl mb-2">Welcome back</h1>
        <p className="text-neutral-400">Log in to your Build Me account.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Input name="email" type="email" label="Email address" placeholder="you@example.com" required />
        <Input name="password" type="password" label="Password" placeholder="Your password" required />

        {error && <p className="text-sm text-danger mb-4">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-400 mt-6">
        Don&apos;t have an account? <Link href="/signup" className="text-primary font-semibold">Sign up</Link>
      </p>
    </Container>
  );
}
