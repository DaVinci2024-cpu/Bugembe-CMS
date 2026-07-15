"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { AcademicsContent } from "@/components/academics/academics-content";
import { Program } from "@/lib/data";

function PreviewContent() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    programsRepository.list().then((result) => {
      setPrograms(result);
      setLoading(false);
    });
  }, []);

  const draftCount = programs.filter((p) => p.status === "draft").length;

  if (loading) return <p className="text-xs text-slate-400 p-6">Loading preview...</p>;

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#0c2340] text-white">
        <Eye className="w-3.5 h-3.5" />
        Preview — shows all {programs.length} programs, including {draftCount} draft{draftCount === 1 ? "" : "s"} not visible to the public
      </div>
      <AcademicsContent programs={programs} />
    </div>
  );
}

export default function AdminProgramsPreviewPage() {
  return (
    <ModuleGate permission="programs">
      <PreviewContent />
    </ModuleGate>
  );
}
