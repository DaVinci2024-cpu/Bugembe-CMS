"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { GalleryForm } from "@/components/admin/gallery/gallery-form";

export default function NewGalleryItemPage() {
  return (
    <ModuleGate permission="gallery">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">New Gallery Item</h2>
        <GalleryForm />
      </div>
    </ModuleGate>
  );
}
