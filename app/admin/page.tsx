"use client";

import { Sliders } from "lucide-react";
import { useAuth } from "@/components/admin/auth-provider";

export default function AdminDashboardPage() {
  const { user, userDoc, isSuperAdmin } = useAuth();

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
              This is the Bugembe Islamic Institute admin console. Content modules will appear here as they are
              built out — for now this is the authentication and permissions foundation.
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

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">What&apos;s next</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Each sidebar module currently shows a placeholder. CRUD screens are built one module at a time, starting
          with News, so content and permission edge cases can be verified before moving on.
        </p>
      </div>
    </div>
  );
}
