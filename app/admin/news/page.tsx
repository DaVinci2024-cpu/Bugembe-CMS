"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, UploadCloud } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { newsArticles as staticNewsArticles, NewsArticle } from "@/lib/data";

function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No setLoading(true) here on purpose: the initial `loading` state already
  // starts true, and calling it synchronously from the mount effect (before
  // the first await) would trigger a cascading-render lint error. Callers
  // that reload after a mutation (delete/seed) set it explicitly themselves.
  const load = async () => {
    try {
      const result = await newsRepository.list();
      result.sort((a, b) => (a.date < b.date ? 1 : -1));
      setArticles(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  // One-shot fetch-on-mount; load()'s setState calls only run in its
  // post-await continuation, never synchronously during this effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await newsRepository.remove(id);
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to delete article.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      for (const { id, ...fields } of staticNewsArticles) {
        await newsRepository.create(id, fields);
      }
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to import the sample articles.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">News & Announcements</h2>
          <p className="text-xs text-slate-500 mt-0.5">Articles shown on the public News page.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="px-4 py-2 bg-[#0c2340] hover:bg-[#0b1c3c] text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          New Article
        </Link>
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <p className="text-xs text-slate-500">No articles yet.</p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 mx-auto cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {seeding ? "Importing..." : "Import the 5 existing sample articles"}
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-500 text-[10.5px]">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3"></th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{article.title}</td>
                  <td className="p-3 text-slate-500">{article.category}</td>
                  <td className="p-3 text-slate-500">{article.date}</td>
                  <td className="p-3">
                    {article.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/news/${article.id}`}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="p-1.5 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminNewsPage() {
  return (
    <ModuleGate permission="blogs">
      <NewsList />
    </ModuleGate>
  );
}
