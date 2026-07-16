"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Achievement, premiumAchievements } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

function emptyAchievement(): Achievement {
  return { id: `ach-${Date.now().toString(36)}`, year: new Date().getFullYear().toString(), title: "", category: "", description: "", metric: "" };
}

export function AchievementsForm() {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getAchievements().then((existing) => {
      setAchievements(existing ?? premiumAchievements);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveAchievements(achievements);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading achievements timeline...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Achievements Timeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Milestones shown on the homepage achievements section.</p>
          </div>
          <button
            type="button"
            onClick={() => setAchievements([...achievements, emptyAchievement()])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Milestone
          </button>
        </div>

        {achievements.map((ach, i) => (
          <div key={ach.id} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Milestone {i + 1}</span>
              <button
                type="button"
                onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Year</label>
                <input
                  className={inputClass}
                  value={ach.year}
                  onChange={(e) => setAchievements(achievements.map((a, idx) => (idx === i ? { ...a, year: e.target.value } : a)))}
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <label className={labelClass}>Category</label>
                <input
                  className={inputClass}
                  placeholder="e.g. UNEB Results"
                  value={ach.category}
                  onChange={(e) => setAchievements(achievements.map((a, idx) => (idx === i ? { ...a, category: e.target.value } : a)))}
                />
              </div>
              <div>
                <label className={labelClass}>Metric</label>
                <input
                  className={inputClass}
                  placeholder="e.g. 1st Place"
                  value={ach.metric ?? ""}
                  onChange={(e) => setAchievements(achievements.map((a, idx) => (idx === i ? { ...a, metric: e.target.value } : a)))}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={ach.title}
                onChange={(e) => setAchievements(achievements.map((a, idx) => (idx === i ? { ...a, title: e.target.value } : a)))}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                className={inputClass}
                value={ach.description}
                onChange={(e) => setAchievements(achievements.map((a, idx) => (idx === i ? { ...a, description: e.target.value } : a)))}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">Saved — live on the public homepage.</div>}

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
