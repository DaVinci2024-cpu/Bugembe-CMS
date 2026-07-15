import { admissionsRepository } from "@/lib/firebase/admissionsRepository";
import { admissionsDetails } from "@/lib/data";
import { AdmissionsPageContent } from "@/components/admissions/admissions-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export default async function AdmissionsPage() {
  // Fall back to the static defaults if the admin hasn't saved anything to
  // Firestore yet, so this page is never blank before first use.
  const content = (await admissionsRepository.get()) ?? admissionsDetails;
  return <AdmissionsPageContent content={content} />;
}
