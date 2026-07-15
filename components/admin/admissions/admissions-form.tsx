"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdmissionsContent, admissionsDetails } from "@/lib/data";
import { admissionsRepository } from "@/lib/firebase/admissionsRepository";

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

interface ProcessStep {
  title: string;
  description: string;
}
interface Faq {
  question: string;
  answer: string;
}

export function AdmissionsForm() {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [generalRequirements, setGeneralRequirements] = useState("");
  const [boardingList, setBoardingList] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    admissionsRepository.get().then((existing) => {
      const content = existing ?? admissionsDetails;
      setSteps(content.process.map((p) => ({ title: p.title, description: p.description })));
      setGeneralRequirements(content.requirements.general.join("\n"));
      setBoardingList(content.requirements.boardingList.join("\n"));
      setFaqs(content.faqs);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const content: AdmissionsContent = {
        process: steps.map((s, i) => ({ step: i + 1, title: s.title, description: s.description })),
        requirements: {
          general: linesToList(generalRequirements),
          boardingList: linesToList(boardingList),
        },
        faqs,
      };
      await admissionsRepository.save(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400">Loading admissions content...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Process Steps */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Admission Process Steps</h3>
          <button
            type="button"
            onClick={() => setSteps([...steps, { title: "", description: "" }])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Step
          </button>
        </div>
        {steps.map((step, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-2 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Step {i + 1}</span>
              <button
                type="button"
                onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              className={inputClass}
              placeholder="Step title"
              value={step.title}
              onChange={(e) => setSteps(steps.map((s, idx) => (idx === i ? { ...s, title: e.target.value } : s)))}
            />
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Step description"
              value={step.description}
              onChange={(e) => setSteps(steps.map((s, idx) => (idx === i ? { ...s, description: e.target.value } : s)))}
            />
          </div>
        ))}
      </div>

      {/* Requirements */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Requirements</h3>
        <div>
          <label className={labelClass}>General Requirements <span className="font-normal normal-case text-slate-400">(one per line)</span></label>
          <textarea
            rows={5}
            className={inputClass}
            value={generalRequirements}
            onChange={(e) => setGeneralRequirements(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Boarding Checklist <span className="font-normal normal-case text-slate-400">(one per line)</span></label>
          <textarea rows={6} className={inputClass} value={boardingList} onChange={(e) => setBoardingList(e.target.value)} />
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
          <button
            type="button"
            onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add FAQ
          </button>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-2 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">FAQ {i + 1}</span>
              <button
                type="button"
                onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              className={inputClass}
              placeholder="Question"
              value={faq.question}
              onChange={(e) => setFaqs(faqs.map((f, idx) => (idx === i ? { ...f, question: e.target.value } : f)))}
            />
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => setFaqs(faqs.map((f, idx) => (idx === i ? { ...f, answer: e.target.value } : f)))}
            />
          </div>
        ))}
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
      {saved && <div className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">Saved — changes are live on the public Admissions page.</div>}

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
