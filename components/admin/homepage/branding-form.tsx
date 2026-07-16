"use client";

import { useEffect, useState } from "react";
import { Branding, defaultBranding } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { ImageUpload } from "@/components/admin/image-upload";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function BrandingForm() {
  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<Branding>(defaultBranding);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getBranding().then((existing) => {
      setBranding(existing ?? defaultBranding);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveBranding(branding);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading branding...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Logo & Branding</h3>
        <p className="text-xs text-slate-500">Shown in the header, footer, and hero badge across every public page.</p>

        <div>
          <label className={labelClass}>Logo</label>
          <ImageUpload value={branding.logoUrl} onChange={(url) => setBranding({ ...branding, logoUrl: url })} folder="branding" />
          <p className="text-[10px] text-slate-400 mt-1">Leave blank to keep using the default institute emblem.</p>
        </div>
        <div>
          <label className={labelClass}>Site Name</label>
          <input className={inputClass} value={branding.siteName} onChange={(e) => setBranding({ ...branding, siteName: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input className={inputClass} value={branding.tagline} onChange={(e) => setBranding({ ...branding, tagline: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Footer Description</label>
          <textarea
            rows={3}
            className={inputClass}
            value={branding.brandBlurb}
            onChange={(e) => setBranding({ ...branding, brandBlurb: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Certification / Credential Line</label>
          <input
            className={inputClass}
            value={branding.certificationText}
            onChange={(e) => setBranding({ ...branding, certificationText: e.target.value })}
          />
        </div>
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">Saved — changes are live site-wide.</div>}

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
