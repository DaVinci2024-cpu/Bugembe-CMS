"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ContactInfo, defaultContactInfo } from "@/lib/data";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function ContactForm() {
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<ContactInfo>(defaultContactInfo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteSettingsRepository.getContact().then((existing) => {
      setContact(existing ?? defaultContactInfo);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await siteSettingsRepository.saveContact({
        ...contact,
        quickContacts: contact.quickContacts.filter((c) => c.label.trim() || c.phone.trim()),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading contact info...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Main Contact Details</h3>
        <p className="text-xs text-slate-500">Shared between the footer and the Contact Us page.</p>

        <div>
          <label className={labelClass}>Address</label>
          <input className={inputClass} value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number <span className="font-normal normal-case text-slate-400">(digits only, e.g. 256701000000)</span></label>
            <input
              className={inputClass}
              value={contact.whatsappNumber}
              onChange={(e) => setContact({ ...contact, whatsappNumber: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input
              className={inputClass}
              value={contact.facebookUrl}
              onChange={(e) => setContact({ ...contact, facebookUrl: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Office Hours</label>
          <input
            className={inputClass}
            value={contact.officeHours}
            onChange={(e) => setContact({ ...contact, officeHours: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department Quick Contacts</h3>
            <p className="text-xs text-slate-500 mt-0.5">Shown on the Contact Us page (e.g. Admissions Desk, Registrar Office).</p>
          </div>
          <button
            type="button"
            onClick={() => setContact({ ...contact, quickContacts: [...contact.quickContacts, { label: "", phone: "" }] })}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Contact
          </button>
        </div>

        {contact.quickContacts.map((qc, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputClass}
              placeholder="Label, e.g. Admissions Desk"
              value={qc.label}
              onChange={(e) =>
                setContact({
                  ...contact,
                  quickContacts: contact.quickContacts.map((c, idx) => (idx === i ? { ...c, label: e.target.value } : c)),
                })
              }
            />
            <input
              className={inputClass}
              placeholder="+256 701 000 111"
              value={qc.phone}
              onChange={(e) =>
                setContact({
                  ...contact,
                  quickContacts: contact.quickContacts.map((c, idx) => (idx === i ? { ...c, phone: e.target.value } : c)),
                })
              }
            />
            <button
              type="button"
              onClick={() => setContact({ ...contact, quickContacts: contact.quickContacts.filter((_, idx) => idx !== i) })}
              className="p-2 rounded hover:bg-rose-50 text-rose-500 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && (
        <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          Saved — live in the footer and Contact Us page.
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
