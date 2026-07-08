import type { LucideIcon } from "lucide-react";
import { Building2, Home, Warehouse, Wrench, Truck } from "lucide-react";

export type ListingCategory = "commercial" | "residential" | "warehousing" | "equipment" | "vehicle";
export type ListingType = "for_rent" | "for_sale";
export type ListingStatus = "active" | "rented" | "sold" | "paused";

export interface Listing {
  id: string;
  user_id: string;
  category: ListingCategory;
  listing_type: ListingType;
  title: string;
  description: string | null;
  price: number;
  price_period: string;
  location: string;
  city: string;
  images: string[];
  specs: Record<string, string | number>;
  status: ListingStatus;
  is_featured: boolean;
  views_count: number;
  created_at: string;
}

interface SpecField {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  required?: boolean;
}

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  pricePeriods: string[];
  fields: SpecField[];
  /** Which spec keys to show as the 3 quick-glance stats on a listing card. */
  cardSpecs: string[];
}

export const CATEGORY_CONFIG: Record<ListingCategory, CategoryConfig> = {
  commercial: {
    label: "Commercial",
    icon: Building2,
    pricePeriods: ["month"],
    cardSpecs: ["property_type", "size_sqm", "parking_spaces"],
    fields: [
      { key: "property_type", label: "Property type", type: "select", options: ["shop", "office", "warehouse", "factory", "showroom"], required: true },
      { key: "size_sqm", label: "Size (sqm)", type: "number", required: true },
      { key: "toilet", label: "Toilet", type: "select", options: ["yes", "no"] },
      { key: "parking_spaces", label: "Parking spaces", type: "number" },
      { key: "power", label: "Power", type: "select", options: ["3-phase", "single-phase", "none"] },
    ],
  },
  residential: {
    label: "Residential",
    icon: Home,
    pricePeriods: ["month", "year"],
    cardSpecs: ["bedrooms", "bathrooms", "furnished"],
    fields: [
      { key: "property_type", label: "Property type", type: "select", options: ["self_contain", "chamber_hall", "2_bedroom", "3_bedroom", "hostel"], required: true },
      { key: "bedrooms", label: "Bedrooms", type: "number", required: true },
      { key: "bathrooms", label: "Bathrooms", type: "number", required: true },
      { key: "furnished", label: "Furnished", type: "select", options: ["furnished", "semi-furnished", "unfurnished"] },
      { key: "water", label: "Water", type: "select", options: ["running_water", "borehole", "none"] },
    ],
  },
  warehousing: {
    label: "Warehousing",
    icon: Warehouse,
    pricePeriods: ["month"],
    cardSpecs: ["warehouse_type", "size_sqm", "security"],
    fields: [
      { key: "warehouse_type", label: "Warehouse type", type: "select", options: ["dry_storage", "cold_room", "container", "open_yard"], required: true },
      { key: "size_sqm", label: "Size (sqm)", type: "number", required: true },
      { key: "security", label: "Security", type: "select", options: ["24_7", "cctv", "guard", "none"] },
      { key: "access", label: "Access", type: "select", options: ["24_7", "business_hours"] },
      { key: "loading_dock", label: "Loading dock", type: "select", options: ["yes", "no"] },
    ],
  },
  equipment: {
    label: "Equipment",
    icon: Wrench,
    pricePeriods: ["day", "week", "month"],
    cardSpecs: ["equipment_type", "capacity", "condition"],
    fields: [
      { key: "equipment_type", label: "Equipment type", type: "select", options: ["mixer", "scaffolding", "excavator", "generator", "tipper", "crane"], required: true },
      { key: "brand", label: "Brand", type: "text" },
      { key: "capacity", label: "Capacity", type: "text", required: true },
      { key: "year", label: "Year", type: "number" },
      { key: "condition", label: "Condition", type: "select", options: ["new", "good", "fair"] },
      { key: "operator_included", label: "Operator included", type: "select", options: ["yes", "no", "optional"] },
      { key: "delivery_available", label: "Delivery available", type: "select", options: ["yes", "no"] },
    ],
  },
  vehicle: {
    label: "Trucks/Cars",
    icon: Truck,
    pricePeriods: ["day", "trip", "month"],
    cardSpecs: ["vehicle_type", "tonnage", "driver_included"],
    fields: [
      { key: "vehicle_type", label: "Vehicle type", type: "select", options: ["tipper", "pickup", "flatbed", "van", "lowbed"], required: true },
      { key: "tonnage", label: "Tonnage", type: "text" },
      { key: "brand_model", label: "Brand / model", type: "text", required: true },
      { key: "year", label: "Year", type: "number" },
      { key: "driver_included", label: "Driver included", type: "select", options: ["yes", "no", "optional"] },
      { key: "fuel_policy", label: "Fuel policy", type: "select", options: ["client", "owner"] },
      { key: "delivery_radius_km", label: "Delivery radius (km)", type: "number" },
    ],
  },
};

export function getCardSpecs(category: ListingCategory, specs: Record<string, string | number>): string[] {
  const config = CATEGORY_CONFIG[category];
  return config.cardSpecs
    .map((key) => specs[key])
    .filter((v) => v !== undefined && v !== null && v !== "")
    .map((v) => String(v).replace(/_/g, " "));
}
