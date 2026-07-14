"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, ArrowRight, Calendar, BookOpen } from "lucide-react";
import { NewsArticle } from "@/lib/data";

const categories = [
  "all",
  "Announcements",
  "Academic News",
  "Events",
  "Admissions",
  "Islamic Activities",
  "Sports",
  "Student Life",
  "Achievements",
];

export function NewsBrowser({ articles }: { articles: NewsArticle[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (articles.length === 0) {
    return (
      <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center py-16 bg-white rounded-xl border border-gray-100 shadow-inner">
          <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-serif text-base font-semibold">No news yet</p>
          <p className="text-xs text-gray-400 mt-1">Check back soon for updates from Bugembe Islamic Institute.</p>
        </div>
      </div>
    );
  }

  // Get featured article (highest-ranked featured or first item)
  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  // Filter remaining articles based on search & category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="news-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-bold">
            Institute Dispatches
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0c2340]">
            News & Achievements Portal
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-sm leading-relaxed">
            Follow the latest celebrations, academic PLE/UCE metrics, Islamic memorization achievements, and community events directly from Bugembe.
          </p>
        </div>

        {/* 1. Featured Article Banner */}
        {selectedCategory === "all" && !searchQuery && featuredArticle && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-16" id="featured-article-banner">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 sm:h-96 lg:h-auto min-h-[300px]">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-6 left-6 bg-[#0c2340] text-[#d4af37] border border-[#d4af37]/30 px-3.5 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase">
                  Featured Announcement
                </span>
              </div>
              <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
                <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                    {featuredArticle.date}
                  </span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340] hover:text-[#d4af37] transition-colors leading-snug">
                  <Link href={`/news/${featuredArticle.id}`}>{featuredArticle.title}</Link>
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{featuredArticle.excerpt}</p>
                <div className="pt-2">
                  <Link
                    href={`/news/${featuredArticle.id}`}
                    className="inline-flex items-center space-x-2 bg-[#0c2340] hover:bg-indigo-950 text-white font-bold py-3.5 px-6 rounded uppercase tracking-wider text-xs shadow-md transition-colors"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="h-4 w-4 text-[#d4af37]" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. Filters & Search Section */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-12" id="filter-panel">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, milestones, awards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white text-xs sm:text-sm rounded-lg pl-11 pr-4 py-3 border border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0c2340] text-[#d4af37] border-[#0c2340]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-[#0c2340]"
                  }`}
                >
                  {cat === "all" ? "All Dispatches" : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. News Grid */}
        <section id="news-grid-block">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-inner">
              <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-4 animate-bounce" />
              <p className="text-gray-500 font-serif text-base font-semibold">No dispatches found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                We couldn&apos;t find any articles matching your search criteria. Try looking up broader keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image container */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-[#0c2340] text-[#d4af37] px-3.5 py-1.5 rounded text-[10px] font-semibold tracking-wider uppercase border border-white/5">
                      {article.category}
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-4 text-[11px] text-gray-400 font-mono mb-3">
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {article.date}
                        </span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-[#0c2340] mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
                    </div>
                    <Link
                      href={`/news/${article.id}`}
                      className="text-xs text-[#0c2340] hover:text-[#d4af37] font-bold tracking-wider uppercase inline-flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
