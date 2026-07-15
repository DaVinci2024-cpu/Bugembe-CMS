"use client";

import { use, useEffect, useState } from "react";
import { ModuleGate } from "@/components/admin/module-gate";
import { AlumniForm } from "@/components/admin/alumni/alumni-form";
import { alumniRepository } from "@/lib/firebase/alumniRepository";
import { AlumniProfile } from "@/lib/data";

export default function EditAlumniPage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = use(params);
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    alumniRepository
      .get(profileId)
      .then((result) => {
        if (cancelled) return;
        if (!result) setNotFound(true);
        else setProfile(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return (
    <ModuleGate permission="alumni">
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Edit Alumni Profile</h2>
        {loading && <p className="text-xs text-slate-400">Loading profile...</p>}
        {notFound && <p className="text-xs text-rose-600">Profile not found.</p>}
        {profile && <AlumniForm existing={profile} />}
      </div>
    </ModuleGate>
  );
}
