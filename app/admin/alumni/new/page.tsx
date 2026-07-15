"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { AlumniForm } from "@/components/admin/alumni/alumni-form";

export default function NewAlumniPage() {
  return (
    <ModuleGate permission="alumni">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">New Alumni Profile</h2>
        <AlumniForm />
      </div>
    </ModuleGate>
  );
}
