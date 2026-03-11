"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    watermark: string;
    alignment?: "left" | "center";
}

export const SectionHeader = ({ title, watermark, alignment = "center" }: SectionHeaderProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`relative mb-16 md:mb-24 flex flex-col w-full ${alignment === "center" ? "items-center text-center" : "items-start text-left"}`}
        >
            {/* Background Massive Watermark Text */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 text-[4rem] md:text-[6rem] lg:text-[8rem] font-black text-slate-100/[0.09] select-none pointer-events-none z-0 tracking-widest whitespace-nowrap
                    ${alignment === "center" ? "left-1/2 -translate-x-1/2" : "-left-4 md:-left-8"}
                `}
            >
                {watermark}
            </div>

            {/* Foreground Title container */}
            <div className={`relative z-10 flex flex-col w-full ${alignment === "center" ? "items-center" : "items-start"}`}>

                {/* Text and Primary Accents */}
                <div className={`flex items-center gap-4 md:gap-6 ${alignment === "center" ? "justify-center" : "justify-start"}`}>

                    {/* Left Accent (Only on Left Alignment) */}
                    {alignment === "left" && (
                        <div className="hidden md:flex flex-col items-center gap-1.5 opacity-80 mt-1">
                            <div className="w-1.5 h-1.5 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] rotate-45" />
                            <div className="w-[1px] h-8 bg-gradient-to-b from-sky-500/80 to-transparent" />
                        </div>
                    )}

                    {/* Left Center Accent */}
                    {alignment === "center" && (
                        <div className="hidden md:flex items-center gap-3">
                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-sky-500/50" />
                            <div className="w-1.5 h-1.5 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] rotate-45" />
                        </div>
                    )}

                    {/* Text */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tight leading-tight">
                        {title}
                    </h2>

                    {/* Right Center Accent */}
                    {alignment === "center" && (
                        <div className="hidden md:flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] rotate-45" />
                            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-sky-500/50" />
                        </div>
                    )}
                </div>



            </div>
        </motion.div>
    );
};
