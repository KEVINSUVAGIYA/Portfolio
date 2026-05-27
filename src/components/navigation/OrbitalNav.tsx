"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sections, sectionIds } from "./navData";
import { Compass } from "lucide-react";

export function OrbitalNav() {
    const activeSection = useActiveSection(sectionIds);
    const [isHovered, setIsHovered] = useState(false);

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
            className="fixed bottom-8 right-8 z-[100] flex items-end justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-16 h-16 pointer-events-auto">
                {/* Invisible hover area expander */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-0 pointer-events-auto"
                        />
                    )}
                </AnimatePresence>
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
                            {sections.map((section, idx) => {
                                const angle = (Math.PI / 2) * (idx / (sections.length - 1)); // 0 to 90 degrees in radians
                                const radius = 220;
                                // We are at bottom right, so we want to fan out to the top-left (-x, -y)
                                const x = -Math.cos(angle) * radius;
                                const y = -Math.sin(angle) * radius;
                                
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;

                                return (
                                    <motion.button
                                        key={section.id}
                                        onClick={() => scrollTo(section.id)}
                                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                        animate={{ opacity: 1, x, y, scale: 1 }}
                                        exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                        transition={{ delay: idx * 0.03, type: "spring", stiffness: 200, damping: 15 }}
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border ${isActive ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'} transition-colors group`}
                                    >
                                        <Icon size={16} />
                                        {/* Tooltip */}
                                        <div className="absolute top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap pointer-events-none shadow-xl z-50">
                                            {section.label}
                                        </div>
                                    </motion.button>
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
