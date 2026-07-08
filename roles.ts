import { HardHat, Users, Building2, PenTool, Ruler, Package, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type UserRole =
  | "client"
  | "worker"
  | "contractor"
  | "architect"
  | "engineer"
  | "quantity_surveyor"
  | "supplier";

export interface RoleMeta {
  value: UserRole;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const ROLES: RoleMeta[] = [
  { value: "client", label: "Client", description: "I want to post projects and hire professionals", icon: Users },
  { value: "worker", label: "Worker", description: "I do skilled or general labor on-site", icon: Wrench },
  { value: "contractor", label: "Contractor", description: "I quote, manage, and deliver construction projects", icon: HardHat },
  { value: "architect", label: "Architect", description: "I design projects and produce drawings", icon: PenTool },
  { value: "engineer", label: "Engineer", description: "I provide engineering review and inspections", icon: Building2 },
  { value: "quantity_surveyor", label: "Quantity Surveyor", description: "I create BOQs and manage budgets", icon: Ruler },
  { value: "supplier", label: "Supplier", description: "I sell materials or rent equipment", icon: Package },
];

export function roleLabel(role: UserRole): string {
  return ROLES.find((r) => r.value === role)?.label ?? role;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  phone: string | null;
  phone_verified: boolean;
  is_available: boolean;
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  rating_avg: number;
  rating_count: number;
  completed_jobs_count: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string | null;
  issue_date: string | null;
  file_url: string | null;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
}

export interface CompletedJob {
  id: string;
  title: string;
  client_name: string | null;
  completed_at: string | null;
  description: string | null;
}
