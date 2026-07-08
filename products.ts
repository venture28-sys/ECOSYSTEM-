export interface Product {
  id: string;
  supplier_id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  category: string | null;
  location: string | null;
  is_active: boolean;
  created_at: string;
}
