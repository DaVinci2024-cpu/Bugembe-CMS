import type { Metadata } from "next";
import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { AlumniPageContent } from "@/components/alumni/alumni-content";
import { defaultAlumniSpotlight, defaultCommunityGroups } from "@/lib/data";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
// New self-submissions still show up immediately for the submitter via an
// optimistic client-side update; this cache just affects other visitors.
export const revalidate = 3600;

const TITLE = "Alumni Network";
const DESCRIPTION =
  "Reconnect with the Bugembe Islamic Institute alumni community — browse the graduate directory and join the official alumni network.";

export async function generateMetadata(): Promise<Metadata> {
  const spotlight = await siteSettingsRepository.getAlumniSpotlight();
  const image = spotlight?.photo || defaultAlumniSpotlight.photo;
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: { title: `${TITLE} | Bugembe Islamic Institute`, description: DESCRIPTION, images: [{ url: image }] },
    twitter: { images: [image] },
  };
}

export default async function AlumniPage() {
  const [alumni, spotlight, communityGroups] = await Promise.all([
    alumniRepository.list(),
    siteSettingsRepository.getAlumniSpotlight(),
    siteSettingsRepository.getCommunityGroups(),
  ]);

  return (
    <AlumniPageContent
      initialAlumni={alumni}
      spotlight={spotlight ?? defaultAlumniSpotlight}
      communityGroups={communityGroups ?? defaultCommunityGroups}
    />
  );
}
