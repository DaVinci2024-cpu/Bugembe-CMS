"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, MessageSquare, ShieldCheck } from "lucide-react";
import logoImg from "@/src/assets/images/bugembe_islamic_institute_logo_1783765351760.jpg";
import { Branding, ContactInfo } from "@/lib/data";

export default function Footer({ branding, contact }: { branding: Branding; contact: ContactInfo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1424] text-gray-300 border-t border-white/5 font-sans" id="footer-root">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand & Values */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
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
                <h3 className="text-white font-serif font-semibold text-base sm:text-lg">{branding.siteName}</h3>
                <p className="text-[#a0aec0] text-[10px] tracking-wider uppercase font-mono">{branding.tagline}</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">{branding.brandBlurb}</p>
            <div className="flex items-center space-x-3 pt-2 text-xs text-[var(--color-accent)]">
              <ShieldCheck className="h-4 w-4" />
              <span>{branding.certificationText}</span>
            </div>
          </div>

          {/* Column 2: Academics Directory */}
          <div>
            <h4 className="text-white font-serif text-sm font-semibold tracking-wider uppercase mb-5 border-l-2 border-[var(--color-accent)] pl-3">
              Academics
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/academics" className="hover:text-[var(--color-accent)] hover:underline transition-colors flex items-center">
                  <span className="w-1 h-1 bg-[var(--color-accent)] rounded-full mr-2"></span>
                  Nursery School Foundation
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-[var(--color-accent)] hover:underline transition-colors flex items-center">
                  <span className="w-1 h-1 bg-[var(--color-accent)] rounded-full mr-2"></span>
                  Primary School Program
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-[var(--color-accent)] hover:underline transition-colors flex items-center">
                  <span className="w-1 h-1 bg-[var(--color-accent)] rounded-full mr-2"></span>
                  Ordinary Level (UCE)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-[var(--color-accent)] hover:underline transition-colors flex items-center">
                  <span className="w-1 h-1 bg-[var(--color-accent)] rounded-full mr-2"></span>
                  Advanced Level (UACE)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-[var(--color-accent)] hover:underline transition-colors flex items-center">
                  <span className="w-1 h-1 bg-[var(--color-accent)] rounded-full mr-2"></span>
                  Theological & Sharia Course
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Portals */}
          <div>
            <h4 className="text-white font-serif text-sm font-semibold tracking-wider uppercase mb-5 border-l-2 border-[var(--color-accent)] pl-3">
              Quick Portals
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/admissions" className="hover:text-[var(--color-accent)] hover:underline transition-colors">
                  Admissions Process
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[var(--color-accent)] hover:underline transition-colors">
                  Latest News & Press
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[var(--color-accent)] hover:underline transition-colors">
                  Media Gallery
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-[var(--color-accent)] hover:underline transition-colors font-medium text-[var(--color-accent)]">
                  Alumni Network Hub
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--color-accent)] hover:underline transition-colors">
                  Support & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Desk */}
          <div className="space-y-4">
            <h4 className="text-white font-serif text-sm font-semibold tracking-wider uppercase mb-5 border-l-2 border-[var(--color-accent)] pl-3">
              Contact Desk
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-[var(--color-accent)] transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-[var(--color-accent)] transition-colors">
                  {contact.email}
                </a>
              </li>
            </ul>
            {/* Social handles */}
            <div className="flex items-center space-x-4 pt-3">
              <a
                href={contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 hover:bg-[var(--color-accent)] hover:text-[#0b1424] flex items-center justify-center transition-all"
                aria-label="Facebook Page"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 hover:bg-[var(--color-accent)] hover:text-[#0b1424] flex items-center justify-center transition-all"
                aria-label="WhatsApp admissions"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Panel — extra bottom padding on mobile so the fixed
          floating chat/WhatsApp launcher never sits on top of Staff Login */}
      <div className="bg-[#070d18] pt-6 pb-24 sm:pb-6 text-xs text-gray-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© {currentYear} Bugembe Islamic Institute. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/admissions" className="hover:text-[var(--color-accent)] transition-colors">
              Admissions Policy
            </Link>
            <span>•</span>
            <Link href="/alumni" className="hover:text-[var(--color-accent)] transition-colors">
              Alumni Guidelines
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-[var(--color-accent)] transition-colors">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
