"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Advantage, defaultAdvantages } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { ICON_OPTIONS, CARD_COLOR_OPTIONS } from "@/lib/icon-options";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function emptyAdvantage(): Advantage {
  return { id: `adv-${Date.now().toString(36)}`, title: "", description: "", details: [], icon: "Award", color: "indigo" };
}

export function AdvantagesForm() {
  const [loading, setLoading] = useState(true);
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getAdvantages().then((existing) => {
      setAdvantages(existing ?? defaultAdvantages);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveAdvantages(advantages);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading Why Choose Us cards...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">&quot;Why Choose Us&quot; Cards</h3>
            <p className="text-xs text-slate-500 mt-0.5">The homepage advantage grid, with expandable key-offering details.</p>
          </div>
          <button
            type="button"
            onClick={() => setAdvantages([...advantages, emptyAdvantage()])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Card
          </button>
        </div>

        {advantages.map((adv, i) => (
          <div key={adv.id} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Card {i + 1}</span>
              <button
                type="button"
                onClick={() => setAdvantages(advantages.filter((_, idx) => idx !== i))}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={adv.title}
                onChange={(e) => setAdvantages(advantages.map((a, idx) => (idx === i ? { ...a, title: e.target.value } : a)))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Icon</label>
                <select
                  className={inputClass}
                  value={adv.icon}
                  onChange={(e) => setAdvantages(advantages.map((a, idx) => (idx === i ? { ...a, icon: e.target.value } : a)))}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Accent Color</label>
                <select
                  className={inputClass}
                  value={adv.color}
                  onChange={(e) => setAdvantages(advantages.map((a, idx) => (idx === i ? { ...a, color: e.target.value } : a)))}
                >
                  {CARD_COLOR_OPTIONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                className={inputClass}
                value={adv.description}
                onChange={(e) => setAdvantages(advantages.map((a, idx) => (idx === i ? { ...a, description: e.target.value } : a)))}
              />
            </div>
            <div>
              <label className={labelClass}>Key Offerings <span className="font-normal normal-case text-slate-400">(one per line)</span></label>
              <textarea
                rows={4}
                className={inputClass}
                value={adv.details.join("\n")}
                onChange={(e) =>
                  setAdvantages(advantages.map((a, idx) => (idx === i ? { ...a, details: linesToList(e.target.value) } : a)))
                }
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
