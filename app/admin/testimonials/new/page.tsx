"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <ModuleGate permission="testimonials">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">New Testimonial</h2>
        <TestimonialForm />
      </div>
    </ModuleGate>
  );
}
