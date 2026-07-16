import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, MessageCircle } from "lucide-react";
import { NewsArticle } from "@/lib/data";
import { getVideoEmbedUrl } from "@/lib/video-embed";

// Presentational only — shared by the public article page and the admin
// draft-preview page, each of which handles its own data fetching and
// visibility rules.
export function ArticleView({ article, relatedArticles }: { article: NewsArticle; relatedArticles: NewsArticle[] }) {
  const whatsappShareText = `Assalamu Alaikum. Check out this article from Bugembe Islamic Institute: ${article.title} - Read more at https://bugembe.edu/news/${article.id}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`;
  const embedUrl = article.videoUrl ? getVideoEmbedUrl(article.videoUrl) : null;

  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="individual-article-root">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8" id="back-nav-container">
          <Link
            href="/news"
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Dispatches</span>
          </Link>
        </div>

        {/* Article Meta Header */}
        <header className="space-y-4 mb-10" id="article-header">
          <span className="inline-block bg-[var(--color-primary)] text-[var(--color-accent)] px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-primary)] leading-snug tracking-tight">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-400 font-mono pt-2 border-b border-gray-100 pb-6">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1.5 text-[var(--color-accent)]" />
              {article.author}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              {article.date}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              {article.readTime}
            </span>
          </div>
        </header>

        {/* Core Hero Image */}
        <div className="relative h-64 sm:h-96 md:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-12" id="article-hero-image">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 100vw"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Optional Embedded Video */}
        {embedUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-12" id="article-video">
            <iframe
              src={embedUrl}
              title={`${article.title} video`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Content & Sharing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12" id="article-layout">
          {/* Main Article Content */}
          <article className="lg:col-span-3 space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed font-sans" id="article-body">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Sharing Utilities Sidebar */}
          <aside className="lg:col-span-1 space-y-6" id="article-sidebar">
            <div className="border border-gray-100 bg-white rounded-xl p-6 shadow-sm sticky top-28 space-y-4 text-center">
              <h4 className="font-serif font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider">Share Article</h4>
              <p className="text-[10px] text-gray-400">Invite parents and family to read about Bugembe achievements.</p>
              <div className="space-y-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded text-xs uppercase tracking-wide transition-all shadow shadow-emerald-900/10"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>WhatsApp Share</span>
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles segment */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-gray-100 pt-16 mt-16" id="related-articles-section">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-primary)] mb-8">Related Dispatches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((ra) => (
                <div
                  key={ra.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md flex flex-col justify-between h-full group"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={ra.image}
                      alt={ra.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-[var(--color-accent)] font-mono font-bold uppercase tracking-wider">{ra.category}</span>
                      <h4 className="text-sm font-serif font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors mt-1 mb-2 line-clamp-2">
                        <Link href={`/news/${ra.id}`}>{ra.title}</Link>
                      </h4>
                    </div>
                    <Link
                      href={`/news/${ra.id}`}
                      className="text-[10px] text-gray-400 hover:text-[var(--color-accent)] font-mono uppercase tracking-wider font-semibold inline-flex items-center space-x-1.5 transition-colors mt-4"
                    >
                      <span>Read Story</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
