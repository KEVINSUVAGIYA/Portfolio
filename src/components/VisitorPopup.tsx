"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Send, Loader2, Sparkles } from "lucide-react";

const STORAGE_KEY = "ks_visitor_done";

const greetings = [
  { line1: "Hey, you! 👋", line2: "Glad you stopped by." },
  { line1: "Oh, a visitor! 🎉", line2: "This genuinely made my day." },
  { line1: "Hello there! ✨", line2: "Welcome to my little corner." },
  { line1: "You found me! 🙌", line2: "Hope you're enjoying it." },
];

type Phase = "idle" | "bubble" | "collapsed" | "form" | "success";

export function VisitorPopup() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collapseTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Use localStorage so it persists across page reloads/sessions
    if (localStorage.getItem(STORAGE_KEY)) return;

    const showTimer = setTimeout(() => {
      setPhase("bubble");

      // Auto-collapse after 8s if user doesn't interact
      collapseTimer.current = setTimeout(() => setPhase("collapsed"), 8000);
    }, 12000);

    return () => {
      clearTimeout(showTimer);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

  const stopCollapse = () => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
  };

  const handleOpen = () => {
    stopCollapse();
    setPhase("form");
  };

  const handleCollapse = () => {
    stopCollapse();
    setPhase("collapsed");
  };

  const handleDismiss = () => {
    stopCollapse();
    setPhase("idle");
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://formsubmit.co/ajax/9d64015e0bad35be133b67c8bf0227a8", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      if (res.ok) {
        setPhase("success");
        localStorage.setItem(STORAGE_KEY, "1");
      } else {
        alert("Something went wrong. Try the contact form below?");
      }
    } catch {
      alert("Couldn't send — check your connection?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
      <AnimatePresence mode="wait">

        {/* ── BUBBLE ── */}
        {phase === "bubble" && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 32, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92, transition: { duration: 0.22 } }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

            <button onClick={handleDismiss} className="absolute top-3 right-3 p-1 rounded-full text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3 mb-3 relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-sky-500/30 mt-0.5">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-snug">{greeting.line1}</p>
                <p className="text-slate-400 text-xs mt-0.5">{greeting.line2}</p>
              </div>
            </div>

            <p className="text-slate-400 text-[13px] leading-relaxed mb-4 relative">
              I'd genuinely love to know who just visited. Drop your name — that's all it takes. 🤍
            </p>

            <div className="flex gap-2 relative">
              <button
                onClick={handleOpen}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-violet-600 text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" /> Say hi!
              </button>
              <button
                onClick={handleCollapse}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-white/5 text-slate-400 text-xs hover:text-white hover:bg-slate-700 transition-colors"
              >
                Later
              </button>
            </div>
          </motion.div>
        )}

        {/* ── FORM ── */}
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header strip */}
            <div className="relative px-5 pt-4 pb-3.5 border-b border-white/5 bg-gradient-to-r from-sky-900/40 to-violet-900/40">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/8 to-violet-500/8" />
              <button onClick={handleCollapse} className="absolute top-3 right-3 p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors z-10">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="relative flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-md shadow-sky-500/25">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Leave a trace ✨</p>
                  <p className="text-slate-400 text-[11px]">10 seconds. Means the world.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              <input type="hidden" name="_subject" value="✨ Someone visited your portfolio!" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="text" name="_honey" className="hidden" />
              <input type="hidden" name="source" value="Visitor Popup" />

              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1.5">
                  Your name <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  autoFocus
                  placeholder="Your good name? 😊"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/[0.07] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/[0.07] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1.5">
                  Leave a message
                </label>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Thoughts, vibes, anything... 💬"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/[0.07] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-violet-600 text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send it!</>
                )}
              </button>
              <p className="text-center text-slate-700 text-[10px]">No spam, ever. Just a warm digital hello. 🤍</p>
            </form>
          </motion.div>
        )}

        {/* ── SUCCESS ── */}
        {phase === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="w-64 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-2xl p-5 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
              className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            >
              <Heart className="w-6 h-6 text-emerald-400 fill-emerald-400" />
            </motion.div>
            <p className="text-white font-bold text-sm mb-1">This made my day! 🤍</p>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Seriously, knowing you were here means a lot.
            </p>
            <button
              onClick={handleDismiss}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs hover:text-white hover:bg-slate-700 transition-colors"
            >
              Close ✨
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── COLLAPSED BUTTON ── smooth scale in/out, no separate AnimatePresence needed */}
      <AnimatePresence>
        {phase === "collapsed" && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            onClick={handleOpen}
            title="Leave a note for Kevin"
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-sky-600 to-violet-700 shadow-xl shadow-sky-500/25 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-sky-400/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <Heart className="w-6 h-6 text-white fill-white drop-shadow relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
