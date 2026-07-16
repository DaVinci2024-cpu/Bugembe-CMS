import { programsRepository } from "@/lib/firebase/programsRepository";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { testimonialsRepository } from "@/lib/firebase/testimonialsRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { HomeContent } from "@/components/home/home-content";
import { heroContent, trustStatistics } from "@/lib/data";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export default async function HomePage() {
  const [programs, newsArticles, galleryItems, testimonials, hero, statistics] = await Promise.all([
    programsRepository.listPublished(),
    newsRepository.listPublished(),
    galleryRepository.listPublished(),
    testimonialsRepository.listPublished(),
    siteSettingsRepository.getHero(),
    siteSettingsRepository.getStatistics(),
  ]);

  return (
    <HomeContent
      programs={programs}
      newsArticles={newsArticles}
      galleryItems={galleryItems}
      testimonials={testimonials}
      hero={hero ?? heroContent}
      statistics={statistics ?? trustStatistics}
    />
  );
}
