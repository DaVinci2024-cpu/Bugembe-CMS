"use client";

import { useEffect, useState } from "react";
import { AlumniSpotlight, defaultAlumniSpotlight } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { ImageUpload } from "@/components/shared/image-upload";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function SpotlightForm() {
  const [loading, setLoading] = useState(true);
  const [spotlight, setSpotlight] = useState<AlumniSpotlight>(defaultAlumniSpotlight);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getAlumniSpotlight().then((existing) => {
      setSpotlight(existing ?? defaultAlumniSpotlight);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveAlumniSpotlight(spotlight);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading spotlight...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Alumni Spotlight</h3>
          <p className="text-xs text-slate-500 mt-0.5">The single featured success story shown on the public Alumni page.</p>
        </div>

        <div>
          <label className={labelClass}>Photo</label>
          <ImageUpload value={spotlight.photo} onChange={(url) => setSpotlight({ ...spotlight, photo: url })} folder="alumni" />
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <input
            className={inputClass}
            placeholder="e.g. Academic & Sharia Scholar"
            value={spotlight.badge}
            onChange={(e) => setSpotlight({ ...spotlight, badge: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Name & Class</label>
          <input
            className={inputClass}
            placeholder="e.g. Sheikh Dr. Anas Lwanga (Class of 2004)"
            value={spotlight.name}
            onChange={(e) => setSpotlight({ ...spotlight, name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Quote</label>
          <textarea
            rows={4}
            className={inputClass}
            value={spotlight.quote}
            onChange={(e) => setSpotlight({ ...spotlight, quote: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current Role</label>
            <input
              className={inputClass}
              value={spotlight.currentRole}
              onChange={(e) => setSpotlight({ ...spotlight, currentRole: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={spotlight.location}
              onChange={(e) => setSpotlight({ ...spotlight, location: e.target.value })}
            />
          </div>
        </div>
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && (
        <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          Saved — live on the public Alumni page.
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:bg-slate-300 text-white font-bold rounded-lg text-xs cursor-pointer"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
