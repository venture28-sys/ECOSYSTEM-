"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function JobFilterBar({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <div className="grid sm:grid-cols-4 gap-3 mb-8">
      <Select value={searchParams.get("category") ?? "all"} onValueChange={(v) => setParam("category", v === "all" ? "" : v)}>
        <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.slug} value={c.name}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        id="filter-location"
        label="City"
        placeholder="e.g. Accra"
        defaultValue={searchParams.get("location") ?? ""}
        onBlur={(e) => setParam("location", e.target.value)}
        className="mb-0"
      />
      <Input
        id="filter-budget-min"
        label="Min budget (GHS)"
        type="number"
        placeholder="500"
        defaultValue={searchParams.get("budget_min") ?? ""}
        onBlur={(e) => setParam("budget_min", e.target.value)}
        className="mb-0"
      />
      <Input
        id="filter-budget-max"
        label="Max budget (GHS)"
        type="number"
        placeholder="1500"
        defaultValue={searchParams.get("budget_max") ?? ""}
        onBlur={(e) => setParam("budget_max", e.target.value)}
        className="mb-0"
      />
    </div>
  );
}
