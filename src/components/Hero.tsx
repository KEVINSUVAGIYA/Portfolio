"use client";

import { motion } from "framer-motion";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { ArrowDown, Download } from "lucide-react";

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pt-20">

            {/* Introduction */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
            >
                <h2 className="text-sky-400 font-medium tracking-wide text-lg mb-4">
                    Hi, I am
                </h2>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                    Kevin Suvagiya
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-400">
                    Salesforce Developer | 3x Salesforce Certified | Trailhead Ranger
                </h2>
            </motion.div>

            {/* The Hook */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed mt-8 mb-8"
            >
                "Transforming business vision into robust Salesforce architectures, crafting efficient engines that power seamless digital journeys."
            </motion.p>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-slate-500 max-w-xl mb-12"
            >
                Specializing in bi-directional integrations, high-performance LWC, and custom AppExchange solutions.
            </motion.p>

            {/* Magnetic Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
            >
                <MagneticWrapper>
                    <a
                        href="#projects"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-full transition-colors h-[56px] min-w-[180px]"
                    >
                        View Projects
                        <ArrowDown size={18} />
                    </a>
                </MagneticWrapper>

                <MagneticWrapper strength={50}>
                    <a
                        href="#contact"
                        className="flex items-center justify-center px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-full transition-colors h-[56px] min-w-[180px]"
                    >
                        Contact Me
                    </a>
                </MagneticWrapper>

                <MagneticWrapper strength={50}>
                    <a
                        href="/Portfolio/resume.pdf"
                        download="Kevin_Suvagiya_Resume.pdf"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-full transition-colors h-[56px] min-w-[180px]"
                    >
                        <Download size={18} />
                        Download Resume
                    </a>
                </MagneticWrapper>
            </motion.div>
        </section>
    );
};

