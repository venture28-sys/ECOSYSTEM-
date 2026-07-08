"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  bucket?: "avatars" | "covers";
  onUploaded: (url: string) => void;
  shape?: "circle" | "banner";
}

/**
 * Uploads to Supabase Storage under {bucket}/{userId}/{filename}, matching
 * the "owner-only write" storage policies defined in supabase/schema.sql.
 */
export function AvatarUpload({ userId, currentUrl, bucket = "avatars", onUploaded, shape = "circle" }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      setUploading(false);
      alert(`Upload failed: ${error.message}`);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setPreview(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  }

  const isCircle = shape === "circle";

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer group overflow-hidden bg-neutral-100 dark:bg-[var(--surface-2)] flex items-center justify-center
        ${isCircle ? "w-28 h-28 rounded-full border-4 border-[var(--surface)]" : "w-full h-40 rounded"}`}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="w-full h-full object-cover" />
      ) : (
        <Camera className="text-neutral-300" size={isCircle ? 28 : 32} />
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex items-center justify-center">
        {uploading ? <Loader2 className="animate-spin text-white" size={20} /> : <Camera className="text-white" size={20} />}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
