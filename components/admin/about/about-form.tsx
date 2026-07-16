"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AboutContent, defaultAboutContent } from "@/lib/data";
import { aboutRepository } from "@/lib/firebase/aboutRepository";
import { ImageUpload } from "@/components/shared/image-upload";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function AboutForm() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    aboutRepository.get().then((existing) => {
      setContent(existing ?? defaultAboutContent);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await aboutRepository.save(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading About Us content...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* History */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Our History</h3>
        <div>
          <label className={labelClass}>History Image</label>
          <ImageUpload value={content.historyImage} onChange={(url) => setContent({ ...content, historyImage: url })} folder="about" />
        </div>
        <div>
          <label className={labelClass}>History Text</label>
          <textarea
            rows={5}
            className={inputClass}
            value={content.history}
            onChange={(e) => setContent({ ...content, history: e.target.value })}
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Mission & Vision</h3>
        <div>
          <label className={labelClass}>Mission</label>
          <textarea
            rows={3}
            className={inputClass}
            value={content.mission}
            onChange={(e) => setContent({ ...content, mission: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Vision</label>
          <textarea
            rows={3}
            className={inputClass}
            value={content.vision}
            onChange={(e) => setContent({ ...content, vision: e.target.value })}
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Core Values</h3>
          <button
            type="button"
            onClick={() => setContent({ ...content, coreValues: [...content.coreValues, { name: "", description: "" }] })}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Value
          </button>
        </div>
        {content.coreValues.map((val, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-2 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Value {i + 1}</span>
              <button
                type="button"
                onClick={() => setContent({ ...content, coreValues: content.coreValues.filter((_, idx) => idx !== i) })}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              className={inputClass}
              placeholder="Name, e.g. Taqwa (Faith & Consciousness)"
              value={val.name}
              onChange={(e) =>
                setContent({
                  ...content,
                  coreValues: content.coreValues.map((v, idx) => (idx === i ? { ...v, name: e.target.value } : v)),
                })
              }
            />
            <textarea
              rows={2}
              className={inputClass}
              placeholder="Description"
              value={val.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  coreValues: content.coreValues.map((v, idx) => (idx === i ? { ...v, description: e.target.value } : v)),
                })
              }
            />
          </div>
        ))}
      </div>

      {/* Leadership Message */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Leadership Message</h3>
        <div>
          <label className={labelClass}>Photo</label>
          <ImageUpload
            value={content.leadershipMessage.avatar}
            onChange={(url) => setContent({ ...content, leadershipMessage: { ...content.leadershipMessage, avatar: url } })}
            folder="about"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={content.leadershipMessage.author}
              onChange={(e) => setContent({ ...content, leadershipMessage: { ...content.leadershipMessage, author: e.target.value } })}
            />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              placeholder="e.g. Headteacher & Spiritual Guide"
              value={content.leadershipMessage.role}
              onChange={(e) => setContent({ ...content, leadershipMessage: { ...content.leadershipMessage, role: e.target.value } })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Quote</label>
          <textarea
            rows={4}
            className={inputClass}
            value={content.leadershipMessage.quote}
            onChange={(e) => setContent({ ...content, leadershipMessage: { ...content.leadershipMessage, quote: e.target.value } })}
          />
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Campus Facilities</h3>
          <button
            type="button"
            onClick={() => setContent({ ...content, facilities: [...content.facilities, { name: "", description: "" }] })}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Facility
          </button>
        </div>
        {content.facilities.map((fac, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-2 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Facility {i + 1}</span>
              <button
                type="button"
                onClick={() => setContent({ ...content, facilities: content.facilities.filter((_, idx) => idx !== i) })}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              className={inputClass}
              placeholder="Name, e.g. Al-Khwarizmi Science Wing"
              value={fac.name}
              onChange={(e) =>
                setContent({
                  ...content,
                  facilities: content.facilities.map((f, idx) => (idx === i ? { ...f, name: e.target.value } : f)),
                })
              }
            />
            <textarea
              rows={2}
              className={inputClass}
              placeholder="Description"
              value={fac.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  facilities: content.facilities.map((f, idx) => (idx === i ? { ...f, description: e.target.value } : f)),
                })
              }
            />
          </div>
        ))}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && (
        <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          Saved — live on the public About Us page.
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
