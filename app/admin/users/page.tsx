"use client";

import { Users } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminUsersPage() {
  return (
    <ModuleGate permission="users">
      <ModulePlaceholder
        icon={Users}
        title="User Permissions"
        description="Approve pending sign-ins, assign per-module permissions, suspend or revoke access, and review the audit log."
      />
    </ModuleGate>
  );
}
