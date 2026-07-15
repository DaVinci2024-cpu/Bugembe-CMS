import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, deleteDoc, FirestoreError } from "firebase/firestore";
import { db } from "./client";
import { NewsArticle } from "@/lib/data";

const COLLECTION = "news";

// Firestore doc ID doubles as NewsArticle.id — it's not duplicated inside the
// stored fields (also keeps documents in line with firestore.rules' schema).
type NewsArticleFields = Omit<NewsArticle, "id">;

function isPermissionDenied(err: unknown): boolean {
  return err instanceof FirestoreError && err.code === "permission-denied";
}

export const newsRepository = {
  // Admin use only — returns every article regardless of status. Public
  // callers hitting this would get a permission-denied error from
  // firestore.rules, since it can't prove an unfiltered query only
  // returns published docs.
  async list(): Promise<NewsArticle[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ ...(d.data() as NewsArticleFields), id: d.id }));
  },

  // Public pages use this — the explicit where() is what lets
  // firestore.rules verify the query can only return published articles.
  async listPublished(): Promise<NewsArticle[]> {
    const snap = await getDocs(query(collection(db, COLLECTION), where("status", "==", "published")));
    return snap.docs.map((d) => ({ ...(d.data() as NewsArticleFields), id: d.id }));
  },

  // Works for both admin (any status) and public (published only) callers —
  // firestore.rules enforces the distinction. A public caller requesting a
  // draft (or a truly nonexistent doc) gets permission-denied, which we
  // treat the same as "not found" rather than surfacing a scary error.
  async get(id: string): Promise<NewsArticle | null> {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      return snap.exists() ? { ...(snap.data() as NewsArticleFields), id: snap.id } : null;
    } catch (err) {
      if (isPermissionDenied(err)) return null;
      throw err;
    }
  },

  async create(id: string, fields: NewsArticleFields): Promise<void> {
    await setDoc(doc(db, COLLECTION, id), fields);
  },

  async update(id: string, updates: Partial<NewsArticleFields>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), updates);
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
