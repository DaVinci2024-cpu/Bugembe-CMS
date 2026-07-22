import type { Metadata } from "next";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { heroContent } from "@/lib/data";
import { AcademicsContent } from "@/components/academics/academics-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

const TITLE = "Academic Programs";
const DESCRIPTION =
  "Explore Bugembe Islamic Institute's academic programs — from Nursery through A-Level, plus Hifz and Islamic theology pathways in Jinja, Uganda.";

export async function generateMetadata(): Promise<Metadata> {
  const [programs, hero] = await Promise.all([programsRepository.listPublished(), siteSettingsRepository.getHero()]);
  const image = programs[0]?.image || hero?.bgImage || heroContent.bgImage;
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: { title: `${TITLE} | Bugembe Islamic Institute`, description: DESCRIPTION, images: [{ url: image }] },
    twitter: { images: [image] },
  };
}

export default async function AcademicsPage() {
  const programs = await programsRepository.listPublished();
  return <AcademicsContent programs={programs} />;
}
