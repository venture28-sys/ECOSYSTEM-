export interface Message {
  id: string;
  job_id: string | null;
  product_id: string | null;
  sender_id: string;
  recipient_id: string;
  body: string;
  read_at: string | null;
  is_system: boolean;
  created_at: string;
}
