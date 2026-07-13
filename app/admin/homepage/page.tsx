"use client";

import { Home } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminHomepagePage() {
  return (
    <ModuleGate permission="homepage">
      <ModulePlaceholder
        icon={Home}
        title="Home & Site Settings"
        description="Edit the homepage hero content and trust statistics shown across the public site."
      />
    </ModuleGate>
  );
}
