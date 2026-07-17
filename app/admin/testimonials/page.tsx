"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, UploadCloud, Eye, Star } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { testimonialsRepository } from "@/lib/firebase/testimonialsRepository";
import { parentStudentTestimonials as staticTestimonials, Testimonial } from "@/lib/data";

function TestimonialsList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const result = await testimonialsRepository.list();
      setTestimonials(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete testimonial from "${name}"? This cannot be undone.`)) return;
    try {
      await testimonialsRepository.remove(id);
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to delete testimonial.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      for (const { id, ...fields } of staticTestimonials) {
        await testimonialsRepository.create(id, fields);
      }
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to import the sample testimonials.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Testimonials</h2>
          <p className="text-xs text-slate-500 mt-0.5">Shown in the &quot;What Our Community Says&quot; section on the homepage.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/testimonials/preview"
            target="_blank"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview All
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="px-4 py-2 bg-[#0c2340] hover:bg-[#0b1c3c] text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Testimonial
          </Link>
        </div>
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <p className="text-xs text-slate-500">No testimonials yet.</p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 mx-auto cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {seeding ? "Importing..." : "Import the 3 existing sample testimonials"}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-500 text-[10.5px]">
                <th className="p-3">Photo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Role</th>
                <th className="p-3">Rating</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      <Image src={t.avatar} alt="" fill className="object-cover" unoptimized />
                    </div>
                  </td>
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{t.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        t.status === "published"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{t.role}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/testimonials/${t.id}`}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(t.id, t.name)}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTestimonialsPage() {
  return (
    <ModuleGate permission="testimonials">
      <TestimonialsList />
    </ModuleGate>
  );
}
