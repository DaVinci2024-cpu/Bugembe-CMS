import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "./client";
import { UserDoc, AdminActivityLog } from "@/lib/types/auth";

export const userRepository = {
  async getUser(uid: string): Promise<UserDoc | null> {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserDoc) : null;
  },

  async createUser(userDoc: UserDoc): Promise<void> {
    await setDoc(doc(db, "users", userDoc.uid), userDoc);
  },

  async updateUser(uid: string, updates: Partial<UserDoc>): Promise<void> {
    await updateDoc(doc(db, "users", uid), updates);
  },

  async listUsers(): Promise<UserDoc[]> {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map((d) => d.data() as UserDoc);
  },

  async createLog(log: Omit<AdminActivityLog, "id" | "createdAt">): Promise<void> {
    const fullLog: AdminActivityLog = {
      ...log,
      id: "log_" + Math.random().toString(36).slice(2, 11),
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, "adminActivityLogs"), fullLog);
  },

  async listLogs(): Promise<AdminActivityLog[]> {
    const snap = await getDocs(collection(db, "adminActivityLogs"));
    const logs = snap.docs.map((d) => d.data() as AdminActivityLog);
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
