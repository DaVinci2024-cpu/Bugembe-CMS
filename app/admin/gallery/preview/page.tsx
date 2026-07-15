"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { GalleryContent } from "@/components/gallery/gallery-content";
import { GalleryItem } from "@/lib/data";

function PreviewContent() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryRepository.list().then((result) => {
      setItems(result);
      setLoading(false);
    });
  }, []);

  const draftCount = items.filter((i) => i.status === "draft").length;

  if (loading) return <p className="text-xs text-slate-400 p-6">Loading preview...</p>;

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#0c2340] text-white">
        <Eye className="w-3.5 h-3.5" />
        Preview — shows all {items.length} items, including {draftCount} draft{draftCount === 1 ? "" : "s"} not visible to the public
      </div>
      <GalleryContent items={items} />
    </div>
  );
}

export default function AdminGalleryPreviewPage() {
  return (
    <ModuleGate permission="gallery">
      <PreviewContent />
    </ModuleGate>
  );
}
