import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, deleteDoc, FirestoreError } from "firebase/firestore";
import { db } from "./client";
import { Program } from "@/lib/data";

const COLLECTION = "programs";

type ProgramFields = Omit<Program, "id">;

function isPermissionDenied(err: unknown): boolean {
  return err instanceof FirestoreError && err.code === "permission-denied";
}

export const programsRepository = {
  // Admin use only — every program regardless of status.
  async list(): Promise<Program[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ ...(d.data() as ProgramFields), id: d.id }));
  },

  // Public pages use this — the explicit where() is what lets
  // firestore.rules verify the query can only return published programs.
  async listPublished(): Promise<Program[]> {
    const snap = await getDocs(query(collection(db, COLLECTION), where("status", "==", "published")));
    return snap.docs.map((d) => ({ ...(d.data() as ProgramFields), id: d.id }));
  },

  async get(id: string): Promise<Program | null> {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      return snap.exists() ? { ...(snap.data() as ProgramFields), id: snap.id } : null;
    } catch (err) {
      if (isPermissionDenied(err)) return null;
      throw err;
    }
  },

  async create(id: string, fields: ProgramFields): Promise<void> {
    await setDoc(doc(db, COLLECTION, id), fields);
  },

  async update(id: string, updates: Partial<ProgramFields>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), updates);
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
