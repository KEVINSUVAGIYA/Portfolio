"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Orbit } from "lucide-react";
import { motion } from "framer-motion";

export default function WorldPage() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#030712] flex flex-col items-center justify-center text-white font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse delay-700" />
            
            {/* Top Back bar */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/#playgrounds" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white border border-white/10 bg-black/20 backdrop-blur-md transition-all ease-out">
                    <ArrowLeft size={15} /> Portfolio
                </Link>
            </div>

            {/* Core Card */}
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center"
            >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-white/10 shadow-xl mb-6 flex items-center justify-center">
                    <Orbit size={40} className="text-cyan-400 animate-[spin_10s_linear_infinite]" />
                </div>

                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
                    The Spirit World
                </h1>

                <p className="text-slate-400 text-lg mb-8 font-light leading-relaxed">
                    An immersive 3D interactive playground is currently being optimized to ensure buttery smooth performance.
                </p>

                <div className="flex flex-col gap-3 w-full">
                    <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 text-indigo-300 text-sm flex items-center justify-center gap-2 backdrop-blur-sm">
                        <Sparkles size={16} /> Optimization upgrades in progress
                    </div>
                </div>
            </motion.div>

            {/* Glowing Floor Edge */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        </div>
    );
}
