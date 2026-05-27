"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sections, sectionIds } from "./navData";
import { Compass } from "lucide-react";

export function OrbitalNav() {
    const activeSection = useActiveSection(sectionIds);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    const activeIndex = sections.findIndex(s => s.id === activeSection) || 0;
    const activeData = sections[activeIndex] || sections[0];
    const ActiveIcon = activeData.icon;

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setIsHovered(false);
    };

    return (
        <div 
            className={`fixed bottom-12 right-12 z-[100] w-96 h-96 flex items-end justify-end ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-16 h-16 pointer-events-auto">
                {/* Main Orb */}
                <motion.div
                    className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.2)] flex items-center justify-center text-indigo-400 z-10 cursor-pointer backdrop-blur-md"
                    whileHover={{ scale: 1.1 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeData.id}
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ActiveIcon size={24} />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Orbital Nodes */}
                <AnimatePresence>
                    {isHovered && (
                        <div className="absolute inset-0">
                            {/* Sparkling Orbit Effects */}
                            <AnimatePresence>
                                {hoveredSection && (
                                    <>
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 180 }}
                                            exit={{ opacity: 0, scale: 0.5, rotate: 0 }}
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border-2 border-dashed border-indigo-400/40 rounded-full pointer-events-none"
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-300 rounded-full shadow-[0_0_15px_rgba(165,180,252,1)]" />
                                            <div className="absolute bottom-1/4 left-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-sky-300 rounded-full shadow-[0_0_12px_rgba(125,211,252,1)]" />
                                            <div className="absolute top-1/4 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-violet-300 rounded-full shadow-[0_0_15px_rgba(196,181,253,1)]" />
                                        </motion.div>
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                            animate={{ opacity: 1, scale: 1, rotate: -135 }}
                                            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] border border-dashed border-sky-400/30 rounded-full pointer-events-none"
                                        >
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(103,232,249,1)]" />
                                        </motion.div>
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none"
                                        />
                                    </>
                                )}
                            </AnimatePresence>

                            {sections.map((section, idx) => {
                                const angle = (Math.PI / 2) * (idx / (sections.length - 1)); // 0 to 90 degrees in radians
                                const radius = 170;
                                // We are at bottom right, so we want to fan out to the top-left (-x, -y)
                                const x = -Math.cos(angle) * radius;
                                const y = -Math.sin(angle) * radius;
                                
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;

                                return (
                                    <motion.a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        onMouseEnter={() => setHoveredSection(section.id)}
                                        onMouseLeave={() => setHoveredSection(null)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollTo(section.id);
                                        }}
                                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                        animate={{ opacity: 1, x, y, scale: 1 }}
                                        exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                        transition={{ delay: idx * 0.03, type: "spring", stiffness: 200, damping: 15 }}
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border ${isActive ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'} transition-colors group`}
                                    >
                                        <div className="pointer-events-none flex items-center justify-center">
                                            <Icon size={16} />
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-800 whitespace-nowrap pointer-events-none">
                                            {section.label}
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>

                {/* Progress Ring */}
                <svg className="absolute -inset-2 w-20 h-20 -rotate-90 pointer-events-none">
                    <circle
                        cx="40"
                        cy="40"
                        r="38"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="2"
                    />
                    <motion.circle
                        cx="40"
                        cy="40"
                        r="38"
                        fill="none"
                        stroke="rgb(99,102,241)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 38}
                        initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                        animate={{ strokeDashoffset: (2 * Math.PI * 38) * (1 - ((activeIndex + 1) / sections.length)) }}
                        transition={{ duration: 0.5 }}
                    />
                </svg>
            </div>
        </div>
    );
}
