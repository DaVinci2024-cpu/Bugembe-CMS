"use client";

import { Image as ImageIcon } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export default function AdminGalleryPage() {
  return (
    <ModuleGate permission="gallery">
      <ModulePlaceholder
        icon={ImageIcon}
        title="Gallery"
        description="Upload and organize campus, academic, sports and events photos shown on the public gallery page."
      />
    </ModuleGate>
  );
}
