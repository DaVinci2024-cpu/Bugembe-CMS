import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, deleteDoc, FirestoreError } from "firebase/firestore";
import { db } from "./client";
import { GalleryItem } from "@/lib/data";
import { revalidatePublicSite } from "@/lib/actions/revalidate";

const COLLECTION = "gallery";

type GalleryItemFields = Omit<GalleryItem, "id">;

function isPermissionDenied(err: unknown): boolean {
  return err instanceof FirestoreError && err.code === "permission-denied";
}

export const galleryRepository = {
  // Admin use only — every item regardless of status.
  async list(): Promise<GalleryItem[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ ...(d.data() as GalleryItemFields), id: d.id }));
  },

  // Public pages use this — the explicit where() is what lets
  // firestore.rules verify the query can only return published items.
  async listPublished(): Promise<GalleryItem[]> {
    const snap = await getDocs(query(collection(db, COLLECTION), where("status", "==", "published")));
    return snap.docs.map((d) => ({ ...(d.data() as GalleryItemFields), id: d.id }));
  },

  async get(id: string): Promise<GalleryItem | null> {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      return snap.exists() ? { ...(snap.data() as GalleryItemFields), id: snap.id } : null;
    } catch (err) {
      if (isPermissionDenied(err)) return null;
      throw err;
    }
  },

  async create(id: string, fields: GalleryItemFields): Promise<void> {
    await setDoc(doc(db, COLLECTION, id), fields);
    await revalidatePublicSite();
  },

  async update(id: string, updates: Partial<GalleryItemFields>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), updates);
    await revalidatePublicSite();
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
    await revalidatePublicSite();
  },
};
