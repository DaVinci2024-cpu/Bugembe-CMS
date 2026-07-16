"use client";

import { useEffect, useState } from "react";
import { FounderMessage, defaultFounderMessage } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { ImageUpload } from "@/components/admin/image-upload";
import { ICON_OPTIONS } from "@/lib/icon-options";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function FounderForm() {
  const [loading, setLoading] = useState(true);
  const [founder, setFounder] = useState<FounderMessage>(defaultFounderMessage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getFounderMessage().then((existing) => {
      setFounder(existing ?? defaultFounderMessage);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveFounderMessage(founder);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading founder&apos;s message...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Message from Our Founder</h3>
        <p className="text-xs text-slate-500">The founder spotlight section shown on the homepage, right after the &quot;Why Choose Us&quot; cards.</p>

        <div>
          <label className={labelClass}>Photo</label>
          <ImageUpload value={founder.photo} onChange={(url) => setFounder({ ...founder, photo: url })} folder="founder" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Section Icon</label>
            <select
              className={inputClass}
              value={founder.icon}
              onChange={(e) => setFounder({ ...founder, icon: e.target.value })}
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Seal / Badge Text</label>
            <input
              className={inputClass}
              placeholder="e.g. 50 YRS"
              value={founder.badgeText}
              onChange={(e) => setFounder({ ...founder, badgeText: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Eyebrow Label</label>
          <input
            className={inputClass}
            placeholder="e.g. The Spiritual Visionary"
            value={founder.eyebrow}
            onChange={(e) => setFounder({ ...founder, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Heading</label>
          <input
            className={inputClass}
            placeholder="e.g. A Message from Our Founder"
            value={founder.heading}
            onChange={(e) => setFounder({ ...founder, heading: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Message</label>
          <textarea
            rows={5}
            className={inputClass}
            value={founder.message}
            onChange={(e) => setFounder({ ...founder, message: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={founder.name} onChange={(e) => setFounder({ ...founder, name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              placeholder="e.g. Founder & First Principal (Est. 1974)"
              value={founder.title}
              onChange={(e) => setFounder({ ...founder, title: e.target.value })}
            />
          </div>
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
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
