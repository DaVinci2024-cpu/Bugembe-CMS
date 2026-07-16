"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Testimonial } from "@/lib/data";
import { testimonialsRepository } from "@/lib/firebase/testimonialsRepository";
import { ImageUpload } from "@/components/shared/image-upload";

const ROLES: Testimonial["role"][] = ["Parent", "Student", "Alumnus", "Teacher"];

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

export function TestimonialForm({ existing }: { existing?: Testimonial }) {
  const router = useRouter();
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState<Testimonial["role"]>(existing?.role ?? ROLES[0]);
  const [graduationYear, setGraduationYear] = useState(existing?.graduationYear?.toString() ?? "");
  const [quote, setQuote] = useState(existing?.quote ?? "");
  const [avatar, setAvatar] = useState(existing?.avatar ?? "");
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [status, setStatus] = useState<Testimonial["status"]>(existing?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!avatar) throw new Error("Please add a photo before saving.");
      const year = graduationYear.trim() ? Number(graduationYear.trim()) : undefined;
      const fields = {
        name,
        role,
        quote,
        avatar,
        rating,
        status,
        ...(year !== undefined ? { graduationYear: year } : {}),
      };
      if (isEdit) {
        await testimonialsRepository.update(existing.id, fields);
      } else {
        const id = `${slugify(name)}-${Date.now().toString(36)}`;
        await testimonialsRepository.create(id, fields);
      }
      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name</label>
          <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value as Testimonial["role"])}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(role === "Alumnus" || role === "Student") && (
        <div>
          <label className={labelClass}>Graduation Year <span className="font-normal normal-case text-slate-400">(optional)</span></label>
          <input
            type="number"
            className={inputClass}
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            placeholder="e.g. 2019"
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Quote</label>
        <textarea required rows={4} className={inputClass} value={quote} onChange={(e) => setQuote(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Rating</label>
        <select className={inputClass} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Photo</label>
        <ImageUpload value={avatar} onChange={setAvatar} folder="testimonials" />
        {!avatar && <p className="text-xs text-rose-600 mt-1">A photo is required.</p>}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:bg-slate-300 text-white font-bold rounded-lg text-xs cursor-pointer"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Testimonial"}
        </button>
        <Link
          href="/admin/testimonials"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs"
        >
          Cancel
        </Link>
        <Link
          href="/admin/testimonials/preview"
          target="_blank"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs ml-auto"
        >
          Preview All
        </Link>
      </div>
    </form>
  );
}
