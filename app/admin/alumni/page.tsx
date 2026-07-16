"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, UploadCloud, Check, Star, Search, StarOff } from "lucide-react";
import { ModuleGate } from "@/components/admin/module-gate";
import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { initialAlumniProfiles as staticAlumni, AlumniProfile } from "@/lib/data";
import { SpotlightForm } from "@/components/admin/alumni/spotlight-form";
import { CommunityGroupsForm } from "@/components/admin/alumni/community-groups-form";

const HOMEPAGE_CAROUSEL_LIMIT = 5;

const PAGE_TABS = [
  { id: "directory", label: "Directory" },
  { id: "spotlight", label: "Alumni Spotlight" },
  { id: "groups", label: "Community Groups" },
] as const;

type PageTabId = (typeof PAGE_TABS)[number]["id"];

function AlumniList() {
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"pending" | "approved" | "featured">("pending");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  const load = async () => {
    try {
      const result = await alumniRepository.list();
      setProfiles(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load alumni profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  // Computed from the full unfiltered list, so the dropdown always offers
  // every cohort on record regardless of the current search/tab state.
  const availableYears = useMemo(
    () => [...new Set(profiles.map((p) => p.graduationYear))].sort((a, b) => b - a),
    [profiles]
  );

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchesSearch =
        !query ||
        p.fullName.toLowerCase().includes(query) ||
        p.profession.toLowerCase().includes(query) ||
        p.organization.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query);
      const matchesYear = yearFilter === "all" || String(p.graduationYear) === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [profiles, search, yearFilter]);

  const pending = useMemo(() => filteredProfiles.filter((p) => p.status === "pending"), [filteredProfiles]);
  const approved = useMemo(() => filteredProfiles.filter((p) => p.status === "approved"), [filteredProfiles]);
  // Sorted to match the homepage carousel's own ordering (most recent cohort
  // first), so this list previews exactly what visitors will see.
  const featured = useMemo(
    () =>
      filteredProfiles
        .filter((p) => p.featured && p.status === "approved")
        .sort((a, b) => b.graduationYear - a.graduationYear),
    [filteredProfiles]
  );
  const visible = tab === "pending" ? pending : tab === "approved" ? approved : featured;

  const handleApprove = async (id: string) => {
    try {
      await alumniRepository.update(id, { status: "approved" });
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to approve profile.");
    }
  };

  const handleToggleFeatured = async (id: string, nextFeatured: boolean) => {
    try {
      await alumniRepository.update(id, { featured: nextFeatured });
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to update featured status.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await alumniRepository.remove(id);
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to delete profile.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      for (const { id, ...fields } of staticAlumni) {
        await alumniRepository.create(id, fields);
      }
      await load();
    } catch (err) {
      console.error(err);
      window.alert("Failed to import the sample profiles.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Alumni Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Approve public submissions and manage the alumni directory.</p>
        </div>
        <Link
          href="/admin/alumni/new"
          className="px-4 py-2 bg-[#0c2340] hover:bg-[#0b1c3c] text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          New Profile
        </Link>
      </div>

      {error && <div className="text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}

      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setTab("pending")}
          className={`pb-2.5 px-1 text-xs font-bold border-b-2 cursor-pointer flex items-center gap-1.5 ${
            tab === "pending" ? "border-[#0c2340] text-[#0c2340]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Pending Review
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${pending.length > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
            {pending.length}
          </span>
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`pb-2.5 px-1 text-xs font-bold border-b-2 cursor-pointer flex items-center gap-1.5 ${
            tab === "approved" ? "border-[#0c2340] text-[#0c2340]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Approved Directory
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500">{approved.length}</span>
        </button>
        <button
          onClick={() => setTab("featured")}
          className={`pb-2.5 px-1 text-xs font-bold border-b-2 cursor-pointer flex items-center gap-1.5 ${
            tab === "featured" ? "border-[#0c2340] text-[#0c2340]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Featured on Homepage
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700">{featured.length}</span>
        </button>
      </div>

      {profiles.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, profession, organization, or email..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#0c2340] focus:ring-2 focus:ring-[#0c2340]/10"
            />
          </div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0c2340] focus:ring-2 focus:ring-[#0c2340]/10 cursor-pointer"
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={String(year)}>
                Class of {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {tab === "featured" && featured.length > HOMEPAGE_CAROUSEL_LIMIT && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          {featured.length} profiles are featured, but the homepage carousel only shows the {HOMEPAGE_CAROUSEL_LIMIT} most recent
          graduating cohorts. The ones below with a faded star aren&apos;t currently making the cut — unfeature older ones to swap them
          out.
        </div>
      )}

      {tab === "featured" ? (
        loading ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-white border border-slate-200 rounded-xl">Loading alumni...</div>
        ) : featured.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-xl">
            No profiles are featured yet. Check &quot;Feature this profile&quot; on any approved alumnus to spotlight them on the
            homepage.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p, i) => {
              const onHomepage = i < HOMEPAGE_CAROUSEL_LIMIT;
              return (
                <div
                  key={p.id}
                  className={`bg-white border rounded-xl shadow-xs p-4 flex flex-col gap-3 ${
                    onHomepage ? "border-amber-300" : "border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image src={p.photo} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-sm truncate">{p.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {p.profession} • Class of {p.graduationYear}
                      </p>
                    </div>
                    <Star className={`w-4 h-4 shrink-0 ${onHomepage ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.bio}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleFeatured(p.id, false)}
                      className="text-[10.5px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                    >
                      <StarOff className="w-3.5 h-3.5" />
                      Unfeature
                    </button>
                    <Link
                      href={`/admin/alumni/${p.id}`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10.5px] flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading alumni...</div>
          ) : profiles.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <p className="text-xs text-slate-500">No alumni profiles yet.</p>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 mx-auto cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                {seeding ? "Importing..." : "Import the 3 existing sample profiles"}
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">Nothing here right now.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-500 text-[10.5px]">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Profession</th>
                  <th className="p-3">Year</th>
                  <th className="p-3"></th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="p-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                        <Image src={p.photo} alt="" fill className="object-cover" unoptimized />
                      </div>
                    </td>
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{p.fullName}</td>
                    <td className="p-3 text-slate-500">{p.profession}</td>
                    <td className="p-3 text-slate-500">{p.graduationYear}</td>
                    <td className="p-3">{p.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        {p.status === "pending" && (
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded text-[10.5px] flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </button>
                        )}
                        <Link href={`/admin/alumni/${p.id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.fullName)}
                          className="p-1.5 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function AdminAlumniContent() {
  const [pageTab, setPageTab] = useState<PageTabId>("directory");

  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 gap-1">
        {PAGE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setPageTab(t.id)}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer ${
              pageTab === t.id ? "border-[#0c2340] text-[#0c2340]" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {pageTab === "directory" && <AlumniList />}
      {pageTab === "spotlight" && <SpotlightForm />}
      {pageTab === "groups" && <CommunityGroupsForm />}
    </div>
  );
}

export default function AdminAlumniPage() {
  return (
    <ModuleGate permission="alumni">
      <AdminAlumniContent />
    </ModuleGate>
  );
}
