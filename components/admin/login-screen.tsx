"use client";

import { ShieldCheck, Lock, School } from "lucide-react";
import { useAuth } from "@/components/admin/auth-provider";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export function LoginScreen() {
  const { loginWithGoogle, loading } = useAuth();

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Admin console not configured</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Firebase environment variables are missing. Set the <code className="bg-slate-100 px-1 rounded">NEXT_PUBLIC_FIREBASE_*</code> keys
            (see <code className="bg-slate-100 px-1 rounded">.env.example</code>) before the admin panel can be used.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0c2340]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4af37]/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100/50 p-6 md:p-8 space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0c2340] flex items-center justify-center text-[#d4af37] font-extrabold text-2xl shadow-lg">
            B
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-1.5 mt-2">
              Bugembe Admin Console
            </h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 mt-1">
              <School className="w-3.5 h-3.5 text-[#0c2340] shrink-0" />
              Bugembe Islamic Institute
            </p>
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 space-y-2 text-[11.5px] text-slate-600">
          <div className="flex gap-2.5 items-start">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>New sign-ins are held for review until a super admin approves your account and assigns permissions.</p>
          </div>
          <div className="flex gap-2.5 items-start">
            <Lock className="w-4 h-4 text-[#0c2340] shrink-0 mt-0.5" />
            <p>Access is scoped per module — you will only see the sections you have been granted.</p>
          </div>
        </div>

        <button
          onClick={() => loginWithGoogle()}
          disabled={loading}
          className="w-full py-3 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition active:scale-[0.99] shadow-md cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          Continue with Google
        </button>
      </div>
    </div>
  );
}
