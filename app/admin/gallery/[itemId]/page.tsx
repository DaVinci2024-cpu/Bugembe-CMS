"use client";

import { use, useEffect, useState } from "react";
import { ModuleGate } from "@/components/admin/module-gate";
import { GalleryForm } from "@/components/admin/gallery/gallery-form";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { GalleryItem } from "@/lib/data";

export default function EditGalleryItemPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    galleryRepository
      .get(itemId)
      .then((result) => {
        if (cancelled) return;
        if (!result) setNotFound(true);
        else setItem(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  return (
    <ModuleGate permission="gallery">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Edit Gallery Item</h2>
        {loading && <p className="text-xs text-slate-400">Loading item...</p>}
        {notFound && <p className="text-xs text-rose-600">Item not found.</p>}
        {item && <GalleryForm existing={item} />}
      </div>
    </ModuleGate>
  );
}
