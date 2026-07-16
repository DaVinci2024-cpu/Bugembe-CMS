import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { ArticleView } from "@/components/news/article-view";
import { SITE_URL } from "@/lib/site-url";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Refresh from Firestore at most once an hour — keeps this off the
// per-visitor read path so we stay well within the Spark (free) plan quota.
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await newsRepository.get(id);
  if (!article || article.status !== "published") return {};

  const url = `${SITE_URL}/news/${article.id}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      images: [{ url: article.image }],
      publishedTime: article.date,
      authors: [article.author],
      tags: [article.category],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.date,
    dateModified: article.date,
    author: [{ "@type": "Person", name: article.author }],
    publisher: {
      "@type": "Organization",
      name: "Bugembe Islamic Institute",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    mainEntityOfPage: `${SITE_URL}/news/${article.id}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleView article={article} relatedArticles={relatedArticles} />
    </>
  );
}
