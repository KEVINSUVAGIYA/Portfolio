"use client";

import { useState, useEffect } from "react";
import { useLanternStore } from "./LanternSystem";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Wind, ArrowLeft } from "lucide-react";
import { Toaster, toast } from "sonner";
import Link from "next/link";

export const LanternInput = () => {
    const [text, setText] = useState("");
    const setCurrentInput = useLanternStore((s) => s.setCurrentInput);
    const addLantern = useLanternStore((s) => s.addLantern);
    const paused = useLanternStore((s) => s.paused);
    const togglePause = useLanternStore((s) => s.togglePause);

    // Wish counter (persisted)
    const [wishCount, setWishCount] = useState(0);
    const [lastWish, setLastWish] = useState<string | null>(null);

    useEffect(() => {
        const count = parseInt(localStorage.getItem("lantern_count") || "0");
        const last = localStorage.getItem("lantern_last");
        setWishCount(count);
        setLastWish(last);
    }, []);

    // Sync typing to 3D preview
    useEffect(() => {
        setCurrentInput(text);
    }, [text, setCurrentInput]);

    // Toast on wish release
    useEffect(() => {
        const handleWish = (e: any) => {
            const wishText = e.detail?.text || "";
            const truncated = wishText.length > 50 ? wishText.substring(0, 50) + "…" : wishText;
            toast.success("✨ Wish Released to the Universe", {
                description: `"${truncated}"`,
                duration: 4500,
                style: {
                    background: "rgba(15,23,42,0.92)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    color: "#fde68a",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow: "0 8px 40px rgba(251,146,60,0.2)",
                },
            });
        };
        window.addEventListener("lantern-wished", handleWish);
        return () => window.removeEventListener("lantern-wished", handleWish);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        addLantern(text);

        // Persist count + last wish
        const newCount = wishCount + 1;
        setWishCount(newCount);
        setLastWish(text);
        localStorage.setItem("lantern_count", String(newCount));
        localStorage.setItem("lantern_last", text);

        setText("");
        setCurrentInput("");
    };

    return (
        <>
            <Toaster position="top-center" theme="dark" offset={80} />

            {/* Top Bar: Back & Pause */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
                <Link href="/#playgrounds" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white border border-white/10 bg-black/20 backdrop-blur-md transition-colors">
                    <ArrowLeft size={15} /> Back
                </Link>
                <button onClick={togglePause} className="px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white border border-white/10 bg-black/20 backdrop-blur-md transition-colors">
                    {paused ? "Resume" : "Pause"}
                </button>
            </div>

            {/* Wish Counter */}
            <AnimatePresence>
                {wishCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 backdrop-blur-md"
                    >
                        <Wind size={14} className="text-amber-300" />
                        <span className="text-amber-200 text-sm font-medium">{wishCount.toLocaleString()} wish{wishCount !== 1 ? "es" : ""} released</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input area */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl z-10 px-6">

                {/* Last wish memory */}
                <AnimatePresence>
                    {lastWish && !text && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-xs text-orange-200/40 italic mb-3"
                        >
                            Last wish: "{lastWish.length > 45 ? lastWish.substring(0, 45) + "…" : lastWish}"
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Hint */}
                <AnimatePresence>
                    {!text && !lastWish && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center mb-5"
                        >
                            <span className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md text-orange-50/80 text-sm font-medium border border-white/10">
                                🏮 What's weighing on your heart today?
                            </span>
                        </motion.div>
                    )}
                    {!text && lastWish && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center mb-5"
                        >
                            <span className="text-orange-200/50 text-sm italic">Type another wish to release it...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="relative group">
                    {/* Glow halo — pulses when text is present */}
                    <div
                        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${text
                            ? "bg-gradient-to-r from-orange-500/40 to-pink-500/30 opacity-100"
                            : "bg-gradient-to-r from-orange-500/10 to-purple-500/10 opacity-60 group-hover:opacity-100"
                            }`}
                    />

                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="I wish for..."
                            className="w-full bg-slate-950/80 backdrop-blur-2xl border border-white/10 text-white placeholder:text-white/25 rounded-full py-5 pl-8 pr-16 text-lg focus:outline-none focus:border-amber-500/50 transition-all shadow-2xl"
                        />
                        <motion.button
                            type="submit"
                            disabled={!text.trim()}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.08 }}
                            className="absolute right-2.5 p-3.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full disabled:opacity-0 disabled:pointer-events-none shadow-lg shadow-orange-500/30"
                        >
                            <Send size={18} fill="currentColor" />
                        </motion.button>
                    </div>
                </form>
            </div>
        </>
    );
};
