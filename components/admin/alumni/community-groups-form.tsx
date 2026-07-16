"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CommunityGroup, defaultCommunityGroups } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

const CATEGORIES: CommunityGroup["category"][] = ["General", "Class Year", "Career", "Interests"];

function emptyGroup(): CommunityGroup {
  return {
    id: `comm-${Date.now().toString(36)}`,
    name: "",
    description: "",
    category: "General",
    whatsappLink: "",
    memberCountPlaceholder: "",
    targetCriteria: {},
  };
}

export function CommunityGroupsForm() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getCommunityGroups().then((existing) => {
      setGroups(existing ?? defaultCommunityGroups);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveCommunityGroups(groups);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const updateGroup = (id: string, updates: Partial<CommunityGroup>) => {
    setGroups(groups.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const updateCriteria = (id: string, updates: Partial<CommunityGroup["targetCriteria"]>) => {
    setGroups(groups.map((g) => (g.id === id ? { ...g, targetCriteria: { ...g.targetCriteria, ...updates } } : g)));
  };

  if (loading) return <p className="text-xs text-slate-400">Loading community groups...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Community Groups</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The WhatsApp networks recommended to alumni after they register — matched by graduation year or profession.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGroups([...groups, emptyGroup()])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Group
          </button>
        </div>

        {groups.map((group, i) => (
          <div key={group.id} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Group {i + 1}</span>
              <button
                type="button"
                onClick={() => setGroups(groups.filter((g) => g.id !== group.id))}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={group.name} onChange={(e) => updateGroup(group.id, { name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                className={inputClass}
                value={group.description}
                onChange={(e) => updateGroup(group.id, { description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  className={inputClass}
                  value={group.category}
                  onChange={(e) => updateGroup(group.id, { category: e.target.value as CommunityGroup["category"] })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Member Count</label>
                <input
                  className={inputClass}
                  placeholder="e.g. 850+ members"
                  value={group.memberCountPlaceholder}
                  onChange={(e) => updateGroup(group.id, { memberCountPlaceholder: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Match Year</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Optional"
                  value={group.targetCriteria.graduationYear ?? ""}
                  onChange={(e) =>
                    updateCriteria(group.id, { graduationYear: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Match Profession</label>
                <input
                  className={inputClass}
                  placeholder="Optional"
                  value={group.targetCriteria.profession ?? ""}
                  onChange={(e) => updateCriteria(group.id, { profession: e.target.value || undefined })}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>WhatsApp Invite Link</label>
              <input
                className={inputClass}
                placeholder="https://chat.whatsapp.com/..."
                value={group.whatsappLink}
                onChange={(e) => updateGroup(group.id, { whatsappLink: e.target.value })}
              />
            </div>
          </div>
        ))}

        {groups.length === 0 && <p className="text-xs text-slate-400">No groups yet — add one above.</p>}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && (
        <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          Saved — live on the public Alumni page.
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
