"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, UploadCloud, Eye } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { academicPrograms as staticPrograms, Program } from "@/lib/data";

function ProgramsList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const result = await programsRepository.list();
      setPrograms(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await programsRepository.remove(id);
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to delete program.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      for (const { id, ...fields } of staticPrograms) {
        await programsRepository.create(id, fields);
      }
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to import the sample programs.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Academic Programs</h2>
          <p className="text-xs text-slate-500 mt-0.5">Programs shown on the public Academics page.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/programs/preview"
            target="_blank"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview All
          </Link>
          <Link
            href="/admin/programs/new"
            className="px-4 py-2 bg-[#0c2340] hover:bg-[#0b1c3c] text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Program
          </Link>
        </div>
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <p className="text-xs text-slate-500">No programs yet.</p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 mx-auto cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {seeding ? "Importing..." : "Import the 5 existing sample programs"}
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-500 text-[10.5px]">
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Level</th>
                <th className="p-3"></th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{program.title}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        program.status === "published"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}
                    >
                      {program.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{program.level}</td>
                  <td className="p-3">
                    {program.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/programs/${program.id}`}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(program.id, program.title)}
                        className="p-1.5 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminProgramsPage() {
  return (
    <ModuleGate permission="programs">
      <ProgramsList />
    </ModuleGate>
  );
}
