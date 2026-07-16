import type { MetadataRoute } from "next";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { SITE_URL } from "@/lib/site-url";

// Regenerated at most once an hour (same cadence as the pages themselves),
// so newly published articles show up in the sitemap without a full rebuild.
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/academics", changeFrequency: "monthly", priority: 0.8 },
  { path: "/admissions", changeFrequency: "monthly", priority: 0.8 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.5 },
  { path: "/alumni", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await newsRepository.listPublished();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/news/${article.id}`,
    lastModified: article.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
