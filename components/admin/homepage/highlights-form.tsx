"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Highlight, defaultHighlights } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { ImageUpload } from "@/components/shared/image-upload";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

function emptyHighlight(): Highlight {
  return {
    id: `highlight-${Date.now().toString(36)}`,
    title: "",
    description: "",
    image: "",
    date: "",
    link: "",
    linkText: "",
  };
}

export function HighlightsForm() {
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getHighlights().then((existing) => {
      setHighlights(existing ?? defaultHighlights);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveHighlights(highlights);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const updateHighlight = (id: string, updates: Partial<Highlight>) => {
    setHighlights(highlights.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  if (loading) return <p className="text-xs text-slate-400">Loading highlights...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Highlights &amp; Announcements</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Results, events, and moments worth celebrating — shown as a scrollable row on the homepage. Leave this list empty to hide
              the section entirely.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHighlights([...highlights, emptyHighlight()])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Highlight
          </button>
        </div>

        {highlights.map((h, i) => (
          <div key={h.id} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Highlight {i + 1}</span>
              <button
                type="button"
                onClick={() => setHighlights(highlights.filter((x) => x.id !== h.id))}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className={labelClass}>Image</label>
              <ImageUpload value={h.image} onChange={(url) => updateHighlight(h.id, { image: url })} folder="highlights" />
            </div>

            <div>
              <label className={labelClass}>Title</label>
              <input className={inputClass} value={h.title} onChange={(e) => updateHighlight(h.id, { title: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                className={inputClass}
                value={h.description}
                onChange={(e) => updateHighlight(h.id, { description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Date Badge <span className="font-normal normal-case text-slate-400">(optional)</span></label>
                <input
                  className={inputClass}
                  placeholder="e.g. Term 2, 2026"
                  value={h.date}
                  onChange={(e) => updateHighlight(h.id, { date: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Button Text <span className="font-normal normal-case text-slate-400">(optional)</span></label>
                <input
                  className={inputClass}
                  placeholder="e.g. View Results"
                  value={h.linkText}
                  onChange={(e) => updateHighlight(h.id, { linkText: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Link <span className="font-normal normal-case text-slate-400">(optional — leave blank to hide the button)</span></label>
              <input
                className={inputClass}
                placeholder="/news/some-article or https://..."
                value={h.link}
                onChange={(e) => updateHighlight(h.id, { link: e.target.value })}
              />
            </div>
          </div>
        ))}

        {highlights.length === 0 && <p className="text-xs text-slate-400">No highlights yet — add one above.</p>}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && (
        <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          Saved — live on the public homepage.
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
