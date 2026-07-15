import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./client";
import { AlumniProfile } from "@/lib/data";

const COLLECTION = "alumni";

type AlumniProfileFields = Omit<AlumniProfile, "id">;

// Unlike the other content modules, there's no draft/published split here —
// firestore.rules already allows public read of both pending and approved
// profiles (the public page shows pending submissions too, just badged
// "Awaiting Admin Validation"), so a single list() serves both audiences.
export const alumniRepository = {
  async list(): Promise<AlumniProfile[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ ...(d.data() as AlumniProfileFields), id: d.id }));
  },

  async get(id: string): Promise<AlumniProfile | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { ...(snap.data() as AlumniProfileFields), id: snap.id } : null;
  },

  // Public self-submission — firestore.rules forces status/featured
  // regardless of what's passed, but we set them explicitly here too so
  // the local optimistic-update copy matches what actually gets stored.
  async create(id: string, fields: AlumniProfileFields): Promise<void> {
    await setDoc(doc(db, COLLECTION, id), fields);
  },

  async update(id: string, updates: Partial<AlumniProfileFields>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), updates);
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
