"use client";

import { motion } from "framer-motion";
import { Shield, Star, Trophy, Lightbulb, Crown } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

export const Certifications = () => {
    // Row 1: Salesforce Certifications
    const certifications = [
        {
            id: "cert1",
            title: "Certified",
            subtitle: "Data Cloud Consultant",
            icon: <Shield className="text-emerald-400" size={32} />,
            color: "border-emerald-500/50 bg-emerald-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]",
        },
        {
            id: "cert2",
            title: "Certified",
            subtitle: "AI Associate",
            icon: <Shield className="text-emerald-400" size={32} />,
            color: "border-emerald-500/50 bg-emerald-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]",
        },
        {
            id: "cert3",
            title: "Certified",
            subtitle: "AI Specialist",
            icon: <Shield className="text-emerald-400" size={32} />,
            color: "border-emerald-500/50 bg-emerald-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]",
        },
    ];

    // Row 2: Achievements
    const achievements = [
        {
            id: "agentforce",
            title: "Agentblazer",
            subtitle: "Champion",
            icon: (
                <div className="relative">
                    <Trophy className="text-slate-100" size={32} />
                    <div className="absolute inset-0 blur-sm bg-slate-100/50 rounded-full" />
                </div>
            ),
            color: "border-slate-500/50 bg-slate-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(248,250,252,0.3)]",
        },
        {
            id: "innovator",
            title: "Agentblazer",
            subtitle: "Innovator",
            icon: (
                <div className="relative">
                    <Lightbulb className="text-yellow-400" size={32} />
                    <div className="absolute inset-0 blur-sm bg-yellow-400/50 rounded-full" />
                </div>
            ),
            color: "border-yellow-500/50 bg-yellow-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]",
        },
        {
            id: "legend",
            title: "Agentblazer",
            subtitle: "Legend",
            icon: (
                <div className="relative">
                    <Crown className="text-violet-300" size={32} />
                    <div className="absolute inset-0 blur-sm bg-violet-300/50 rounded-full" />
                </div>
            ),
            color: "border-violet-500/50 bg-violet-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(167,139,250,0.3)]",
        },
        {
            id: "ranger",
            title: "Trailhead",
            subtitle: "Double Star Ranger",
            icon: (
                <div className="relative">
                    <div className="flex gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={24} />
                        <Star className="text-yellow-400 fill-yellow-400" size={24} />
                    </div>
                    <div className="absolute inset-0 blur-sm bg-yellow-400/30 rounded-full" />
                </div>
            ),
            color: "border-yellow-500/50 bg-yellow-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]",
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Simple Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-sky-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center gap-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Certifications & Achievements
                    </h2>
                    <div className="h-1 w-20 bg-sky-500 rounded-full mx-auto" />
                </motion.div>

                <div className="flex flex-col items-center gap-8 w-full">
                    {/* Row 1: Certifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {certifications.map((cert) => (
                            <MagneticWrapper key={cert.id} strength={10}>
                                <div
                                    className={`flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 cursor-pointer ${cert.color} ${cert.glow}`}
                                >
                                    <div className="shrink-0">
                                        {cert.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{cert.title}</span>
                                        <span className="text-white font-bold">{cert.subtitle}</span>
                                    </div>
                                </div>
                            </MagneticWrapper>
                        ))}
                    </motion.div>

                    {/* Row 2: Achievements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {achievements.map((item) => (
                            <MagneticWrapper key={item.id} strength={10}>
                                <div
                                    className={`flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 cursor-pointer ${item.color} ${item.glow}`}
                                >
                                    <div className="shrink-0">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{item.title}</span>
                                        <span className="text-white font-bold">{item.subtitle}</span>
                                    </div>
                                </div>
                            </MagneticWrapper>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
