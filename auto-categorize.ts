// AI Rule 2: Auto-categorize. Deliberately simple keyword matching, not an
// API call — runs instantly client-side with zero network cost, which
// matters on 3G. Keywords map to the exact categories seeded in the
// `categories` table; keep this in sync if categories change.
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Carpentry: ["wood", "carpenter", "furniture", "cabinet", "door", "window frame", "shelv"],
  Design: ["design", "architect", "blueprint", "render", "floor plan", "3d"],
  Electrical: ["electric", "wiring", "electrician", "power", "socket", "circuit", "generator"],
  "General Construction": ["build", "construction", "foundation", "structure", "extension", "renovat"],
  Landscaping: ["garden", "landscap", "lawn", "outdoor", "yard", "fence"],
  Masonry: ["brick", "block", "mason", "concrete", "cement", "wall"],
  Painting: ["paint", "finish coat", "wall colour", "wall color"],
  Plumbing: ["plumb", "pipe", "leak", "toilet", "sink", "water heater", "borehole"],
  Roofing: ["roof", "gutter", "shingle", "leak in the roof"],
  Tiling: ["tile", "flooring", "bathroom floor", "ceramic"],
};

export function suggestCategory(title: string, description: string = ""): string | null {
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return category;
  }
  return null;
}
