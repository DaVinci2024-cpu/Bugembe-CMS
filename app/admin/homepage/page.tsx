"use client";

import { useState } from "react";
import { ModuleGate } from "@/components/admin/module-gate";
import { HomepageForm } from "@/components/admin/homepage/homepage-form";
import { BrandingForm } from "@/components/admin/homepage/branding-form";
import { HeaderForm } from "@/components/admin/homepage/header-form";
import { ContactForm } from "@/components/admin/homepage/contact-form";
import { WhatsAppDepartmentsForm } from "@/components/admin/homepage/whatsapp-departments-form";
import { AdvantagesForm } from "@/components/admin/homepage/advantages-form";
import { AchievementsForm } from "@/components/admin/homepage/achievements-form";
import { FounderForm } from "@/components/admin/homepage/founder-form";
import { HighlightsForm } from "@/components/admin/homepage/highlights-form";
import { SectionOrderForm } from "@/components/admin/homepage/section-order-form";

const TABS = [
  { id: "hero", label: "Hero & Statistics" },
  { id: "branding", label: "Branding" },
  { id: "header", label: "Header Ticker" },
  { id: "contact", label: "Contact & Footer" },
  { id: "whatsapp", label: "WhatsApp Desks" },
  { id: "advantages", label: "Why Choose Us" },
  { id: "founder", label: "Founder's Message" },
  { id: "achievements", label: "Achievements" },
  { id: "highlights", label: "Highlights" },
  { id: "sectionOrder", label: "Section Order" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminHomepageContent() {
  const [tab, setTab] = useState<TabId>("hero");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Home & Site Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit everything shown site-wide — logo, header, hero, contact info, and the homepage content blocks. Changes save directly —
          there&apos;s no draft mode for these pages.
        </p>
      </div>

      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer ${
              tab === t.id ? "border-[#0c2340] text-[#0c2340]" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "hero" && <HomepageForm />}
      {tab === "branding" && <BrandingForm />}
      {tab === "header" && <HeaderForm />}
      {tab === "contact" && <ContactForm />}
      {tab === "whatsapp" && <WhatsAppDepartmentsForm />}
      {tab === "advantages" && <AdvantagesForm />}
      {tab === "founder" && <FounderForm />}
      {tab === "achievements" && <AchievementsForm />}
      {tab === "highlights" && <HighlightsForm />}
      {tab === "sectionOrder" && <SectionOrderForm />}
    </div>
  );
}

export default function AdminHomepagePage() {
  return (
    <ModuleGate permission="homepage">
      <AdminHomepageContent />
    </ModuleGate>
  );
}
