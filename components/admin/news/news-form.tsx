"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NewsArticle } from "@/lib/data";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { ImageUpload } from "@/components/shared/image-upload";

const CATEGORIES: NewsArticle["category"][] = [
  "Announcements",
  "Academic News",
  "Events",
  "Admissions",
  "Islamic Activities",
  "Sports",
  "Student Life",
  "Achievements",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";
const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5";

export function NewsForm({ existing }: { existing?: NewsArticle }) {
  const router = useRouter();
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [category, setCategory] = useState<NewsArticle["category"]>(existing?.category ?? CATEGORIES[0]);
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10));
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [readTime, setReadTime] = useState(existing?.readTime ?? "3 min read");
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl ?? "");
  const [status, setStatus] = useState<NewsArticle["status"]>(existing?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!image) throw new Error("Please add an image before saving.");
      // firestore.rules requires slug to match ^[a-z0-9-]+$ — normalize
      // whatever was typed (or fall back to the title) rather than pass
      // through a blank/uppercase/spaced value that would fail validation.
      const normalizedSlug = slugify(slug || title);
      if (!normalizedSlug) throw new Error("Enter a title or slug so we can generate the article's URL.");
      // Always store videoUrl (possibly ""), rather than omitting the key —
      // that way clearing the field on an edit actually clears it in
      // Firestore too. Rendering treats "" the same as absent (falsy check).
      const fields = {
        title,
        slug: normalizedSlug,
        excerpt,
        content,
        category,
        date,
        author,
        image,
        featured,
        readTime,
        videoUrl: videoUrl.trim(),
        status,
      };
      if (isEdit) {
        await newsRepository.update(existing.id, fields);
      } else {
        await newsRepository.create(normalizedSlug, fields);
      }
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div>
        <label className={labelClass}>Status</label>
        <div className="flex gap-2">
          {(["draft", "published"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                status === s
                  ? s === "published"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1">Drafts are only visible in this admin panel, never on the public site.</p>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>
          Slug {!isEdit && <span className="font-normal normal-case text-slate-400">(becomes the article&apos;s URL — leave blank to auto-generate from the title)</span>}
        </label>
        <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. term-2-admissions-open-2026" />
      </div>

      <div>
        <label className={labelClass}>Excerpt</label>
        <textarea required rows={2} className={inputClass} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Content</label>
        <textarea
          required
          rows={10}
          className={inputClass}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Separate paragraphs with a blank line."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as NewsArticle["category"])}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" required className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Author</label>
          <input required className={inputClass} value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Read time</label>
          <input required className={inputClass} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="e.g. 4 min read" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Image</label>
        <ImageUpload value={image} onChange={setImage} folder="news" />
        {!image && <p className="text-xs text-rose-600 mt-1">An image is required.</p>}
      </div>

      <div>
        <label className={labelClass}>
          Video <span className="font-normal normal-case text-slate-400">(optional — paste a YouTube or Vimeo link)</span>
        </label>
        <input
          type="url"
          className={inputClass}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="cursor-pointer" />
        Feature this article at the top of the News page
      </label>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:bg-slate-300 text-white font-bold rounded-lg text-xs cursor-pointer"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Article"}
        </button>
        <Link
          href="/admin/news"
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs"
        >
          Cancel
        </Link>
        {isEdit && (
          <Link
            href={`/admin/news/${existing.id}/preview`}
            target="_blank"
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs ml-auto"
          >
            Preview
          </Link>
        )}
      </div>
    </form>
  );
}
