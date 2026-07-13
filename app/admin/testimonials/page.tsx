"use client";

import { MessageSquare } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminTestimonialsPage() {
  return (
    <ModuleGate permission="testimonials">
      <ModulePlaceholder
        icon={MessageSquare}
        title="Testimonials"
        description="Manage parent, student and alumni testimonials shown across the public site."
      />
    </ModuleGate>
  );
}
