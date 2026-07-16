"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Program } from "@/lib/data";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { ImageUpload } from "@/components/shared/image-upload";

const LEVELS: Program["level"][] = ["Nursery", "Primary", "Secondary", "Islamic Studies", "Boarding"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function ProgramForm({ existing }: { existing?: Program }) {
  const router = useRouter();
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [level, setLevel] = useState<Program["level"]>(existing?.level ?? LEVELS[0]);
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? "");
  const [longDescription, setLongDescription] = useState(existing?.longDescription ?? "");
  const [curriculum, setCurriculum] = useState((existing?.curriculum ?? []).join("\n"));
  const [duration, setDuration] = useState(existing?.duration ?? "");
  const [admissionRequirements, setAdmissionRequirements] = useState((existing?.admissionRequirements ?? []).join("\n"));
  const [feesPlaceholder, setFeesPlaceholder] = useState(existing?.feesPlaceholder ?? "Contact Admissions Office for latest structure");
  const [image, setImage] = useState(existing?.image ?? "");
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [status, setStatus] = useState<Program["status"]>(existing?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!image) throw new Error("Please add an image before saving.");
      const fields = {
        title,
        level,
        shortDescription,
        longDescription,
        curriculum: linesToList(curriculum),
        duration,
        admissionRequirements: linesToList(admissionRequirements),
        feesPlaceholder,
        image,
        featured,
        status,
      };
      if (isEdit) {
        await programsRepository.update(existing.id, fields);
      } else {
        const id = slugify(title);
        if (!id) throw new Error("Enter a title so we can generate the program's ID.");
        await programsRepository.create(id, fields);
      }
      router.push("/admin/programs");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save program.");
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
        <label className={labelClass}>Level</label>
        <select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value as Program["level"])}>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Short Description</label>
        <textarea
          required
          rows={2}
          className={inputClass}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="One or two sentences shown on program listing cards."
        />
      </div>

      <div>
        <label className={labelClass}>Long Description</label>
        <textarea
          required
          rows={5}
          className={inputClass}
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Curriculum Pillars <span className="font-normal normal-case text-slate-400">(one per line)</span></label>
        <textarea
          required
          rows={5}
          className={inputClass}
          value={curriculum}
          onChange={(e) => setCurriculum(e.target.value)}
          placeholder={"Mathematics & Science\nEnglish Language & Literature"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Duration</label>
          <input required className={inputClass} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 7 Years (P1 to P7)" />
        </div>
        <div>
          <label className={labelClass}>Fees</label>
          <input required className={inputClass} value={feesPlaceholder} onChange={(e) => setFeesPlaceholder(e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Admission Requirements <span className="font-normal normal-case text-slate-400">(one per line)</span></label>
        <textarea
          required
          rows={4}
          className={inputClass}
          value={admissionRequirements}
          onChange={(e) => setAdmissionRequirements(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Image</label>
        <ImageUpload value={image} onChange={setImage} folder="programs" />
        {!image && <p className="text-xs text-rose-600 mt-1">An image is required.</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="cursor-pointer" />
        Feature this program (shown on the homepage preview)
      </label>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:bg-slate-300 text-white font-bold rounded-lg text-xs cursor-pointer"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Program"}
        </button>
        <Link
          href="/admin/programs"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs"
        >
          Cancel
        </Link>
        <Link
          href="/admin/programs/preview"
          target="_blank"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs ml-auto"
        >
          Preview All Programs
        </Link>
      </div>
    </form>
  );
}
