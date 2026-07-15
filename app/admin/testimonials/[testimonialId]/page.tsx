"use client";

import { use, useEffect, useState } from "react";
import { ModuleGate } from "@/components/admin/module-gate";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { testimonialsRepository } from "@/lib/firebase/testimonialsRepository";
import { Testimonial } from "@/lib/data";

export default function EditTestimonialPage({ params }: { params: Promise<{ testimonialId: string }> }) {
  const { testimonialId } = use(params);
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    testimonialsRepository
      .get(testimonialId)
      .then((result) => {
        if (cancelled) return;
        if (!result) setNotFound(true);
        else setTestimonial(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [testimonialId]);

  return (
    <ModuleGate permission="testimonials">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Edit Testimonial</h2>
        {loading && <p className="text-xs text-slate-400">Loading testimonial...</p>}
        {notFound && <p className="text-xs text-rose-600">Testimonial not found.</p>}
        {testimonial && <TestimonialForm existing={testimonial} />}
      </div>
    </ModuleGate>
  );
}
