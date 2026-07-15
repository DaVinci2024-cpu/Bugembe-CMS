import { newsRepository } from "@/lib/firebase/newsRepository";
import { NewsBrowser } from "@/components/news/news-browser";

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export default async function NewsPage() {
  const articles = await newsRepository.listPublished();
  return <NewsBrowser articles={articles} />;
}
