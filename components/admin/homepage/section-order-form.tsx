"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { HomeSectionKey, HOME_SECTION_LABELS, defaultSectionOrder, resolveHomeSectionOrder } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";

const SECTION_DESCRIPTIONS: Record<HomeSectionKey, string> = {
  statistics: "Enrolled students, pass rate, and other trust numbers",
  highlights: "Scrollable row of results, events, and announcements",
  advantages: "Why-choose-us cards (academics, boarding, Hifz, etc.)",
  founder: "Photo and quoted message from the founder",
  alumni: "Scrolling carousel of featured alumni",
  programs: "Academic program cards (Nursery through A-Level)",
  gallery: "Preview grid from the campus photo gallery",
  achievements: "Timeline of UNEB results and milestones",
  testimonials: "Parent, student, and alumni quotes",
  news: "Latest three published news articles",
};

export function SectionOrderForm() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<HomeSectionKey[]>(defaultSectionOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getSectionOrder().then((existing) => {
      setOrder(resolveHomeSectionOrder(existing));
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveSectionOrder(order);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  };

  if (loading) return <p className="text-xs text-slate-400">Loading section order...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Homepage Section Order</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Decide which content block appears first on the homepage. The hero banner always stays at the top and the admissions
            call-to-action always stays at the bottom — everything in between can be reordered.
          </p>
        </div>

        <div className="space-y-2">
          {order.map((key, i) => (
            <div
              key={key}
              className="flex items-center gap-3 border border-slate-100 rounded-lg p-3 bg-slate-50/50"
            >
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="w-6 text-center text-xs font-mono font-bold text-slate-400 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900">{HOME_SECTION_LABELS[key]}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{SECTION_DESCRIPTIONS[key]}</p>
              </div>
              <div className="flex flex-col shrink-0">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                  aria-label={`Move ${HOME_SECTION_LABELS[key]} up`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                  aria-label={`Move ${HOME_SECTION_LABELS[key]} down`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
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
        {saving ? "Saving..." : "Save Order"}
      </button>
    </form>
  );
}
