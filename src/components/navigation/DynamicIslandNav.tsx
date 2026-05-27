"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sections, sectionIds } from "./navData";
import { Map } from "lucide-react";

export function DynamicIslandNav() {
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
            className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] p-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                layout
                initial={{ borderRadius: 32 }}
                animate={{
                    width: isHovered ? "auto" : 200,
                    height: isHovered ? "auto" : 48,
                    borderRadius: isHovered ? 24 : 32,
                    backgroundColor: isHovered ? "rgba(15, 23, 42, 0.9)" : "rgba(15, 23, 42, 0.7)",
                }}
                className="border border-slate-800/60 backdrop-blur-md shadow-2xl flex items-center justify-center cursor-pointer relative"
            >
                <AnimatePresence mode="wait">
                    {!isHovered ? (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3 px-6 w-full justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <ActiveIcon size={16} className="text-indigo-400" />
                                <span className="text-sm font-semibold text-white">{activeData.label}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium bg-slate-950/50 px-2 py-1 rounded-full">
                                {activeIndex + 1}/{sections.length}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-2 p-3"
                        >
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollTo(section.id)}
                                        className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'}`}
                                    >
                                        <Icon size={20} />
                                        {/* Tooltip */}
                                        <div className="absolute -bottom-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap pointer-events-none shadow-xl z-50">
                                            {section.label}
                                        </div>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
