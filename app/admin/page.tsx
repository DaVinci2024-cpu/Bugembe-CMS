"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sliders,
  FileText,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Users,
  GraduationCap,
  Info,
  Home,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/components/admin/auth-provider";
import { newsRepository } from "@/lib/firebase/newsRepository";
import { programsRepository } from "@/lib/firebase/programsRepository";
import { galleryRepository } from "@/lib/firebase/galleryRepository";
import { testimonialsRepository } from "@/lib/firebase/testimonialsRepository";
import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { userRepository } from "@/lib/firebase/userRepository";
import { CustomPermissions } from "@/lib/types/auth";

interface StatCard {
  label: string;
  value: number;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  permission: keyof CustomPermissions;
  accent?: "amber" | "emerald";
}

interface QuickLink {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: keyof CustomPermissions;
}

const quickLinks: QuickLink[] = [
  { href: "/admin/homepage", label: "Home & Settings", description: "Hero, statistics, branding, founder message", icon: Home, permission: "homepage" },
  { href: "/admin/about", label: "About Us Page", description: "History, mission, vision, facilities", icon: Info, permission: "about" },
  { href: "/admin/news", label: "News & Announcements", description: "Publish articles and updates", icon: FileText, permission: "blogs" },
  { href: "/admin/programs", label: "Academic Programs", description: "Manage curriculum listings", icon: BookOpen, permission: "programs" },
  { href: "/admin/gallery", label: "Gallery", description: "Campus photos and albums", icon: ImageIcon, permission: "gallery" },
  { href: "/admin/testimonials", label: "Testimonials", description: "Parent and student reviews", icon: MessageSquare, permission: "testimonials" },
  { href: "/admin/admissions", label: "Admissions", description: "Process, requirements, FAQs", icon: GraduationCap, permission: "admissions" },
  { href: "/admin/alumni", label: "Alumni Directory", description: "Review submissions, spotlight, groups", icon: Users, permission: "alumni" },
  { href: "/admin/users", label: "User Permissions", description: "Approve staff and set access", icon: UserCheck, permission: "users" },
];

export default function AdminDashboardPage() {
  const { user, userDoc, isSuperAdmin, hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    newsPublished: 0,
    newsDraft: 0,
    programs: 0,
    galleryItems: 0,
    testimonials: 0,
    alumniApproved: 0,
    alumniPending: 0,
    usersPending: 0,
  });

  const canSee = (key: keyof CustomPermissions) => isSuperAdmin || hasPermission(key);

  useEffect(() => {
    const load = async () => {
      const [news, programs, gallery, testimonials, alumni, users] = await Promise.all([
        canSee("blogs") ? newsRepository.list().catch(() => []) : Promise.resolve([]),
        canSee("programs") ? programsRepository.list().catch(() => []) : Promise.resolve([]),
        canSee("gallery") ? galleryRepository.list().catch(() => []) : Promise.resolve([]),
        canSee("testimonials") ? testimonialsRepository.list().catch(() => []) : Promise.resolve([]),
        canSee("alumni") ? alumniRepository.list().catch(() => []) : Promise.resolve([]),
        canSee("users") ? userRepository.listUsers().catch(() => []) : Promise.resolve([]),
      ]);

      setCounts({
        newsPublished: news.filter((n) => n.status === "published").length,
        newsDraft: news.filter((n) => n.status === "draft").length,
        programs: programs.length,
        galleryItems: gallery.length,
        testimonials: testimonials.length,
        alumniApproved: alumni.filter((a) => a.status === "approved").length,
        alumniPending: alumni.filter((a) => a.status === "pending").length,
        usersPending: users.filter((u) => u.status === "pending").length,
      });
      setLoading(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin]);

  const allStatCards: StatCard[] = [
    { label: "Pending Alumni Review", value: counts.alumniPending, sublabel: "awaiting approval", icon: Users, href: "/admin/alumni", permission: "alumni", accent: "amber" },
    { label: "Pending User Approvals", value: counts.usersPending, sublabel: "staff accounts", icon: UserCheck, href: "/admin/users", permission: "users", accent: "amber" },
    { label: "Published News", value: counts.newsPublished, sublabel: `${counts.newsDraft} draft${counts.newsDraft === 1 ? "" : "s"}`, icon: FileText, href: "/admin/news", permission: "blogs" },
    { label: "Academic Programs", value: counts.programs, sublabel: "listed", icon: BookOpen, href: "/admin/programs", permission: "programs" },
    { label: "Gallery Items", value: counts.galleryItems, sublabel: "photos & albums", icon: ImageIcon, href: "/admin/gallery", permission: "gallery" },
    { label: "Testimonials", value: counts.testimonials, sublabel: "on record", icon: MessageSquare, href: "/admin/testimonials", permission: "testimonials" },
    { label: "Approved Alumni", value: counts.alumniApproved, sublabel: "live on directory", icon: Users, href: "/admin/alumni", permission: "alumni", accent: "emerald" },
  ];
  const statCards = allStatCards.filter((card) => canSee(card.permission));

  const visibleQuickLinks = quickLinks.filter((link) => !link.permission || canSee(link.permission));

  return (
    <div className="space-y-6">
      <div className="bg-[#0c2340] text-white rounded-2xl p-6 relative overflow-hidden shadow-md border border-white/10">
        <div className="absolute top-[-20%] right-[-10%] w-[33%] h-[150%] rounded-full bg-[#d4af37]/10 blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] bg-[#d4af37] text-[#0c2340] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Access Approved
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white">Welcome back, {user?.displayName}</h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              A live snapshot of what&apos;s published on the public site, plus quick access to every module you manage.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 shrink-0 flex items-center gap-3">
            <div className="p-2 bg-[#d4af37] rounded-lg text-[#0c2340]">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[9px] text-slate-400 block font-bold tracking-wider">Your Status</span>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest leading-none mt-1">
                {userDoc?.status}
                {isSuperAdmin && " · SUPER ADMIN"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {statCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 h-[92px] animate-pulse" />
              ))
            : statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    href={card.href}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          card.accent === "amber"
                            ? "bg-amber-50 text-amber-600"
                            : card.accent === "emerald"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {card.value > 0 && card.accent === "amber" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-slate-900 leading-none">{card.value}</p>
                    <p className="text-[11px] font-bold text-slate-600 mt-1.5">{card.label}</p>
                    <p className="text-[10px] text-slate-400">{card.sublabel}</p>
                  </Link>
                );
              })}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleQuickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-[#0c2340]/5 text-[#0c2340] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900">{link.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{link.description}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 mt-1 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
