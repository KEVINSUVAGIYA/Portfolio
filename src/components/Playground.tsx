"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cloud, Music, Waves, Globe } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";

export const Playground = () => {
    const games = [
        {
            title: "Lanterns of Thought",
            description: "Release your worries into the infinite night sky.",
            icon: <Cloud className="w-6 h-6 text-orange-400" />,
            href: "/playground/lanterns",
            color: "from-orange-500/20 to-amber-500/5",
            border: "group-hover:border-orange-500/50"
        },
        {
            title: "Ripple Zen",
            description: "Interact with a pristine, magical water surface.",
            icon: <Waves className="w-6 h-6 text-cyan-400" />,
            href: "/playground/ripples",
            color: "from-cyan-500/20 to-blue-500/5",
            border: "group-hover:border-cyan-500/50"
        },
        {
            title: "Sufi Musical Flight",
            description: "Create ambient melodies by flying through rings.",
            icon: <Music className="w-6 h-6 text-purple-400" />,
            href: "/playground/flight",
            color: "from-purple-500/20 to-pink-500/5",
            border: "group-hover:border-purple-500/50"
        },
        {
            title: "Spirit World",
            description: "Explore an endless, soulful landscape on a spirit horse.",
            icon: <Globe className="w-6 h-6 text-emerald-400" />,
            href: "/world",
            color: "from-emerald-500/20 to-teal-500/5",
            border: "group-hover:border-emerald-500/50"
        }
    ];

    return (
        <section id="playgrounds" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title="Creative Playground" watermark="EXPERIMENTS" alignment="center" />
                <p className="text-neutral-300 text-lg max-w-2xl mx-auto -mt-10 mb-16 text-center">
                    Experimental 3D experiences. Relax, play, and explore.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {games.map((game, index) => (
                        <Link href={game.href} key={index} className="group relative">
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                            <motion.div
                                whileHover={{ y: -5 }}
                                className={`relative h-full bg-slate-900/50 backdrop-blur-sm border border-white/10 ${game.border} rounded-2xl p-8 transition-colors duration-300`}
                            >
                                <div className="p-3 bg-white/5 rounded-xl w-fit mb-6 group-hover:bg-white/10 transition-colors">
                                    {game.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">
                                    {game.title}
                                </h3>

                                <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                                    {game.description}
                                </p>

                                <div className="mt-6 flex items-center text-sm font-medium text-neutral-500 group-hover:text-white transition-colors">
                                    Enter Experience
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section >
    );
};
