"use client";

import { ModuleGate } from "@/components/admin/module-gate";
import { NewsForm } from "@/components/admin/news/news-form";

export default function NewNewsArticlePage() {
  return (
    <ModuleGate permission="blogs">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">New Article</h2>
        <NewsForm />
      </div>
    </ModuleGate>
  );
}
