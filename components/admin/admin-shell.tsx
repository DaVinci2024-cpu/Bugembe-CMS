"use client";

import { useAuth } from "@/components/admin/auth-provider";
import { LoginScreen } from "@/components/admin/login-screen";
import { WaitingRoom } from "@/components/admin/waiting-room";
import { Sidebar } from "@/components/admin/sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, userDoc, loading } = useAuth();

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
    <div className="min-h-screen bg-[#f7f7f5] flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-6 flex-1 overflow-y-auto w-full max-w-[1400px] mx-auto space-y-6">{children}</main>
      </div>
    </div>
  );
}
