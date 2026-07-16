"use client";

import { useState } from "react";
import { X, Check, Ban, RotateCcw, ShieldOff, Clock } from "lucide-react";
import { UserDoc, UserStatus, CustomPermissions, ALL_PERMISSION_KEYS, AdminActivityLog } from "@/lib/types/auth";
import { PERMISSION_LABELS } from "@/lib/permission-labels";
import { userRepository } from "@/lib/firebase/userRepository";
import { useAuth } from "@/components/admin/auth-provider";

function emptyPermissions(allGranted: boolean): CustomPermissions {
  return ALL_PERMISSION_KEYS.reduce((acc, key) => {
    acc[key] = allGranted;
    return acc;
  }, {} as CustomPermissions);
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] outline-none";

export function UserDetailModal({
  target,
  onClose,
  onSaved,
}: {
  target: UserDoc;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user: currentUser } = useAuth();
  const [permissions, setPermissions] = useState<CustomPermissions>(target.permissions);
  const [reason, setReason] = useState("");
  const [expiry, setExpiry] = useState(target.temporaryAccessExpiry ? target.temporaryAccessExpiry.slice(0, 10) : "");
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSelf = currentUser?.uid === target.uid;

  const applyChange = async (newStatus: UserStatus, actionKey: string, action: AdminActivityLog["action"]) => {
    if (!currentUser) return;
    setSaving(actionKey);
    setError(null);
    try {
      const now = new Date().toISOString();
      const previousState = { status: target.status, permissions: target.permissions };
      const newPermissions = newStatus === "approved" || target.status === "approved" ? permissions : target.permissions;
      const updates: Partial<UserDoc> = {
        status: newStatus,
        permissions: newPermissions,
        temporaryAccessExpiry: expiry ? new Date(expiry).toISOString() : null,
        statusChangedBy: currentUser.uid,
        statusChangedAt: now,
        updatedAt: now,
        updatedBy: currentUser.uid,
        rejectionReason: newStatus === "rejected" ? reason || null : null,
      };
      await userRepository.updateUser(target.uid, updates);
      await userRepository.createLog({
        adminUid: currentUser.uid,
        adminEmail: currentUser.email,
        targetUserUid: target.uid,
        targetUserEmail: target.email,
        action,
        previousState,
        newState: { status: newStatus, permissions: newPermissions },
        reason: reason || null,
      });
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setSaving(null);
    }
  };

  const handleSavePermissions = () => applyChange(target.status, "save", "update_permissions");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{target.displayName}</h3>
            <p className="text-xs text-slate-500">{target.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {isSelf && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              You can&apos;t change your own status or permissions here — ask another admin.
            </div>
          )}
          {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Current Status</p>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
              {target.status}
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Module Permissions</p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_PERMISSION_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={permissions[key]}
                    disabled={isSelf}
                    onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                    className="accent-[#0c2340]"
                  />
                  {PERMISSION_LABELS[key]}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Temporary Access Expiry <span className="font-normal normal-case text-slate-400">(optional)</span>
            </p>
            <input type="date" className={inputClass} value={expiry} disabled={isSelf} onChange={(e) => setExpiry(e.target.value)} />
          </div>

          {(target.status === "pending" || target.status === "suspended" || target.status === "revoked") && (
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Reason <span className="font-normal normal-case text-slate-400">(optional, logged)</span></p>
              <textarea rows={2} className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} disabled={isSelf} />
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {target.status === "pending" && (
              <>
                <button
                  disabled={isSelf || !!saving}
                  onClick={() => applyChange("approved", "approve", "approve_user")}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {saving === "approve" ? "Approving..." : "Approve with these permissions"}
                </button>
                <button
                  disabled={isSelf || !!saving}
                  onClick={() => applyChange("rejected", "reject", "reject_user")}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-50 text-rose-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  {saving === "reject" ? "Rejecting..." : "Reject"}
                </button>
              </>
            )}

            {target.status === "approved" && (
              <>
                <button
                  disabled={isSelf || !!saving}
                  onClick={handleSavePermissions}
                  className="px-3.5 py-2 bg-[#0c2340] hover:bg-[#0b1c3c] disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {saving === "save" ? "Saving..." : "Save Permissions"}
                </button>
                <button
                  disabled={isSelf || !!saving}
                  onClick={() => applyChange("suspended", "suspend", "suspend_user")}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 disabled:opacity-50 text-amber-800 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldOff className="w-3.5 h-3.5" />
                  {saving === "suspend" ? "Suspending..." : "Suspend"}
                </button>
                <button
                  disabled={isSelf || !!saving}
                  onClick={() => applyChange("revoked", "revoke", "revoke_access")}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-50 text-rose-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  {saving === "revoke" ? "Revoking..." : "Revoke Access"}
                </button>
              </>
            )}

            {(target.status === "suspended" || target.status === "revoked" || target.status === "rejected") && (
              <button
                disabled={isSelf || !!saving}
                onClick={() => applyChange("approved", "reactivate", "approve_user")}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {saving === "reactivate" ? "Reactivating..." : "Reactivate with these permissions"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
