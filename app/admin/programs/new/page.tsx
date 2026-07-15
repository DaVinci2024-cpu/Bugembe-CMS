"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { ProgramForm } from "@/components/admin/programs/program-form";

export default function NewProgramPage() {
  return (
    <ModuleGate permission="programs">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">New Program</h2>
        <ProgramForm />
      </div>
    </ModuleGate>
  );
}
