"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, Compass, BookOpen, UserCheck, Calendar, Image as ImageIcon, Users, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "@/src/assets/images/bugembe_islamic_institute_logo_1783765351760.jpg";
import { Branding, ContactInfo } from "@/lib/data";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/", icon: Compass },
  { label: "About Us", href: "/about", icon: BookOpen },
  { label: "Academics", href: "/academics", icon: GraduationCap },
  { label: "Admissions", href: "/admissions", icon: UserCheck },
  { label: "News & Events", href: "/news", icon: Calendar },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Alumni Network", href: "/alumni", icon: Users },
  { label: "Contact Us", href: "/contact", icon: MessageSquare },
];

export default function Navbar({ branding, announcements, contact }: { branding: Branding; announcements: string[]; contact: ContactInfo }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Top Banner with Quick Actions */}
      <div className="bg-[var(--color-primary-hover)] text-[#f2e7d5] text-xs py-2 px-4 md:px-8 flex justify-between items-center font-sans tracking-wide border-b border-white/5 z-50 relative">
        {/* Live Academic Event Ticker */}
        <div className="flex-1 max-w-[55%] sm:max-w-[65%] md:max-w-[72%] overflow-hidden relative mr-4">
          {announcements.length > 0 && (
            <div className="flex items-center space-x-2 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
              <span className="inline-flex items-center text-[var(--color-accent)] font-semibold text-[9px] sm:text-[10px] uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded mr-3 border border-amber-500/20 shrink-0">
                Live Updates
              </span>
              {/* Rendered twice so the marquee loop has no visible seam */}
              {[...announcements, ...announcements].map((text, i) => (
                <span key={i} className="inline-block text-[#f2e7d5] text-[11px] sm:text-xs font-medium pr-12 shrink-0">
                  <span className="inline-block w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full mr-2 shrink-0 animate-pulse"></span>
                  {text}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 shrink-0">
          <Link
            href="/contact"
            className="text-white hover:text-[var(--color-accent)] transition-colors"
          >
            Inquire Now
          </Link>
          <span className="text-white/30">|</span>
          <a
            href={`https://wa.me/${contact.whatsappNumber}?text=Assalamu%20Alaikum.%20I%20am%20inquiring%20about%20admissions%20at%20Bugembe%20Islamic%20Institute.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:text-amber-400 font-medium transition-colors"
          >
            WhatsApp Support
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[var(--color-primary)]/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10"
            : "bg-[var(--color-primary)] py-4 border-b border-white/5"
        }`}
        id="navbar-root"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand Area */}
          <Link href="/" className="flex items-center space-x-3 group" id="logo-brand">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-hover)] border border-[var(--color-accent)]/30 flex items-center justify-center shadow-md shadow-black/20 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              <Image
                src={branding.logoUrl || logoImg}
                alt={`${branding.siteName} Logo`}
                fill
                className="object-cover"
                sizes="40px"
                referrerPolicy="no-referrer"
                unoptimized={!!branding.logoUrl}
              />
            </div>
            <div>
              <h1 className="text-white font-serif font-semibold text-base sm:text-lg tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                {branding.siteName}
              </h1>
              <p className="text-[#a0aec0] text-[10px] tracking-wider uppercase font-mono">{branding.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--color-accent)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/admissions"
              className="ml-3 px-5 py-2 bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-amber-400 font-semibold text-xs tracking-wider uppercase rounded shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
            >
              Apply Online
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden" id="mobile-toggle-btn">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-200"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden bg-[var(--color-primary)] border-t border-white/10"
              id="mobile-nav-panel"
            >
              <div className="px-2 pt-3 pb-6 space-y-1 sm:px-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-[var(--color-accent)] border-l-4 border-[var(--color-accent)]"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-[var(--color-accent)]" : "text-gray-400"}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 px-4">
                  <Link
                    href="/admissions"
                    className="block w-full text-center py-3 bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold text-sm tracking-wider uppercase rounded shadow-md hover:bg-amber-400 transition-colors"
                  >
                    Apply Online Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
