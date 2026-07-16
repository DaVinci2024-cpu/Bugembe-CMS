import type { Metadata } from "next";
import { admissionsRepository } from "@/lib/firebase/admissionsRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { admissionsDetails, defaultContactInfo } from "@/lib/data";
import { AdmissionsPageContent } from "@/components/admissions/admissions-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admission process, requirements, and fees for Bugembe Islamic Institute — Nursery through A-Level, boarding and day school options in Jinja, Uganda.",
  openGraph: {
    title: "Admissions | Bugembe Islamic Institute",
    description:
      "Admission process, requirements, and fees for Bugembe Islamic Institute — Nursery through A-Level, boarding and day school options in Jinja, Uganda.",
  },
};

export default async function AdmissionsPage() {
  // Fall back to the static defaults if the admin hasn't saved anything to
  // Firestore yet, so this page is never blank before first use.
  const [content, contact] = await Promise.all([
    admissionsRepository.get().then((c) => c ?? admissionsDetails),
    siteSettingsRepository.getContact().then((c) => c ?? defaultContactInfo),
  ]);
  return <AdmissionsPageContent content={content} contact={contact} />;
}
