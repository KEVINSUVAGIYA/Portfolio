import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  );
}

let _db: Database | null = null;

export function getFirebaseDb(): Database {
  if (_db) return _db;
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Copy .env.local.example to .env.local and fill in your Firebase project values."
    );
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _db = getDatabase(app);
  return _db;
}
let _auth: Auth | null = null;
export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  if (!isFirebaseConfigured()) throw new Error("Firebase is not configured.");
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _auth = getAuth(app);
  return _auth;
}
