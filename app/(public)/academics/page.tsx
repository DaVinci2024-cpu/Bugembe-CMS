import { programsRepository } from "@/lib/firebase/programsRepository";
import { AcademicsContent } from "@/components/academics/academics-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export default async function AcademicsPage() {
  const programs = await programsRepository.listPublished();
  return <AcademicsContent programs={programs} />;
}
