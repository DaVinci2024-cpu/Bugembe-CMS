import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./client";
import { AdmissionsContent } from "@/lib/data";
import { revalidatePublicSite } from "@/lib/actions/revalidate";

const DOC_PATH = ["admissionsContent", "main"] as const;

// Single settings document, not a content list — no draft/published status,
// no per-item CRUD. Saving writes straight to the live doc.
export const admissionsRepository = {
  async get(): Promise<AdmissionsContent | null> {
    const snap = await getDoc(doc(db, ...DOC_PATH));
    return snap.exists() ? (snap.data() as AdmissionsContent) : null;
  },

  async save(content: AdmissionsContent): Promise<void> {
    await setDoc(doc(db, ...DOC_PATH), content);
    await revalidatePublicSite();
  },
};
