import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { GalleryContent } from "@/components/gallery/gallery-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export default async function GalleryPage() {
  const items = await galleryRepository.listPublished();
  return <GalleryContent items={items} />;
}
