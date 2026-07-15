"use client";

import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export function ToolsAuthWrapper({ children }: { children: React.ReactNode }) {
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isFirebaseConfigured()) {
      setAuthChecking(false);
      return;
    }

    const auth = getFirebaseAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous auth failed:", error);
        });
      } else {
        setAuthChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Soft block until user token is verified to prevent database read permissions errors
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Authenticating Secure Connection...</p>
      </div>
    );
  }

  return <>{children}</>;
}
