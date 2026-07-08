import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_CONFIG, getCardSpecs, type Listing } from "@/lib/listings";

export function ListingCard({ listing }: { listing: Listing }) {
  const config = CATEGORY_CONFIG[listing.category];
  const Icon = config.icon;
  const specs = getCardSpecs(listing.category, listing.specs);

  return (
    <Link href={`/rentals/${listing.id}`}>
      <Card className="h-full flex flex-col">
        {listing.images?.[0] ? (
          <div className="relative w-full h-36 rounded overflow-hidden mb-3">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-36 rounded bg-neutral-100 dark:bg-[var(--surface-2)] flex items-center justify-center mb-3">
            <Icon className="text-neutral-300" size={28} />
          </div>
        )}

        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Badge tone="primary">{config.label}</Badge>
          {listing.is_featured && (
            <Badge tone="warning"><Star size={10} className="fill-warning" /> Featured</Badge>
          )}
        </div>

        <h5 className="font-display font-semibold text-sm mb-1">{listing.title}</h5>
        <p className="text-sm font-semibold text-primary mb-2">
          GHS {listing.price.toLocaleString()}
          <span className="text-xs font-normal text-neutral-400">
            {listing.listing_type === "for_rent" ? ` / ${listing.price_period}` : " (sale)"}
          </span>
        </p>

        {specs.length > 0 && (
          <p className="text-xs text-neutral-400 mb-2 capitalize">{specs.join(" · ")}</p>
        )}

        <span className="flex items-center gap-1 text-xs text-neutral-400 mt-auto">
          <MapPin size={12} /> {listing.city}
        </span>
      </Card>
    </Link>
  );
}
