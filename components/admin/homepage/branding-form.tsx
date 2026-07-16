"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Branding, defaultBranding } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { ImageUpload } from "@/components/shared/image-upload";

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

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Brand Colors</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Applies to the public website only — the header, footer, buttons, and accents. The admin console keeps its own fixed
            colors regardless of what you set here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer shrink-0"
              />
              <input
                className={inputClass}
                value={branding.primaryColor}
                onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Header, footer, buttons.</p>
          </div>
          <div>
            <label className={labelClass}>Primary Hover Shade</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.primaryColorHover}
                onChange={(e) => setBranding({ ...branding, primaryColorHover: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer shrink-0"
              />
              <input
                className={inputClass}
                value={branding.primaryColorHover}
                onChange={(e) => setBranding({ ...branding, primaryColorHover: e.target.value })}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Usually a darker shade of Primary.</p>
          </div>
          <div>
            <label className={labelClass}>Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.accentColor}
                onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer shrink-0"
              />
              <input
                className={inputClass}
                value={branding.accentColor}
                onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Links, badges, highlights.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Live Preview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Updates instantly as you adjust colors above — nothing here is saved until you click Save Changes.</p>
        </div>

        <div
          className="rounded-lg border border-slate-200 overflow-hidden"
          style={
            {
              "--color-primary": branding.primaryColor,
              "--color-primary-hover": branding.primaryColorHover,
              "--color-accent": branding.accentColor,
            } as CSSProperties
          }
        >
          {/* Mock header */}
          <div className="bg-[var(--color-primary)] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[var(--color-accent)]" />
              <span className="text-white font-bold text-sm">{branding.siteName || "Site Name"}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-white/80 text-xs font-medium">
              <span>Home</span>
              <span>About</span>
              <span>Admissions</span>
            </div>
          </div>

          {/* Mock hero / body */}
          <div className="bg-[#fcfbf9] p-6 space-y-4">
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1 rounded-full">
              {branding.tagline || "Tagline"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm space-y-2">
                <h4 className="text-[var(--color-primary)] font-serif font-bold text-sm">Sample Card Title</h4>
                <p className="text-slate-500 text-xs">A short line of card body copy to preview text against the surrounding colors.</p>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <button
                  type="button"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-2.5 px-4 rounded-lg text-xs"
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className="bg-[var(--color-accent)] text-[var(--color-primary)] font-bold py-2.5 px-4 rounded-lg text-xs"
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>

          {/* Mock footer */}
          <div className="bg-[var(--color-primary)] px-5 py-3">
            <span className="text-white/60 text-[10px]">{branding.brandBlurb || "Footer description"}</span>
          </div>
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
