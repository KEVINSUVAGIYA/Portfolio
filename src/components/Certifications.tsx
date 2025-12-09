"use client";

import { motion } from "framer-motion";
import { Shield, Star, Trophy } from "lucide-react";
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
            title: "Agentforce",
            subtitle: "Champion 2025",
            icon: <Trophy className="text-yellow-400" size={32} />,
            color: "border-yellow-500/50 bg-yellow-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]",
        },
        {
            id: "ranger",
            title: "Trailhead",
            subtitle: "Ranger",
            icon: (
                <div className="relative">
                    <Star className="text-sky-400 fill-sky-400" size={32} />
                    <div className="absolute inset-0 blur-sm bg-sky-400/50 rounded-full" />
                </div>
            ),
            color: "border-sky-500/50 bg-sky-500/10",
            glow: "shadow-[0_0_30px_-10px_rgba(14,165,233,0.3)]",
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
                                    className={`flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${cert.color} ${cert.glow}`}
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
                                    className={`flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${item.color} ${item.glow}`}
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
