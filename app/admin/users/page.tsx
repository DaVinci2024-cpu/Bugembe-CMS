"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, ShieldCheck } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { userRepository } from "@/lib/firebase/userRepository";
import { UserDoc, UserStatus, AdminActivityLog } from "@/lib/types/auth";
import { PERMISSION_LABELS } from "@/lib/permission-labels";
import { UserDetailModal } from "@/components/admin/users/user-detail-modal";
import { useAuth } from "@/components/admin/auth-provider";
import { SUPER_ADMIN_EMAIL } from "@/lib/firebase/client";

const STATUS_FILTERS: { id: UserStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "suspended", label: "Suspended" },
  { id: "revoked", label: "Revoked" },
  { id: "rejected", label: "Rejected" },
];

const STATUS_BADGE_CLASS: Record<UserStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  suspended: "bg-orange-100 text-orange-700",
  revoked: "bg-rose-100 text-rose-700",
  rejected: "bg-slate-200 text-slate-600",
};

const ACTION_LABELS: Record<AdminActivityLog["action"], string> = {
  approve_user: "Approved",
  reject_user: "Rejected",
  suspend_user: "Suspended",
  revoke_access: "Revoked Access",
  update_permissions: "Updated Permissions",
};

function UsersList() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState<"users" | "logs">("users");
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("pending");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDoc | null>(null);

  const loadUsers = async () => {
    try {
      const result = await userRepository.listUsers();
      setUsers(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const result = await userRepository.listLogs();
      setLogs(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState only runs after the await
    loadUsers();
    loadLogs();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users
      .filter((u) => statusFilter === "all" || u.status === statusFilter)
      .filter((u) => !query || u.displayName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [users, statusFilter, search]);

  const pendingCount = users.filter((u) => u.status === "pending").length;

  const permissionSummary = (u: UserDoc): string => {
    if (SUPER_ADMIN_EMAIL && u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) return "All (Super Admin)";
    const granted = Object.entries(u.permissions)
      .filter(([, v]) => v)
      .map(([k]) => PERMISSION_LABELS[k as keyof typeof PERMISSION_LABELS]);
    return granted.length === 0 ? "None" : granted.length <= 2 ? granted.join(", ") : `${granted.length} modules`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">User Permissions</h2>
        <p className="text-xs text-slate-500 mt-0.5">Approve pending sign-ins, assign per-module permissions, and review the audit log.</p>
      </div>

      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setTab("users")}
          className={`pb-2.5 px-1 text-xs font-bold border-b-2 cursor-pointer flex items-center gap-1.5 ${
            tab === "users" ? "border-[#0c2340] text-[#0c2340]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Users
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700">{pendingCount}</span>
          )}
        </button>
        <button
          onClick={() => setTab("logs")}
          className={`pb-2.5 px-1 text-xs font-bold border-b-2 cursor-pointer ${
            tab === "logs" ? "border-[#0c2340] text-[#0c2340]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Activity Log
        </button>
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      {tab === "users" && (
        <>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#0c2340] focus:ring-2 focus:ring-[#0c2340]/10"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                    statusFilter === f.id ? "bg-[#0c2340] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-xs text-slate-400">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-500">No users match this filter.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-500 text-[10.5px]">
                    <th className="p-3">User</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Permissions</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isSelf = currentUser?.uid === u.uid;
                    const isSuper = !!(SUPER_ADMIN_EMAIL && u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
                    return (
                      <tr key={u.uid} className="hover:bg-slate-50/60">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              {u.photoURL && (
                                <Image src={u.photoURL} alt="" fill className="object-cover" unoptimized referrerPolicy="no-referrer" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate flex items-center gap-1">
                                {u.displayName}
                                {isSuper && <ShieldCheck className="w-3 h-3 text-[#d4af37]" />}
                              </p>
                              <p className="text-slate-400 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_BADGE_CLASS[u.status]}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{permissionSummary(u)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedUser(u)}
                            disabled={isSelf || isSuper}
                            title={isSuper ? "Super admin permissions can't be changed here" : isSelf ? "You can't manage your own account" : "Manage"}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold rounded text-[10.5px] cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {tab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {logsLoading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading activity log...</div>
          ) : logs.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">No admin actions logged yet.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-500 text-[10.5px]">
                  <th className="p-3">When</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target User</th>
                  <th className="p-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="p-3 text-slate-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-3 text-slate-600">{log.adminEmail}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {ACTION_LABELS[log.action]}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{log.targetUserEmail}</td>
                    <td className="p-3 text-slate-400">{log.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedUser && (
        <UserDetailModal
          target={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSaved={() => {
            setSelectedUser(null);
            loadUsers();
            loadLogs();
          }}
        />
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ModuleGate permission="users">
      <UsersList />
    </ModuleGate>
  );
}
