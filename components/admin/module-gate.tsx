"use client";

import { LockKeyhole } from "lucide-react";
import { useAuth } from "@/components/admin/auth-provider";
import { CustomPermissions } from "@/lib/types/auth";

// Defense in depth: the sidebar already hides links a user can't see, but a
// direct URL visit should still be turned away at the page level.
export function ModuleGate({
  permission,
  children,
}: {
  permission: keyof CustomPermissions;
  children: React.ReactNode;
}) {
  const { isSuperAdmin, hasPermission } = useAuth();

  if (!isSuperAdmin && !hasPermission(permission)) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <LockKeyhole className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Access Denied</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your account does not have the <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">{permission}</code> permission.
            Ask your super admin to grant it from User Permissions.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
