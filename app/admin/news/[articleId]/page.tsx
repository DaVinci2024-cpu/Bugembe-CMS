"use client";

import { use, useEffect, useState } from "react";
import { ModuleGate } from "@/components/admin/module-gate";
import { NewsForm } from "@/components/admin/news/news-form";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { NewsArticle } from "@/lib/data";

export default function EditNewsArticlePage({ params }: { params: Promise<{ articleId: string }> }) {
  const { articleId } = use(params);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    newsRepository
      .get(articleId)
      .then((result) => {
        if (cancelled) return;
        if (!result) setNotFound(true);
        else setArticle(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  return (
    <ModuleGate permission="blogs">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Edit Article</h2>
        {loading && <p className="text-xs text-slate-400">Loading article...</p>}
        {notFound && <p className="text-xs text-rose-600">Article not found.</p>}
        {article && <NewsForm existing={article} />}
      </div>
    </ModuleGate>
  );
}
