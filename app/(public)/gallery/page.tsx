import type { Metadata } from "next";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { heroContent } from "@/lib/data";
import { GalleryContent } from "@/components/gallery/gallery-content";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

const TITLE = "Gallery";
const DESCRIPTION = "Photos from campus life, events, and academic activities at Bugembe Islamic Institute in Jinja, Uganda.";

export async function generateMetadata(): Promise<Metadata> {
  const [items, hero] = await Promise.all([galleryRepository.listPublished(), siteSettingsRepository.getHero()]);
  const image = items[0]?.image || hero?.bgImage || heroContent.bgImage;
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: { title: `${TITLE} | Bugembe Islamic Institute`, description: DESCRIPTION, images: [{ url: image }] },
    twitter: { images: [image] },
  };
}

export default async function GalleryPage() {
  const items = await galleryRepository.listPublished();
  return <GalleryContent items={items} />;
}
