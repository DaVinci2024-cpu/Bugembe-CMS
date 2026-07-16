"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GalleryItem } from "@/lib/data";

const categories = ["all", "Campus", "Islamic Activities", "Academics", "Sports", "Events", "Facilities"];

export function GalleryContent({ items }: { items: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = items.filter((item) => selectedCategory === "all" || item.category === selectedCategory);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative min-h-screen bg-[#fcfbf9] py-16 sm:py-24" id="gallery-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <span className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
            Bugembe Visual Record
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)]">Media & Campus Gallery</h2>
          <div className="w-20 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Take a visual tour of Bugembe Islamic Institute. Browse our classrooms, state-of-the-art laboratories, prayer gatherings, and
            athletic events.
          </p>
        </motion.div>

        {/* Categories Filtering Panel with Layout Animation */}
        <section className="flex flex-wrap justify-center gap-2 mb-12" id="gallery-filters">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`relative px-4.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  isActive
                    ? "text-[var(--color-accent)] border-[var(--color-primary)] shadow-md shadow-indigo-950/10 z-10"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGalleryTab"
                    className="absolute inset-0 bg-[var(--color-primary)] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{cat === "all" ? "All Media" : cat}</span>
              </button>
            );
          })}
        </section>

        {/* Gallery Masonry/Flex grid */}
        <section id="gallery-grid">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-xl border border-gray-100 p-8 shadow-sm"
            >
              <Camera className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-serif font-semibold text-base">No media assets in this category</p>
              <p className="text-xs text-gray-400 mt-1">We are actively updating our library. Check back soon for snapshots.</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onClick={() => setLightboxIndex(index)}
                  className="relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-md group cursor-pointer border border-gray-100 bg-gray-100 transition-shadow duration-300"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  {item.status === "draft" && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-[var(--color-primary)] px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider z-10 shadow">
                      Draft — not public
                    </span>
                  )}
                  {/* Subtle caption bottom panel (appears on hover) */}
                  <div className="absolute inset-0 bg-[var(--color-primary)]/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10">
                    <span className="text-[9px] text-[var(--color-accent)] font-mono uppercase tracking-widest mb-1.5 font-bold">{item.category}</span>
                    <h4 className="text-white font-serif font-bold text-sm sm:text-base mb-1">{item.title}</h4>
                    <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-3">{item.date}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Navigation Controls */}
            <motion.button
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[var(--color-accent)] transition-all z-50"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[var(--color-accent)] transition-all z-50"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>

            {/* Active Image and Caption */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl max-h-[75vh] w-full h-full flex flex-col justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-1 w-full h-full">
                <Image
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].title}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Caption Panel */}
              <div className="text-center text-white mt-4 space-y-1.5 bg-black/60 p-5 rounded-xl border border-white/5 backdrop-blur-md">
                <span className="text-[10px] text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h4 className="font-serif font-semibold text-base sm:text-lg">{filteredItems[lightboxIndex].title}</h4>
                <p className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">{filteredItems[lightboxIndex].description}</p>
                <div className="text-[10px] text-gray-400 font-mono">{filteredItems[lightboxIndex].date}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
