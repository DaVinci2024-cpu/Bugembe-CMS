import type { Metadata } from "next";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { NewsBrowser } from "@/components/news/news-browser";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News & Announcements",
  description: "Latest news, events, and announcements from Bugembe Islamic Institute in Jinja, Uganda.",
  openGraph: {
    title: "News & Announcements | Bugembe Islamic Institute",
    description: "Latest news, events, and announcements from Bugembe Islamic Institute in Jinja, Uganda.",
  },
};

export default async function NewsPage() {
  const articles = await newsRepository.listPublished();
  return <NewsBrowser articles={articles} />;
}
