import type { Metadata } from "next";
import { admissionsRepository } from "@/lib/firebase/admissionsRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { admissionsDetails, defaultContactInfo, heroContent } from "@/lib/data";
import { AdmissionsPageContent } from "@/components/admissions/admissions-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

const TITLE = "Admissions";
const DESCRIPTION =
  "Admission process, requirements, and fees for Bugembe Islamic Institute — Nursery through A-Level, boarding and day school options in Jinja, Uganda.";

// Admissions has no dedicated photo of its own, so this borrows the campus
// hero image rather than falling back to the small square logo — a real
// photo of campus reads much better as a share-link preview.
export async function generateMetadata(): Promise<Metadata> {
  const hero = await siteSettingsRepository.getHero();
  const image = hero?.bgImage || heroContent.bgImage;
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: { title: `${TITLE} | Bugembe Islamic Institute`, description: DESCRIPTION, images: [{ url: image }] },
    twitter: { images: [image] },
  };
}

export default async function AdmissionsPage() {
  // Fall back to the static defaults if the admin hasn't saved anything to
  // Firestore yet, so this page is never blank before first use.
  const [content, contact] = await Promise.all([
    admissionsRepository.get().then((c) => c ?? admissionsDetails),
    siteSettingsRepository.getContact().then((c) => c ?? defaultContactInfo),
  ]);
  return <AdmissionsPageContent content={content} contact={contact} />;
}
