"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { HomepageForm } from "@/components/admin/homepage/homepage-form";

export default function AdminHomepagePage() {
  return (
    <ModuleGate permission="homepage">
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Home & Site Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Edit the homepage hero content and trust statistics shown across the public site. Changes save directly — there&apos;s no
            draft mode for this page.
          </p>
        </div>
        <HomepageForm />
      </div>
    </ModuleGate>
  );
}
