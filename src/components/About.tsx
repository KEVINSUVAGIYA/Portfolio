"use client";

import { motion } from "framer-motion";
import { Gamepad2, Plane, Headphones, Cpu } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

const hobbies = [
    {
        icon: <Gamepad2 size={24} />,
        title: "Gamer",
        desc: "Strategic",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
    {
        icon: <Plane size={24} />,
        title: "Traveller",
        desc: "Explorer",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    {
        icon: <Headphones size={24} />,
        title: "Audiophile",
        desc: "Songs Listener",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
    },
];

export const About = () => {
    return (
        <section id="about" className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Personal Touch
                </h2>
                <div className="h-1 w-20 bg-sky-500 rounded-full" />
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-12">
                {/* The Creative Hobby - IoT Tinkerer */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative group w-full lg:max-w-xl"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-slate-900 rounded-2xl p-8 border border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-sky-500/20 p-3 rounded-xl text-sky-400">
                                <Cpu size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Creative Problem Solver</h3>
                                <p className="text-sky-500 font-medium">The Creative Hobby</p>
                            </div>
                        </div>

                        <p className="text-slate-300 leading-relaxed mb-6">
                            "Solving problems and thinking about really weird things."
                        </p>

                        <p className="text-slate-400 text-sm">
                            I enjoy diving into complex problems and exploring unconventional ideas. It keeps my mind sharp and allows me to approach challenges from unique angles.
                        </p>
                    </div>
                </motion.div>

                {/* Hobbies Grid */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-8"
                >
                    <h3 className="text-2xl font-semibold text-slate-300">Hobbies</h3>
                    <div className="flex flex-wrap gap-4">
                        {hobbies.map((hobby, index) => (
                            <MagneticWrapper key={index} strength={20}>
                                <div
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl border border-slate-800 backdrop-blur-sm transition-colors hover:border-slate-600 ${hobby.bg}`}
                                >
                                    <div className={`${hobby.color}`}>{hobby.icon}</div>
                                    <div>
                                        <h4 className="text-white font-medium">{hobby.title}</h4>
                                        <p className="text-slate-400 text-sm">{hobby.desc}</p>
                                    </div>
                                </div>
                            </MagneticWrapper>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
