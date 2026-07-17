"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "@/src/assets/images/bugembe_islamic_institute_logo_1783765351760.jpg";
import {
  Program,
  NewsArticle,
  GalleryItem,
  Testimonial,
  Hero,
  Statistic,
  Advantage,
  Achievement,
  Branding,
  FounderMessage,
  AlumniProfile,
} from "@/lib/data";
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid";
import { getIcon, getCardColor } from "@/lib/icon-options";

function AlumniScrollSection({ profiles }: { profiles: AlumniProfile[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const isInteractingRef = React.useRef(false);
  const interactionTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const dragStartXRef = React.useRef(0);
  const dragScrollLeftRef = React.useRef(0);

  // Triple the list to create a seamless infinite scrolling sequence
  const tripledProfiles = [...profiles, ...profiles, ...profiles];

  // Helper to pause auto-scroll during/after user interaction (clicks, drags, touch)
  const triggerInteractionPause = () => {
    isInteractingRef.current = true;
    setIsPaused(true);
    
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    
    // Resume auto-scroll after 4 seconds of idle time
    interactionTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
      setIsPaused(false);
    }, 4000);
  };

  React.useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulatedScroll = 0;

    const tick = (now: number) => {
      if (scrollRef.current && !isPaused && !isInteractingRef.current && !isDragging) {
        const el = scrollRef.current;
        const delta = now - lastTime;
        
        // Very slow, soothing pace: ~30px per second (0.03px/ms)
        accumulatedScroll += delta * 0.03;
        
        if (accumulatedScroll >= 1) {
          const pixelsToScroll = Math.floor(accumulatedScroll);
          el.scrollLeft += pixelsToScroll;
          accumulatedScroll -= pixelsToScroll;
          
          // Seamless loop back when we cross 1/3 of the tripled width
          const setWidth = el.scrollWidth / 3;
          if (el.scrollLeft >= setWidth * 2) {
            el.scrollLeft -= setWidth;
          }
        }
      }
      lastTime = now;
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [isPaused, isDragging]);

  if (profiles.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    triggerInteractionPause();
    
    if (scrollRef.current) {
      const el = scrollRef.current;
      const { scrollLeft, clientWidth } = el;
      
      // Dynamic scroll amount based on screen size (about 80% of width or a single card)
      const scrollAmount = Math.min(clientWidth * 0.85, 380); 
      const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      el.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
      
      // Ensure infinite bounds are wrapped cleanly after transition
      setTimeout(() => {
        if (!el) return;
        const setWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= setWidth * 2) {
          el.scrollLeft -= setWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += setWidth;
        }
      }, 500);
    }
  };

  // Mouse Drag to Scroll interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    triggerInteractionPause();
    dragStartXRef.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    triggerInteractionPause();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.5; // Drag sensitivity
    scrollRef.current.scrollLeft = dragScrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      const el = scrollRef.current;
      const setWidth = el.scrollWidth / 3;
      if (el.scrollLeft >= setWidth * 2) {
        el.scrollLeft -= setWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += setWidth;
      }
    }
  };

  return (
    <section className="bg-[var(--color-primary)] text-white py-20 relative overflow-hidden" id="alumni-scroll-section">
      {/* Decorative background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
              Enduring Legacy
            </p>
            <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-white">
              Our Global Alumni Network
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
              From surgeons to software engineers, our graduates are leading with honor, carrying the values of Bugembe Islamic Institute across the globe.
            </p>
          </div>

          {/* Navigation Buttons for desktop */}
          <div className="hidden sm:flex items-center space-x-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll("left")}
              className="p-2.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll Left"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll Right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative mx-[-16px] px-4 sm:mx-0 sm:px-0">
          {/* Left & Right Fade Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[var(--color-primary)] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[var(--color-primary)] to-transparent pointer-events-none z-10" />

          {/* Scrolling Row */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              handleMouseUpOrLeave();
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onTouchStart={() => {
              setIsPaused(true);
              triggerInteractionPause();
            }}
            onTouchEnd={() => {
              setIsPaused(false);
            }}
            className={`flex space-x-6 overflow-x-auto pb-8 pt-2 scrollbar-none select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tripledProfiles.map((alumnus, idx) => (
              <div
                key={idx}
                className="w-[280px] sm:w-[350px] shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 hover:bg-white/[0.08] transition-all duration-300 pointer-events-auto"
              >
                <div>
                  <div className="text-amber-500/30 text-4xl font-serif leading-none mb-3 font-bold select-none">“</div>
                  <p className="text-gray-300 text-xs sm:text-sm italic leading-relaxed mb-6 font-serif line-clamp-4">
                    {alumnus.bio}
                  </p>
                </div>

                <div className="flex items-center space-x-4 border-t border-white/10 pt-4">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/30 shrink-0">
                    <Image
                      src={alumnus.photo}
                      alt={alumnus.fullName}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="44px"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{alumnus.fullName}</h4>
                    <p className="text-[9px] sm:text-[10px] text-amber-400 font-mono tracking-wider">Class of {alumnus.graduationYear}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 truncate mt-0.5">
                      {alumnus.profession} • <span className="font-medium text-gray-300">{alumnus.organization}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/alumni"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[var(--color-accent)] to-amber-600 hover:from-amber-500 hover:to-amber-600 text-[var(--color-primary)] font-bold px-6 py-3 rounded-full shadow-lg shadow-amber-900/20 hover:shadow-xl transition-all duration-300"
          >
            <span>Explore Alumni Profiles & Stories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface HomeContentProps {
  programs: Program[];
  newsArticles: NewsArticle[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  hero: Hero;
  statistics: Statistic[];
  advantages: Advantage[];
  achievements: Achievement[];
  branding: Branding;
  founder: FounderMessage;
  featuredAlumni: AlumniProfile[];
}

export function HomeContent({
  programs,
  newsArticles,
  galleryItems,
  testimonials,
  hero: heroContent,
  statistics,
  advantages,
  achievements,
  branding,
  founder,
  featuredAlumni,
}: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter gallery items for a mini showcase
  const filteredGallery = galleryItems.slice(0, 6);

  // Counter animation helper state
  // Counts each statistic up from 0 to its target over ~1.2s, regardless of
  // how many statistics there are or what their target values look like.
  const [animatedValues, setAnimatedValues] = useState<number[]>(() => statistics.map(() => 0));

  useEffect(() => {
    const steps = 30;
    const targets = statistics.map((s) => s.value);
    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      setAnimatedValues(targets.map((t) => Math.min((t / steps) * tick, t)));
      if (tick >= steps) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [statistics]);

  return (
    <div className="relative min-h-screen bg-[#fcfbf9]" id="home-page-root">
      {/* 1. HERO SECTION WITH IMAGE ZOOM & GRADIENT OVERLAYS */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden" id="hero-section">
        {/* Animated Background Image Zoom */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroContent.bgImage}
            alt="Bugembe Islamic Institute Campus Environment"
            fill
            priority
            className="object-cover transform scale-105 animate-[zoom_25s_infinite_alternate]"
            sizes="100vw"
            referrerPolicy="no-referrer"
          />
          {/* Neutral dark scrim carries the text contrast — independent of
              whatever brand color is set, so the photo never gets washed
              out by a light/bright primary color choice. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30 z-10" />
          {/* Faint brand-color wash on top, just for identity — kept low so it tints rather than clouds the photo. */}
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-20 h-20 relative rounded-full bg-[var(--color-primary)] border-2 border-[var(--color-accent)]/40 p-1.5 shadow-2xl overflow-hidden mb-1 hover:scale-105 transition-transform duration-300">
              <Image
                src={branding.logoUrl || logoImg}
                alt={`${branding.siteName} Emblem`}
                fill
                className="object-cover rounded-full"
                sizes="80px"
                referrerPolicy="no-referrer"
                unoptimized={!!branding.logoUrl}
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight tracking-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]"
          >
            {heroContent.headline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-200 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-sans leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
          >
            {heroContent.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Link
              href={heroContent.ctaPrimaryLink}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] hover:bg-amber-400 text-[var(--color-primary)] font-bold text-sm tracking-wider uppercase rounded shadow-lg shadow-black/30 hover:scale-102 transition-all flex items-center justify-center space-x-2"
            >
              <span>{heroContent.ctaPrimaryText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={heroContent.ctaSecondaryLink}
              className="w-full sm:w-auto px-8 py-4 bg-black/20 hover:bg-black/30 text-white font-bold text-sm tracking-wider uppercase rounded border border-white/40 hover:border-white/60 transition-all flex items-center justify-center backdrop-blur-sm"
            >
              {heroContent.ctaSecondaryText}
            </Link>
          </motion.div>
        </div>

        {/* Floating background decorative light spheres */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-10" />
      </section>

      {/* 2. TRUST STATISTICS WITH ANIMATED COUNTERS */}
      <section className="relative z-30 -mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" id="stats-section">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-amber-500/10 grid grid-cols-2 lg:grid-cols-5 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {statistics.map((stat, i) => {
            const StatIcon = getIcon(stat.icon);
            const displayValue = Number.isInteger(stat.value)
              ? Math.round(animatedValues[i] ?? 0)
              : (animatedValues[i] ?? 0).toFixed(1);
            return (
              <div key={stat.id} className={`text-center p-4 ${i > 0 ? "pt-6 lg:pt-4" : ""}`}>
                <StatIcon className="h-5 w-5 text-[var(--color-accent)] mx-auto mb-2" />
                <p className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-primary)]">
                  {displayValue}
                  {stat.suffix}
                </p>
                <p className="text-[var(--color-accent)] text-[10px] uppercase tracking-wider font-mono font-bold mt-1">{stat.label}</p>
                <p className="text-gray-400 text-xs mt-1">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WHY CHOOSE US - PREMIUM GRID CARDS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="why-choose-us-section">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
            The Bugembe Advantage
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-primary)]">
            Pioneering Academic and Spiritual Success
          </h3>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Our curriculum integrates the rigorous national curriculum with profound theology, ensuring our graduates lead in corporate and ethical landscapes.
          </p>
        </div>

        {/* Framer motion wrapper for staggered viewport animation */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {advantages.map((adv) => {
            const Icon = getIcon(adv.icon);
            const cardColor = getCardColor(adv.color);
            const isExpanded = !!expandedCards[adv.id];

            return (
              <motion.div
                key={adv.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white p-5 sm:p-6 md:p-8 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    {/* Responsive Icon: shrinks/grows beautifully */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg ${cardColor.bg} flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 ${cardColor.text} group-hover:text-[var(--color-accent)] transition-colors`} />
                    </div>

                    <button
                      onClick={() => toggleCard(adv.id)}
                      className="text-xs text-[var(--color-primary)] hover:text-[var(--color-accent)] border border-gray-200 hover:border-amber-300 bg-gray-50/50 hover:bg-amber-50 px-2.5 py-1.5 rounded flex items-center space-x-1 transition-all"
                      title={isExpanded ? "Collapse Details" : "Expand Details"}
                    >
                      <span className="font-mono text-[10px] uppercase font-semibold">
                        {isExpanded ? "Minimize" : "Maximize"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  <h4 className="text-base sm:text-lg font-serif font-semibold text-[var(--color-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                    {adv.title}
                  </h4>
                  
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                    {adv.description}
                  </p>

                  {/* Dynamic Expandable Sublist Details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden mt-4 pt-4 border-t border-gray-50 space-y-2.5"
                      >
                        <p className="text-[10px] font-mono uppercase text-[var(--color-accent)] font-semibold tracking-wider">
                          Key Offerings:
                        </p>
                        <ul className="space-y-1.5">
                          {adv.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start text-xs text-gray-600 space-x-2">
                              <span className="text-[var(--color-accent)] mt-1 shrink-0">✓</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-4 border-t border-gray-50 pt-3 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-400">
                    Dual Curriculum Advantage
                  </span>
                  <button
                    onClick={() => toggleCard(adv.id)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-primary)] font-semibold flex items-center space-x-1"
                  >
                    <span className="hover:underline">
                      {isExpanded ? "Hide details" : "Show details"}
                    </span>
                    <ArrowRight className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* FOUNDER MESSAGE SECTION */}
      <section className="py-24 bg-[#fbfaf7] border-y border-gray-200/50 relative overflow-hidden" id="founder-section">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Founder's Image (Single) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative w-full aspect-[4/5] max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 ring-1 ring-gray-200">
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 340px"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 text-white">
                  <p className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">{founder.eyebrow}</p>
                  <p className="font-serif text-sm font-semibold">{founder.name}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Message & Signature */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold flex items-center gap-2">
                  {React.createElement(getIcon(founder.icon), { className: "h-3.5 w-3.5" })}
                  {founder.eyebrow}
                </p>
                <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-primary)]">{founder.heading}</h3>
                <div className="w-12 h-1 bg-[var(--color-accent)] rounded-full" />
              </div>

              <div className="relative">
                <span className="absolute -top-10 -left-6 text-7xl font-serif text-amber-500/10 select-none">“</span>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed italic font-serif relative z-10">{founder.message}</p>
              </div>

              <div className="border-t border-gray-200/80 pt-6 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-serif font-bold text-[var(--color-primary)]">{founder.name}</h4>
                  <p className="text-xs text-[var(--color-accent)] font-mono tracking-wider mt-0.5">{founder.title}</p>
                </div>

                {/* Vintage seal ornament */}
                <div className="h-12 w-12 rounded-full border-2 border-dashed border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] text-[10px] font-mono font-bold rotate-12">
                  {founder.badgeText}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ALUMNI SCROLL SECTION */}
      <AlumniScrollSection profiles={featuredAlumni} />

      {/* 4. ACADEMIC PROGRAMS SECTION */}
      <section className="bg-[var(--color-primary)] text-white py-20" id="programs-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-4">
            <div>
              <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
                Our Pathways
              </p>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold mt-2">
                Nurturing Excellence Across All Levels
              </h3>
            </div>
            <Link
              href="/academics"
              className="px-6 py-3 bg-[var(--color-accent)] hover:bg-amber-400 text-[var(--color-primary)] font-bold text-xs tracking-wider uppercase rounded transition-all flex items-center space-x-2"
            >
              <span>Explore Curriculum Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {programs.map((program) => (
              <motion.div
                key={program.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-[#0c1c35] rounded-xl overflow-hidden border border-white/5 shadow-lg group hover:border-[var(--color-accent)]/30 transition-all duration-300 flex flex-col h-full"
              >
                {/* Program image container */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[var(--color-primary)]/90 text-[var(--color-accent)] px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-[var(--color-accent)]/30">
                    {program.level}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-white mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                      {program.title}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {program.shortDescription}
                    </p>
                  </div>
                  <Link
                    href={`/academics#${program.id}`}
                    className="text-xs text-[var(--color-accent)] hover:text-amber-400 font-bold tracking-wider uppercase inline-flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Requirements</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. CAMPUS LIFE SHOWCASE (MIGRATED LIGHTBOX READY IMAGES) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="campus-life-section">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
            Life on Campus
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-primary)]">
            Our Facilities & Dynamic Activities
          </h3>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
        </div>

        {/* Masonry-like Grid */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredGallery.map((item, index) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => setLightboxIndex(index)}
              className="relative h-64 rounded-xl overflow-hidden shadow-md group cursor-pointer border border-gray-100"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                referrerPolicy="no-referrer"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[var(--color-primary)]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                <span className="text-[10px] text-[var(--color-accent)] font-mono uppercase tracking-widest mb-1.5">
                  {item.category}
                </span>
                <h4 className="text-white font-serif font-semibold text-base mb-1">
                  {item.title}
                </h4>
                <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center pt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 text-xs text-[var(--color-primary)] hover:text-[var(--color-accent)] font-bold tracking-wider uppercase border-b-2 border-[var(--color-primary)] hover:border-[var(--color-accent)] pb-1.5 transition-colors"
          >
            <span>Explore Campus Gallery</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 6. RESULTS & ACHIEVEMENTS TIMELINE */}
      <section className="bg-gray-50 py-20" id="achievements-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
              Legacy of Success
            </p>
            <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-primary)]">
              Milestones & National UNEB Results
            </h3>
            <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
          </div>

          <div className="relative border-l border-gray-300 pl-6 sm:pl-8 space-y-12">
            {achievements.map((ach) => (
              <div key={ach.id} className="relative group">
                {/* Dot marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 bg-[var(--color-accent)] rounded-full border-4 border-white group-hover:bg-[var(--color-primary)] group-hover:scale-120 transition-all duration-300 shadow-md" />

                {/* Achievement Block */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group-hover:shadow-lg transition-shadow">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[var(--color-primary)] text-white px-3 py-1 rounded text-[11px] font-mono font-bold">
                        {ach.year}
                      </span>
                      <span className="text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                        {ach.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-serif font-semibold text-[var(--color-primary)] mb-2">
                      {ach.title}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
                      {ach.description}
                    </p>
                  </div>
                  {ach.metric && (
                    <div className="shrink-0 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded text-[var(--color-accent)] font-mono text-xs font-semibold tracking-wider uppercase">
                      {ach.metric}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 7. TESTIMONIALS & SUCCESS STORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="testimonials-section">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
            Voices of Trust
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-primary)]">
            What Our Community Says About Us
          </h3>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
        </div>

        <TestimonialsGrid testimonials={testimonials} />
      </section>

      {/* 8. NEWS PREVIEW (LATEST DISPATCHES) */}
      <section className="bg-gray-50 py-20" id="news-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div>
              <p className="text-xs text-[var(--color-accent)] font-mono uppercase tracking-widest font-bold">
                News & Dispatches
              </p>
              <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-primary)]">
                Latest Institutional Announcements
              </h3>
            </div>
            <Link
              href="/news"
              className="px-6 py-3 border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-primary)] font-bold text-xs tracking-wider uppercase rounded transition-all"
            >
              View All News
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-[var(--color-accent)] px-3 py-1 rounded text-[10px] font-semibold tracking-wider uppercase">
                    {article.category}
                  </span>
                </div>

                {/* Body */}
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
                    <h4 className="text-base font-serif font-bold text-[var(--color-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/news/${article.id}`}
                    className="text-xs text-[var(--color-primary)] hover:text-[var(--color-accent)] font-bold tracking-wider uppercase inline-flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. ADMISSIONS CALL-TO-ACTION (CTA) */}
      <section className="bg-[var(--color-primary-hover)] text-white py-16 relative overflow-hidden" id="admissions-cta">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[#0c1c35]/95 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Nurture Your Child&apos;s Academic and Moral Legacy Today
          </h3>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Admissions for the upcoming term are currently in progress. Apply online today or coordinate with our Admissions Office for guided support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/admissions"
              className="w-full sm:w-auto px-8 py-4 bg-[var(--color-accent)] hover:bg-amber-400 text-[var(--color-primary)] font-bold text-xs tracking-wider uppercase rounded shadow-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Begin Application Process</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/256701000000?text=Assalamu%20Alaikum.%20I%20am%20inquiring%20about%20admissions%20at%20Bugembe%20Islamic%20Institute."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase rounded shadow-lg transition-colors flex items-center justify-center space-x-2"
            >
              <MessageSquare className="h-4 w-4 fill-white" />
              <span>Contact via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Masonry lightbox popup */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-50"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 20 } }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full flex flex-col justify-center"
            >
              <div className="relative flex-1 w-full h-full">
                <Image
                  src={filteredGallery[lightboxIndex].image}
                  alt={filteredGallery[lightboxIndex].title}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center text-white mt-4 space-y-1 bg-black/60 p-4 rounded-lg">
                <h4 className="font-serif font-semibold text-lg">
                  {filteredGallery[lightboxIndex].title}
                </h4>
                <p className="text-xs text-gray-300">
                  {filteredGallery[lightboxIndex].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom X icon wrapper because X is not present in standard Lucide
function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
