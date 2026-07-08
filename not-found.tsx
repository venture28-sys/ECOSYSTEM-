import Link from "next/link";
import { HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <div className="w-14 h-14 rounded bg-primary-100 text-primary flex items-center justify-center mx-auto mb-6">
        <HardHat size={26} />
      </div>
      <h1 className="font-display font-bold text-3xl sm:text-4xl mb-3">Page not found</h1>
      <p className="text-neutral-400 max-w-md mx-auto mb-8">
        This page hasn&apos;t been built yet — or the link you followed has moved.
      </p>
      <Button href="/">Back to Home</Button>
    </Container>
  );
}
