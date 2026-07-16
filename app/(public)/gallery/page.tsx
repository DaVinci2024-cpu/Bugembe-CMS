import type { Metadata } from "next";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { GalleryContent } from "@/components/gallery/gallery-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from campus life, events, and academic activities at Bugembe Islamic Institute in Jinja, Uganda.",
  openGraph: {
    title: "Gallery | Bugembe Islamic Institute",
    description: "Photos from campus life, events, and academic activities at Bugembe Islamic Institute in Jinja, Uganda.",
  },
};

export default async function GalleryPage() {
  const items = await galleryRepository.listPublished();
  return <GalleryContent items={items} />;
}
