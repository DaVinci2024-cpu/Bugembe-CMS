import type { Metadata } from "next";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { siteSettingsRepository } from "@/lib/firebase/siteSettingsRepository";
import { heroContent } from "@/lib/data";
import { NewsBrowser } from "@/components/news/news-browser";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

const TITLE = "News & Announcements";
const DESCRIPTION = "Latest news, events, and announcements from Bugembe Islamic Institute in Jinja, Uganda.";

export async function generateMetadata(): Promise<Metadata> {
  const [articles, hero] = await Promise.all([newsRepository.listPublished(), siteSettingsRepository.getHero()]);
  const latest = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const image = latest?.image || hero?.bgImage || heroContent.bgImage;
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: { title: `${TITLE} | Bugembe Islamic Institute`, description: DESCRIPTION, images: [{ url: image }] },
    twitter: { images: [image] },
  };
}

export default async function NewsPage() {
  const articles = await newsRepository.listPublished();
  return <NewsBrowser articles={articles} />;
}
