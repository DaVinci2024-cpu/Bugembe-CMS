"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlumniProfile } from "@/lib/data";
import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { ImageUpload } from "@/components/admin/image-upload";

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

export function AlumniForm({ existing }: { existing?: AlumniProfile }) {
  const router = useRouter();
  const isEdit = !!existing;

  const [fullName, setFullName] = useState(existing?.fullName ?? "");
  const [graduationYear, setGraduationYear] = useState(existing?.graduationYear?.toString() ?? "");
  const [profession, setProfession] = useState(existing?.profession ?? "");
  const [organization, setOrganization] = useState(existing?.organization ?? "");
  const [country, setCountry] = useState(existing?.country ?? "Uganda");
  const [city, setCity] = useState(existing?.city ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [photo, setPhoto] = useState(existing?.photo ?? "");
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [status, setStatus] = useState<AlumniProfile["status"]>(existing?.status ?? "approved");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!photo) throw new Error("Please add a photo before saving.");
      const year = Number(graduationYear.trim());
      if (!year) throw new Error("Enter a valid graduation year.");
      const fields = {
        fullName,
        graduationYear: year,
        profession,
        organization,
        country,
        city,
        phone,
        email,
        photo,
        bio,
        featured,
        status,
      };
      if (isEdit) {
        await alumniRepository.update(existing.id, fields);
      } else {
        const id = `${slugify(fullName)}-${Date.now().toString(36)}`;
        await alumniRepository.create(id, fields);
      }
      router.push("/admin/alumni");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div>
        <label className={labelClass}>Status</label>
        <div className="flex gap-2">
          {(["pending", "approved"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                status === s
                  ? s === "approved"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Pending profiles are still visible on the public directory, just marked &quot;Awaiting Admin Validation&quot;.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input required className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Graduation Year</label>
          <input
            type="number"
            required
            className={inputClass}
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Profession</label>
          <input required className={inputClass} value={profession} onChange={(e) => setProfession(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Organization</label>
          <input required className={inputClass} value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Country</label>
          <input required className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input required className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone</label>
          <input required className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea required rows={3} className={inputClass} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Photo</label>
        <ImageUpload value={photo} onChange={setPhoto} folder="alumni" />
        {!photo && <p className="text-xs text-rose-600 mt-1">A photo is required.</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="cursor-pointer" />
        Feature this profile
      </label>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:bg-slate-300 text-white font-bold rounded-lg text-xs cursor-pointer"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Alumnus"}
        </button>
        <Link
          href="/admin/alumni"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
