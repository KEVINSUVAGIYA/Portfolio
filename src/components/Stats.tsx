"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
    { label: "Years Experience", value: "2.5+" },
    { label: "Certifications", value: "3x" },
    { label: "Superbadges", value: "8x" },
    { label: "Trailhead Badges", value: "170+" },
    { label: "Projects Delivered", value: "10+" },
];

export const Stats = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div
                    ref={ref}
                    className="flex flex-wrap justify-center gap-8 md:gap-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-tr from-white to-slate-400 bg-clip-text text-transparent">
                                {stat.value}
                            </h3>
                            <p className="text-slate-400 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
