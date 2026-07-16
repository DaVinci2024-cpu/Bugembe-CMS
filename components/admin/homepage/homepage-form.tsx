"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Hero, Statistic, heroContent, trustStatistics } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { ImageUpload } from "@/components/admin/image-upload";
import { STAT_ICON_OPTIONS } from "@/lib/stat-icons";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

function emptyStat(): Statistic {
  return { id: `stat-${Date.now().toString(36)}`, label: "", value: 0, suffix: "+", description: "", icon: "Award" };
}

export function HomepageForm() {
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<Hero>(heroContent);
  const [stats, setStats] = useState<Statistic[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([siteSettingsRepository.getHero(), siteSettingsRepository.getStatistics()]).then(([existingHero, existingStats]) => {
      setHero(existingHero ?? heroContent);
      setStats(existingStats ?? trustStatistics);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await Promise.all([siteSettingsRepository.saveHero(hero), siteSettingsRepository.saveStatistics(stats)]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading homepage settings...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Hero */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Hero Section</h3>

        <div>
          <label className={labelClass}>Headline</label>
          <input className={inputClass} value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Subheadline</label>
          <textarea
            rows={2}
            className={inputClass}
            value={hero.subheadline}
            onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Background Image</label>
          <ImageUpload value={hero.bgImage} onChange={(url) => setHero({ ...hero, bgImage: url })} folder="homepage" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary Button Text</label>
            <input
              className={inputClass}
              value={hero.ctaPrimaryText}
              onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Primary Button Link</label>
            <input
              className={inputClass}
              value={hero.ctaPrimaryLink}
              onChange={(e) => setHero({ ...hero, ctaPrimaryLink: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Secondary Button Text</label>
            <input
              className={inputClass}
              value={hero.ctaSecondaryText}
              onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Secondary Button Link</label>
            <input
              className={inputClass}
              value={hero.ctaSecondaryLink}
              onChange={(e) => setHero({ ...hero, ctaSecondaryLink: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Trust Statistics */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Trust Statistics</h3>
          <button
            type="button"
            onClick={() => setStats([...stats, emptyStat()])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Statistic
          </button>
        </div>

        {stats.map((stat, i) => (
          <div key={stat.id} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Statistic {i + 1}</span>
              <button
                type="button"
                onClick={() => setStats(stats.filter((_, idx) => idx !== i))}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Value</label>
                <input
                  type="number"
                  step="any"
                  className={inputClass}
                  value={stat.value}
                  onChange={(e) => setStats(stats.map((s, idx) => (idx === i ? { ...s, value: Number(e.target.value) } : s)))}
                />
              </div>
              <div>
                <label className={labelClass}>Suffix</label>
                <input
                  className={inputClass}
                  placeholder="+ or %"
                  value={stat.suffix}
                  onChange={(e) => setStats(stats.map((s, idx) => (idx === i ? { ...s, suffix: e.target.value } : s)))}
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <label className={labelClass}>Icon</label>
                <select
                  className={inputClass}
                  value={stat.icon}
                  onChange={(e) => setStats(stats.map((s, idx) => (idx === i ? { ...s, icon: e.target.value } : s)))}
                >
                  {STAT_ICON_OPTIONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Label</label>
              <input
                className={inputClass}
                placeholder="e.g. Active Students"
                value={stat.label}
                onChange={(e) => setStats(stats.map((s, idx) => (idx === i ? { ...s, label: e.target.value } : s)))}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input
                className={inputClass}
                placeholder="e.g. Nurtured on campus"
                value={stat.description}
                onChange={(e) => setStats(stats.map((s, idx) => (idx === i ? { ...s, description: e.target.value } : s)))}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && (
        <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          Saved — changes are live on the public homepage.
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
