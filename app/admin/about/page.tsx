"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { AboutForm } from "@/components/admin/about/about-form";

export default function AdminAboutPage() {
  return (
    <ModuleGate permission="about">
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">About Us Page</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Edit the history, mission, vision, core values, leadership message, and campus facilities shown on the public About Us
            page. Changes save directly — there&apos;s no draft mode for this page.
          </p>
        </div>
        <AboutForm />
      </div>
    </ModuleGate>
  );
}
