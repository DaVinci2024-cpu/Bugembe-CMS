"use client";

import { use, useEffect, useState } from "react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ProgramForm } from "@/components/admin/programs/program-form";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { Program } from "@/lib/data";

export default function EditProgramPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = use(params);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    programsRepository
      .get(programId)
      .then((result) => {
        if (cancelled) return;
        if (!result) setNotFound(true);
        else setProgram(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [programId]);

  return (
    <ModuleGate permission="programs">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Edit Program</h2>
        {loading && <p className="text-xs text-slate-400">Loading program...</p>}
        {notFound && <p className="text-xs text-rose-600">Program not found.</p>}
        {program && <ProgramForm existing={program} />}
      </div>
    </ModuleGate>
  );
}
