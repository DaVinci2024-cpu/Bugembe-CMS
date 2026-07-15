"use client";

import { use, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { ArticleView } from "@/components/news/article-view";
import { NewsArticle } from "@/lib/data";

function PreviewContent({ articleId }: { articleId: string }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([newsRepository.get(articleId), newsRepository.listPublished()])
      .then(([result, publishedArticles]) => {
        if (cancelled) return;
        if (!result) {
          setNotFound(true);
          return;
        }
        setArticle(result);
        setRelated(publishedArticles.filter((a) => a.id !== result.id).slice(0, 3));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  if (loading) return <p className="text-xs text-slate-400 p-6">Loading preview...</p>;
  if (notFound || !article) return <p className="text-xs text-rose-600 p-6">Article not found.</p>;

  return (
    <div>
      <div
        className={`sticky top-0 z-10 flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider ${
          article.status === "published" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        Preview — this article is currently {article.status}
        {article.status === "draft" && " and not visible on the public site"}
      </div>
      <ArticleView article={article} relatedArticles={related} />
    </div>
  );
}

export default function AdminNewsPreviewPage({ params }: { params: Promise<{ articleId: string }> }) {
  const { articleId } = use(params);
  return (
    <ModuleGate permission="blogs">
      <PreviewContent articleId={articleId} />
    </ModuleGate>
  );
}
