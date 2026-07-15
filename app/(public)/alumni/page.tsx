import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { AlumniPageContent } from "@/components/alumni/alumni-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
// New self-submissions still show up immediately for the submitter via an
// optimistic client-side update; this cache just affects other visitors.
export const revalidate = 3600;

export default async function AlumniPage() {
  const alumni = await alumniRepository.list();
  return <AlumniPageContent initialAlumni={alumni} />;
}
