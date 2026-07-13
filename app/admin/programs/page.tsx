"use client";

import { BookOpen } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminProgramsPage() {
  return (
    <ModuleGate permission="programs">
      <ModulePlaceholder
        icon={BookOpen}
        title="Academic Programs"
        description="Manage nursery, primary, secondary, Islamic studies and boarding program listings."
      />
    </ModuleGate>
  );
}
