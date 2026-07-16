"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Info,
  FileText,
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  MessageSquare,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/admin/auth-provider";
import { CustomPermissions } from "@/lib/types/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: keyof CustomPermissions;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Core Console",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "CMS Management",
    items: [
      { href: "/admin/homepage", label: "Home & Settings", icon: Home, permission: "homepage" },
      { href: "/admin/about", label: "About Us Page", icon: Info, permission: "about" },
      { href: "/admin/news", label: "News & Announcements", icon: FileText, permission: "blogs" },
      { href: "/admin/programs", label: "Academic Programs", icon: BookOpen, permission: "programs" },
      { href: "/admin/gallery", label: "Gallery", icon: ImageIcon, permission: "gallery" },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare, permission: "testimonials" },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/admin/admissions", label: "Admissions", icon: GraduationCap, permission: "admissions" },
      { href: "/admin/alumni", label: "Alumni Directory", icon: Users, permission: "alumni" },
      { href: "/admin/users", label: "User Permissions", icon: Users, permission: "users" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userDoc, isSuperAdmin, hasPermission, logout } = useAuth();

  const handleBackToSite = async () => {
    const confirmed = window.confirm(
      "Leaving the admin panel will sign you out of the admin console. You can sign back in anytime with Google. Continue to the public website?"
    );
    if (!confirmed) return;
    await logout();
    router.push("/");
  };

  return (
    <aside className="h-full w-[240px] shrink-0 bg-[#0c2340] border-r border-white/10 flex flex-col justify-between text-slate-300">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <button
          onClick={handleBackToSite}
          title="Back to public website (signs you out)"
          className="p-4 border-b border-white/10 flex items-center gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors group w-full"
        >
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] flex items-center justify-center text-[#0c2340] shrink-0 font-bold text-sm">
            BII
          </div>
          <div className="text-left truncate flex-1 min-w-0">
            <h4 className="text-[12px] font-bold tracking-tight text-white leading-none">Bugembe Islamic</h4>
            <span className="text-[10px] text-slate-400 font-medium">Admin Console</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4af37] transition-colors shrink-0" />
        </button>

        {userDoc && (
          <div className="px-4 py-2.5 mx-3 mt-3 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <div className="text-[10px] truncate">
              <span className="text-slate-400 font-medium block">Active Profile</span>
              <span className="font-bold text-white uppercase">{userDoc.status}</span>
              {isSuperAdmin && <span className="text-[#d4af37] font-bold ml-1">(SUPER ADMIN)</span>}
            </div>
          </div>
        )}

        <nav className="p-3 space-y-4 flex-1">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !item.permission || isSuperAdmin || hasPermission(item.permission)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] block px-2.5 py-1 mb-1">
                  {group.title}
                </span>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`w-full relative p-2 rounded-lg text-left transition-all duration-150 flex items-center gap-3 border ${
                          isActive
                            ? "bg-[#d4af37]/10 border-[#d4af37]/20 text-white"
                            : "bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#d4af37] rounded-sm" />}
                        <div className={`p-1.5 rounded-md ${isActive ? "bg-[#d4af37] text-[#0c2340]" : "bg-white/5 text-slate-400"}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="text-[12.5px] font-bold tracking-tight">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-white/10 bg-black/10">
        <div className="flex justify-between items-center">
          {user && (
            <div className="flex items-center gap-2.5 min-w-0">
              {user.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-white/10 shrink-0 object-cover" referrerPolicy="no-referrer" />
              )}
              <div className="text-left min-w-0 truncate">
                <h5 className="text-[12px] font-bold text-white truncate leading-tight">{user.displayName}</h5>
                <span className="text-[9.5px] text-slate-500 font-medium truncate block">{user.email}</span>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-500 border border-transparent hover:border-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
