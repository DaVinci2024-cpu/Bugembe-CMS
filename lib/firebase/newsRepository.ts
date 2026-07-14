import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./client";
import { NewsArticle } from "@/lib/data";

const COLLECTION = "news";

// Firestore doc ID doubles as NewsArticle.id — it's not duplicated inside the
// stored fields (also keeps documents in line with firestore.rules' schema).
type NewsArticleFields = Omit<NewsArticle, "id">;

export const newsRepository = {
  async list(): Promise<NewsArticle[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ ...(d.data() as NewsArticleFields), id: d.id }));
  },

  async get(id: string): Promise<NewsArticle | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { ...(snap.data() as NewsArticleFields), id: snap.id } : null;
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
