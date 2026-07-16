import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./client";
import { AboutContent } from "@/lib/data";
import { revalidatePublicSite } from "@/lib/actions/revalidate";

const DOC_PATH = ["aboutPage", "main"] as const;

// Single settings document, not a content list — no draft/published status,
// no per-item CRUD. Saving writes straight to the live doc.
export const aboutRepository = {
  async get(): Promise<AboutContent | null> {
    const snap = await getDoc(doc(db, ...DOC_PATH));
    return snap.exists() ? (snap.data() as AboutContent) : null;
  },

  async save(content: AboutContent): Promise<void> {
    await setDoc(doc(db, ...DOC_PATH), content);
    await revalidatePublicSite();
  },
};
