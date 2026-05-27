"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sections, sectionIds } from "./navData";

export function ElevatorNav() {
    const activeSection = useActiveSection(sectionIds);
    const [isHovered, setIsHovered] = useState(false);

    const activeIndex = sections.findIndex(s => s.id === activeSection) || 0;
    
    // Calculate vertical position based on active index (0 to 1)
    const progress = sections.length > 1 ? activeIndex / (sections.length - 1) : 0;

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setIsHovered(false);
    };

    return (
        <div 
            className="fixed top-0 right-0 h-screen w-8 z-[100] flex items-center justify-end group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-2/3 w-1 bg-slate-800/30 rounded-full mr-4 group-hover:w-48 group-hover:bg-slate-900/80 group-hover:backdrop-blur-md group-hover:border group-hover:border-slate-800 transition-all duration-300">
                <AnimatePresence mode="wait">
                    {!isHovered ? (
                        <motion.div
                            key="capsule"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute w-1.5 h-16 bg-indigo-500 rounded-full -left-[1px] shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                            style={{ 
                                top: `calc(${progress * 100}% - ${progress * 64}px)`,
                                transition: 'top 0.3s ease-out'
                            }}
                        />
                    ) : (
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 p-2 flex flex-col justify-between"
                        >
                            {sections.map((section, idx) => {
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollTo(section.id)}
                                        className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors text-left ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-400' : 'bg-slate-700'}`} />
                                        <span className="text-xs font-medium truncate">{section.label}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
