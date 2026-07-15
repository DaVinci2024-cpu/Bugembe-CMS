"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { testimonialsRepository } from "@/lib/firebase/testimonialsRepository";
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid";
import { Testimonial } from "@/lib/data";

function PreviewContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialsRepository.list().then((result) => {
      setTestimonials(result);
      setLoading(false);
    });
  }, []);

  const draftCount = testimonials.filter((t) => t.status === "draft").length;

  if (loading) return <p className="text-xs text-slate-400 p-6">Loading preview...</p>;

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#0c2340] text-white">
        <Eye className="w-3.5 h-3.5" />
        Preview — shows all {testimonials.length} testimonials, including {draftCount} draft{draftCount === 1 ? "" : "s"} not visible to
        the public
      </div>
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fcfbf9] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <TestimonialsGrid testimonials={testimonials} />
        </div>
      </div>
    </div>
  );
}

export default function AdminTestimonialsPreviewPage() {
  return (
    <ModuleGate permission="testimonials">
      <PreviewContent />
    </ModuleGate>
  );
}
