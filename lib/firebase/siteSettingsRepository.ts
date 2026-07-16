import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./client";
import { Hero, Statistic } from "@/lib/data";

const HERO_DOC = ["siteSettings", "hero"] as const;
const STATISTICS_DOC = ["siteSettings", "statistics"] as const;

// Single settings documents, not content lists — no draft/published status,
// no per-item CRUD. Saving writes straight to the live doc.
export const siteSettingsRepository = {
  async getHero(): Promise<Hero | null> {
    const snap = await getDoc(doc(db, ...HERO_DOC));
    return snap.exists() ? (snap.data() as Hero) : null;
  },

  async saveHero(hero: Hero): Promise<void> {
    await setDoc(doc(db, ...HERO_DOC), hero);
  },

  async getStatistics(): Promise<Statistic[] | null> {
    const snap = await getDoc(doc(db, ...STATISTICS_DOC));
    return snap.exists() ? (snap.data().items as Statistic[]) : null;
  },

  async saveStatistics(items: Statistic[]): Promise<void> {
    await setDoc(doc(db, ...STATISTICS_DOC), { items });
  },
};
