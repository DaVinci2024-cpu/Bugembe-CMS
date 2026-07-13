"use client";

import { FileText } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminNewsPage() {
  return (
    <ModuleGate permission="blogs">
      <ModulePlaceholder
        icon={FileText}
        title="News & Announcements"
        description="Full create/edit/delete for news articles, wired to Firestore, is the next module to be built."
      />
    </ModuleGate>
  );
}
