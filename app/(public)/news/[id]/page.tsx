import { notFound } from "next/navigation";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { ArticleView } from "@/components/news/article-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await newsRepository.get(id);

  if (!article) {
    notFound();
  }

  // Find 3 related articles (exclude the current one). Published-only:
  // firestore.rules would deny an unfiltered list() call from this
  // unauthenticated server-side fetch anyway.
  const allArticles = await newsRepository.listPublished();
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 3);

  return <ArticleView article={article} relatedArticles={relatedArticles} />;
}
