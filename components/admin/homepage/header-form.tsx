"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { defaultHeaderAnnouncements } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";

export function HeaderForm() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getHeaderAnnouncements().then((existing) => {
      setAnnouncements(existing ?? defaultHeaderAnnouncements);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveHeaderAnnouncements(announcements.filter((a) => a.trim()));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading announcements...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Header Announcement Ticker</h3>
            <p className="text-xs text-slate-500 mt-0.5">The scrolling &quot;Live Updates&quot; messages in the top banner.</p>
          </div>
          <button
            type="button"
            onClick={() => setAnnouncements([...announcements, ""])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Announcement
          </button>
        </div>

        {announcements.map((text, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputClass}
              value={text}
              onChange={(e) => setAnnouncements(announcements.map((a, idx) => (idx === i ? e.target.value : a)))}
              placeholder="e.g. Admissions closing soon for Term 2..."
            />
            <button
              type="button"
              onClick={() => setAnnouncements(announcements.filter((_, idx) => idx !== i))}
              className="p-2 rounded hover:bg-rose-50 text-rose-500 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-xs text-slate-400">No announcements — the ticker will be empty.</p>}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">Saved — live in the header ticker.</div>}

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
