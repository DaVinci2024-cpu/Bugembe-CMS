"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { AdmissionsForm } from "@/components/admin/admissions/admissions-form";

export default function AdminAdmissionsPage() {
  return (
    <ModuleGate permission="admissions">
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Admissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Edit the process steps, requirements, and FAQs shown on the public Admissions page. Changes save directly — there&apos;s no
            draft mode for this page.
          </p>
        </div>
        <AdmissionsForm />
      </div>
    </ModuleGate>
  );
}
