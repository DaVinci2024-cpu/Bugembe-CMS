"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GalleryItem } from "@/lib/data";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { ImageUpload } from "@/components/admin/image-upload";

const CATEGORIES: GalleryItem["category"][] = ["Campus", "Islamic Activities", "Academics", "Sports", "Events", "Facilities"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function GalleryForm({ existing }: { existing?: GalleryItem }) {
  const router = useRouter();
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [category, setCategory] = useState<GalleryItem["category"]>(existing?.category ?? CATEGORIES[0]);
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10));
  const [image, setImage] = useState(existing?.image ?? "");
  const [status, setStatus] = useState<GalleryItem["status"]>(existing?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!image) throw new Error("Please add an image before saving.");
      const fields = { title, description, category, date, image, status };
      if (isEdit) {
        await galleryRepository.update(existing.id, fields);
      } else {
        const id = `${slugify(title)}-${Date.now().toString(36)}`;
        await galleryRepository.create(id, fields);
      }
      router.push("/admin/gallery");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save gallery item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div>
        <label className={labelClass}>Status</label>
        <div className="flex gap-2">
          {(["draft", "published"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                status === s
                  ? s === "published"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1">Drafts are only visible in this admin panel, never on the public site.</p>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea required rows={2} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as GalleryItem["category"])}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" required className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Image</label>
        <ImageUpload value={image} onChange={setImage} folder="gallery" />
        {!image && <p className="text-xs text-rose-600 mt-1">An image is required.</p>}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:bg-slate-300 text-white font-bold rounded-lg text-xs cursor-pointer"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add to Gallery"}
        </button>
        <Link
          href="/admin/gallery"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs"
        >
          Cancel
        </Link>
        <Link
          href="/admin/gallery/preview"
          target="_blank"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs ml-auto"
        >
          Preview All
        </Link>
      </div>
    </form>
  );
}
