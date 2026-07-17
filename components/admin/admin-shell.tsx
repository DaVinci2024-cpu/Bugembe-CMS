"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "@/components/admin/auth-provider";
import { LoginScreen } from "@/components/admin/login-screen";
import { WaitingRoom } from "@/components/admin/waiting-room";
import { Sidebar } from "@/components/admin/sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, userDoc, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] flex flex-col items-center justify-center text-xs text-slate-400">
        <div className="w-8 h-8 border-2 border-[#0c2340] border-t-transparent rounded-full animate-spin mb-3" />
        Checking your session...
      </div>
    );
  }

  if (!user || !userDoc) {
    return <LoginScreen />;
  }

  if (userDoc.status !== "approved") {
    return <WaitingRoom />;
  }

  return (
    <div className="h-screen bg-[#f7f7f5] flex text-slate-900 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Mobile-only top bar — reserves its own space above the content
            (not fixed/floating) so it never covers anything, and gives a
            permanent way to bring the sidebar back once it's slid away. */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-[#0c2340] text-white px-4 py-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold tracking-tight">Admin Console</span>
        </div>
        <main className="p-4 sm:p-6 flex-1 w-full max-w-[1400px] mx-auto space-y-6">{children}</main>
      </div>
    </div>
  );
}
