import type { Metadata } from "next";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { AcademicsContent } from "@/components/academics/academics-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Academic Programs",
  description:
    "Explore Bugembe Islamic Institute's academic programs — from Nursery through A-Level, plus Hifz and Islamic theology pathways in Jinja, Uganda.",
  openGraph: {
    title: "Academic Programs | Bugembe Islamic Institute",
    description:
      "Explore Bugembe Islamic Institute's academic programs — from Nursery through A-Level, plus Hifz and Islamic theology pathways in Jinja, Uganda.",
  },
};

export default async function AcademicsPage() {
  const programs = await programsRepository.listPublished();
  return <AcademicsContent programs={programs} />;
}
