"use client";

import { GraduationCap } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminAdmissionsPage() {
  return (
    <ModuleGate permission="admissions">
      <ModulePlaceholder
        icon={GraduationCap}
        title="Admissions"
        description="Edit the admissions process steps, document requirements and FAQs shown on the public admissions page."
      />
    </ModuleGate>
  );
}
