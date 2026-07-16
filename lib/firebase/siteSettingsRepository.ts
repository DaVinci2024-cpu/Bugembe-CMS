import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./client";
import { Hero, Statistic, Branding, ContactInfo, WhatsAppDepartment, Advantage, Achievement } from "@/lib/data";
import { revalidatePublicSite } from "@/lib/actions/revalidate";

const HERO_DOC = ["siteSettings", "hero"] as const;
const STATISTICS_DOC = ["siteSettings", "statistics"] as const;
const BRANDING_DOC = ["siteSettings", "branding"] as const;
const HEADER_DOC = ["siteSettings", "header"] as const;
const CONTACT_DOC = ["siteSettings", "contact"] as const;
const WHATSAPP_DEPARTMENTS_DOC = ["siteSettings", "whatsappDepartments"] as const;
const ADVANTAGES_DOC = ["siteSettings", "advantages"] as const;
const ACHIEVEMENTS_DOC = ["siteSettings", "achievements"] as const;

// Single settings documents, not content lists — no draft/published status,
// no per-item CRUD. Saving writes straight to the live doc.
export const siteSettingsRepository = {
  async getHero(): Promise<Hero | null> {
    const snap = await getDoc(doc(db, ...HERO_DOC));
    return snap.exists() ? (snap.data() as Hero) : null;
  },

  async saveHero(hero: Hero): Promise<void> {
    await setDoc(doc(db, ...HERO_DOC), hero);
    await revalidatePublicSite();
  },

  async getStatistics(): Promise<Statistic[] | null> {
    const snap = await getDoc(doc(db, ...STATISTICS_DOC));
    return snap.exists() ? (snap.data().items as Statistic[]) : null;
  },

  async saveStatistics(items: Statistic[]): Promise<void> {
    await setDoc(doc(db, ...STATISTICS_DOC), { items });
    await revalidatePublicSite();
  },

  async getBranding(): Promise<Branding | null> {
    const snap = await getDoc(doc(db, ...BRANDING_DOC));
    return snap.exists() ? (snap.data() as Branding) : null;
  },

  async saveBranding(branding: Branding): Promise<void> {
    await setDoc(doc(db, ...BRANDING_DOC), branding);
    await revalidatePublicSite();
  },

  async getHeaderAnnouncements(): Promise<string[] | null> {
    const snap = await getDoc(doc(db, ...HEADER_DOC));
    return snap.exists() ? (snap.data().announcements as string[]) : null;
  },

  async saveHeaderAnnouncements(announcements: string[]): Promise<void> {
    await setDoc(doc(db, ...HEADER_DOC), { announcements });
    await revalidatePublicSite();
  },

  async getContact(): Promise<ContactInfo | null> {
    const snap = await getDoc(doc(db, ...CONTACT_DOC));
    return snap.exists() ? (snap.data() as ContactInfo) : null;
  },

  async saveContact(contact: ContactInfo): Promise<void> {
    await setDoc(doc(db, ...CONTACT_DOC), contact);
    await revalidatePublicSite();
  },

  async getWhatsAppDepartments(): Promise<WhatsAppDepartment[] | null> {
    const snap = await getDoc(doc(db, ...WHATSAPP_DEPARTMENTS_DOC));
    return snap.exists() ? (snap.data().items as WhatsAppDepartment[]) : null;
  },

  async saveWhatsAppDepartments(items: WhatsAppDepartment[]): Promise<void> {
    await setDoc(doc(db, ...WHATSAPP_DEPARTMENTS_DOC), { items });
    await revalidatePublicSite();
  },

  async getAdvantages(): Promise<Advantage[] | null> {
    const snap = await getDoc(doc(db, ...ADVANTAGES_DOC));
    return snap.exists() ? (snap.data().items as Advantage[]) : null;
  },

  async saveAdvantages(items: Advantage[]): Promise<void> {
    await setDoc(doc(db, ...ADVANTAGES_DOC), { items });
    await revalidatePublicSite();
  },

  async getAchievements(): Promise<Achievement[] | null> {
    const snap = await getDoc(doc(db, ...ACHIEVEMENTS_DOC));
    return snap.exists() ? (snap.data().items as Achievement[]) : null;
  },

  async saveAchievements(items: Achievement[]): Promise<void> {
    await setDoc(doc(db, ...ACHIEVEMENTS_DOC), { items });
    await revalidatePublicSite();
  },
};
