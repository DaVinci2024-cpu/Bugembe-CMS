"use client";

import { Hourglass, ShieldAlert, XCircle, Lock, LogOut, Clock } from "lucide-react";
import { useAuth } from "@/components/admin/auth-provider";

export function WaitingRoom() {
  const { userDoc, logout } = useAuth();

  if (!userDoc) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-xs text-slate-400">
        Loading your profile...
      </div>
    );
  }

  const status = userDoc.status;

  const view = (() => {
    switch (status) {
      case "pending":
        return {
          title: "Registration Pending Review",
          description:
            "Your account has been created and is waiting for a super admin to approve it and assign module permissions. You'll be able to sign in normally once approved.",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Hourglass,
          iconBg: "bg-amber-50 text-amber-600 border border-amber-200",
        };
      case "suspended":
        return {
          title: "Access Suspended",
          description: "Your account has been temporarily suspended by an administrator. Contact your super admin for details.",
          badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
          icon: ShieldAlert,
          iconBg: "bg-rose-50 text-rose-600 border border-rose-200",
        };
      case "rejected":
        return {
          title: "Registration Not Approved",
          description: "Your request for admin access was not approved. Review the reason below or contact your super admin.",
          badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
          icon: XCircle,
          iconBg: "bg-slate-50 text-slate-600 border border-slate-200",
        };
      case "revoked":
      default:
        return {
          title: "Access Revoked",
          description: "Your admin access has been revoked. If you believe this is a mistake, contact your super admin.",
          badgeColor: "bg-gray-100 text-gray-800 border-gray-300",
          icon: Lock,
          iconBg: "bg-gray-50 text-gray-600 border border-gray-200",
        };
    }
  })();

  const Icon = view.icon;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 md:p-6 relative">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100/50 p-6 md:p-8 space-y-6 text-center">
        <div className={`w-14 h-14 rounded-2xl ${view.iconBg} flex items-center justify-center mx-auto shadow-md`}>
          <Icon className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{view.title}</h2>
          <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${view.badgeColor}`}>
            Status: {status}
          </span>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto pt-1">{view.description}</p>
        </div>

        {status === "rejected" && userDoc.rejectionReason && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-rose-500 block">Admin notes:</span>
            <blockquote className="text-slate-600 italic font-medium leading-relaxed bg-white border-l-2 border-slate-300 p-2.5 rounded">
              &ldquo;{userDoc.rejectionReason}&rdquo;
            </blockquote>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left text-[11px] space-y-2 font-mono">
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-400">Account:</span>
            <span className="text-slate-900 font-bold">{userDoc.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Requested at:</span>
            <span className="text-slate-500">{new Date(userDoc.createdAt).toISOString().slice(0, 10)}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 bg-[#0c2340] hover:bg-[#0b1c3c] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>

        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Once your status changes, sign out and back in to refresh access.
        </p>
      </div>
    </div>
  );
}
