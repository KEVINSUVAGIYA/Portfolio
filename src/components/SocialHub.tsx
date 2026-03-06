"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Twitter } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

const MediumIcon = ({ size = 24 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
);

const TrailheadIcon = ({ size = 24 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M8 3l4 8 5-5 5 15H2L8 3z" strokeLinejoin="round" />
    </svg>
);

const socials = [
    {
        name: "LinkedIn",
        handle: "kevin-suvagiya",
        hook: "Let's connect professionally",
        url: "https://www.linkedin.com/in/kevin-suvagiya/",
        icon: Linkedin,
        color: "#0A66C2",
        gradient: "from-[#0A66C2] to-[#004182]",
    },
    {
        name: "GitHub",
        handle: "KEVINSUVAGIYA",
        hook: "Check out my open-source work",
        url: "https://github.com/KEVINSUVAGIYA",
        icon: Github,
        color: "#e6edf3",
        gradient: "from-[#6e7681] to-[#30363d]",
    },
    {
        name: "Medium",
        handle: "kevinsuvagiya",
        hook: "Read my technical articles",
        url: "https://kevinsuvagiya.medium.com/",
        icon: MediumIcon,
        color: "#ffffff",
        gradient: "from-[#292929] to-[#000000]",
        isCustomIcon: true,
    },
    {
        name: "X / Twitter",
        handle: "@kevin__suvagiya",
        hook: "Thoughts on Salesforce & tech",
        url: "https://x.com/kevin__suvagiya",
        icon: Twitter,
        color: "#ffffff",
        gradient: "from-[#536471] to-[#1d9bf0]",
    },
    {
        name: "Instagram",
        handle: "kevin_suvagiya02",
        hook: "Life beyond the code",
        url: "https://www.instagram.com/kevin_suvagiya02/",
        icon: Instagram,
        color: "#E1306C",
        gradient: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    },
    {
        name: "Trailhead",
        handle: "kevinsuvagiya",
        hook: "My Salesforce journey",
        url: "https://www.salesforce.com/trailblazer/kevinsuvagiya",
        icon: TrailheadIcon,
        color: "#00A1E0",
        gradient: "from-[#00A1E0] to-[#032D60]",
        isCustomIcon: true,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
    },
};

export const SocialHub = () => {
    return (
        <section className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16 text-center"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Where I Hang Out
                </h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                    Follow along on the platforms where I share ideas, code, and everything in between.
                </p>
                <div className="h-1 w-20 bg-sky-500 rounded-full mx-auto mt-6" />
            </motion.div>

            {/* Social Cards Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
                {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                        <motion.div key={social.name} variants={cardVariants}>
                            <MagneticWrapper strength={15}>
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center gap-5 p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-transparent transition-all duration-500 cursor-pointer overflow-hidden"
                                >
                                    {/* Hover gradient border glow */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                        style={{ padding: "1px" }}
                                    >
                                        <div className="w-full h-full rounded-2xl bg-slate-900/95" />
                                    </div>

                                    {/* Background glow on hover */}
                                    <div
                                        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                                        style={{ backgroundColor: social.color }}
                                    />

                                    {/* Icon */}
                                    <div className="relative z-10 flex-shrink-0">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-800/80 border border-slate-700 group-hover:border-transparent group-hover:scale-110 transition-all duration-300"
                                            style={{
                                                boxShadow: `0 0 0px ${social.color}00`,
                                            }}
                                        >
                                            <div
                                                className="text-slate-400 group-hover:text-white transition-colors duration-300"
                                                style={{
                                                    // Apply brand color on hover via CSS variable
                                                }}
                                            >
                                                <Icon
                                                    size={24}
                                                    className="transition-colors duration-300"
                                                    style={{
                                                        color: "inherit",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="relative z-10 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-white text-base">
                                                {social.name}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm truncate mb-1">
                                            {social.handle}
                                        </p>
                                        <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">
                                            {social.hook}
                                        </p>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className="relative z-10 flex-shrink-0 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M7 17L17 7" />
                                            <path d="M7 7h10v10" />
                                        </svg>
                                    </div>
                                </a>
                            </MagneticWrapper>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};
