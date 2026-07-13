import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// True once real Firebase project credentials are present. Used only to show a
// setup-needed screen instead of letting Auth/Firestore calls fail cryptically —
// there is no mock/localStorage data mode behind this flag.
export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// Must match the super admin account literal hardcoded into firestore.rules
// (Firestore rules can't read env vars, so both must be updated together).
export const SUPER_ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || ""
).toLowerCase();

let auth: Auth;
let db: Firestore;

// getAuth() validates the apiKey and throws immediately if it isn't real —
// even a syntactically-plausible placeholder trips it — which would crash
// the whole /admin route (and the build) before isFirebaseConfigured ever
// gets a chance to show the setup-needed screen. So skip initializing the
// SDK entirely when unconfigured; every call site (AuthProvider, LoginScreen)
// already checks isFirebaseConfigured before touching auth/db, so these
// bindings are never dereferenced in that state.
if (isFirebaseConfigured) {
  const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  auth = undefined as unknown as Auth;
  db = undefined as unknown as Firestore;
}

export { auth, db };
