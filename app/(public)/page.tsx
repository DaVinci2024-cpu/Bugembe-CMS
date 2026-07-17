import { programsRepository } from "@/lib/firebase/programsRepository";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { testimonialsRepository } from "@/lib/firebase/testimonialsRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { HomeContent } from "@/components/home/home-content";
import {
  heroContent,
  trustStatistics,
  defaultAdvantages,
  premiumAchievements,
  defaultBranding,
  defaultFounderMessage,
  defaultHighlights,
  resolveHomeSectionOrder,
  defaultContactInfo,
} from "@/lib/data";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export default async function HomePage() {
  const [
    programs,
    newsArticles,
    galleryItems,
    testimonials,
    hero,
    statistics,
    advantages,
    achievements,
    branding,
    founder,
    alumni,
    highlights,
    sectionOrder,
    contact,
  ] = await Promise.all([
    programsRepository.listPublished(),
    newsRepository.listPublished(),
    galleryRepository.listPublished(),
    testimonialsRepository.listPublished(),
    siteSettingsRepository.getHero(),
    siteSettingsRepository.getStatistics(),
    siteSettingsRepository.getAdvantages(),
    siteSettingsRepository.getAchievements(),
    siteSettingsRepository.getBranding(),
    siteSettingsRepository.getFounderMessage(),
    alumniRepository.list(),
    siteSettingsRepository.getHighlights(),
    siteSettingsRepository.getSectionOrder(),
    siteSettingsRepository.getContact(),
  ]);

  // Cap at 5 — this is a small homepage highlight reel, not the full
  // directory (that's what the "View All Alumni" link on this section is
  // for). Most recent cohort first, matching the Alumni directory page.
  const featuredAlumni = alumni
    .filter((a) => a.featured && a.status === "approved")
    .sort((a, b) => b.graduationYear - a.graduationYear)
    .slice(0, 5);

  return (
    <HomeContent
      programs={programs}
      newsArticles={newsArticles}
      galleryItems={galleryItems}
      testimonials={testimonials}
      hero={hero ?? heroContent}
      statistics={statistics ?? trustStatistics}
      advantages={advantages ?? defaultAdvantages}
      achievements={achievements ?? premiumAchievements}
      branding={branding ?? defaultBranding}
      founder={founder ?? defaultFounderMessage}
      featuredAlumni={featuredAlumni}
      highlights={highlights ?? defaultHighlights}
      sectionOrder={resolveHomeSectionOrder(sectionOrder)}
      contact={contact ?? defaultContactInfo}
    />
  );
}
