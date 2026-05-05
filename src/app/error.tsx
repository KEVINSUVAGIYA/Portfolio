"use client";

import { useEffect } from "react";
import { WifiOff, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global app error:", error);
  }, [error]);

  const isNetworkError = 
    !navigator.onLine || 
    error.message.includes("fetch") || 
    error.message.toLowerCase().includes("network") ||
    error.message.includes("Load chunk");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-6 shadow-xl shadow-slate-950/50">
        {isNetworkError ? (
          <WifiOff className="w-8 h-8 text-slate-500" />
        ) : (
          <span className="text-3xl">⚠️</span>
        )}
      </div>
      
      <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
        {isNetworkError ? "Connection Lost" : "Something went wrong!"}
      </h2>
      
      <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        {isNetworkError 
          ? "It looks like you're offline or having network issues. Please check your connection and try again." 
          : "An unexpected error occurred while rendering this page. We're sorry for the inconvenience."}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => {
            if (isNetworkError && navigator.onLine) {
              router.refresh();
            } else {
              reset();
            }
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-cyan-500/25"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
      
      {/* Hide exact error details from normal users, but keep for debugging if needed */}
      <p className="mt-12 text-[10px] text-slate-700 font-mono">
        {error.message || "Unknown Error"}
      </p>
    </div>
  );
}
