"use client";

import { Users } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminAlumniPage() {
  return (
    <ModuleGate permission="alumni">
      <ModulePlaceholder
        icon={Users}
        title="Alumni Directory"
        description="Review self-submitted alumni profiles (pending approval) and manage the public alumni directory."
      />
    </ModuleGate>
  );
}
