"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured, SUPER_ADMIN_EMAIL } from "@/lib/firebase/client";
import { userRepository } from "@/lib/firebase/userRepository";
import { UserDoc, CustomPermissions, ALL_PERMISSION_KEYS } from "@/lib/types/auth";

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  userDoc: UserDoc | null;
  loading: boolean;
  isSuperAdmin: boolean;
  hasPermission: (key: keyof CustomPermissions) => boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function emptyPermissions(allGranted: boolean): CustomPermissions {
  return ALL_PERMISSION_KEYS.reduce((acc, key) => {
    acc[key] = allGranted;
    return acc;
  }, {} as CustomPermissions);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  const isSuperAdmin = !!(user?.email && SUPER_ADMIN_EMAIL && user.email.toLowerCase() === SUPER_ADMIN_EMAIL);

  const syncUserProfile = async (currentUser: AuthUser) => {
    const dbDoc = await userRepository.getUser(currentUser.uid);
    if (dbDoc) {
      setUserDoc(dbDoc);
      return;
    }

    const isSuper = !!(SUPER_ADMIN_EMAIL && currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL);
    const now = new Date().toISOString();

    const newProfile: UserDoc = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      status: "pending",
      permissions: emptyPermissions(false),
      temporaryAccessExpiry: null,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser.uid,
      updatedBy: currentUser.uid,
      statusChangedBy: null,
      statusChangedAt: null,
      rejectionReason: null,
    };

    await userRepository.createUser(newProfile);

    // The super admin bootstraps itself: security rules already grant it every
    // permission implicitly, so immediately promoting the local doc to
    // approved+all-permissions here just keeps the UI honest with what the
    // rules already allow — it is not a bypass.
    if (isSuper) {
      const approvedUpdate: Partial<UserDoc> = {
        status: "approved",
        permissions: emptyPermissions(true),
        statusChangedBy: "SYSTEM",
        statusChangedAt: now,
        updatedAt: now,
      };
      await userRepository.updateUser(currentUser.uid, approvedUpdate);
      setUserDoc({ ...newProfile, ...approvedUpdate } as UserDoc);
      return;
    }

    setUserDoc(newProfile);
  };

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        const clientUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Staff Member",
          photoURL: firebaseUser.photoURL || null,
        };
        setUser(clientUser);
        try {
          await syncUserProfile(clientUser);
        } catch (err) {
          console.error("Failed to sync admin profile document:", err);
          setUserDoc(null);
        }
      } else {
        setUser(null);
        setUserDoc(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      // onAuthStateChanged above picks up the resulting session.
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserDoc(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await syncUserProfile(user);
    }
  };

  const hasPermission = (key: keyof CustomPermissions): boolean => {
    if (isSuperAdmin) return true;
    if (!userDoc || userDoc.status !== "approved") return false;

    if (userDoc.temporaryAccessExpiry) {
      if (Date.now() > new Date(userDoc.temporaryAccessExpiry).getTime()) return false;
    }

    return !!userDoc.permissions[key];
  };

  return (
    <AuthContext.Provider
      value={{ user, userDoc, loading, isSuperAdmin, hasPermission, loginWithGoogle, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be called within an AuthProvider");
  return context;
}
