"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Award } from "lucide-react";

const certifications = [
    "Salesforce Certified AI Specialist",
    "Salesforce Certified Data Cloud Consultant",
    "Salesforce Certified AI Associate",
];

const techStack = {
    Core: ["Apex", "LWC", "SOQL", "Flows"],
    Integration: ["REST/SOAP APIs", "Webhooks", "Connected Apps"],
    Tools: ["VS Code", "SFDX", "Git/GitHub", "Postman"],
};

export const Skills = () => {
    return (
        <section id="skills" className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Skills & Trust Signals
                </h2>
                <div className="h-1 w-20 bg-sky-500 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Certifications */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                        <Award className="text-sky-400" size={28} />
                        Certifications
                    </h3>
                    <ul className="space-y-6">
                        {certifications.map((cert) => (
                            <li
                                key={cert}
                                className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 hover:border-sky-500/30 transition-colors"
                            >
                                <div className="bg-sky-500/20 p-2 rounded-full">
                                    <CheckCircle2 className="text-sky-400" size={20} />
                                </div>
                                <span className="text-slate-200 font-medium">{cert}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h3 className="text-2xl font-semibold text-white mb-8">Tech Stack</h3>
                    <div className="grid gap-6">
                        {Object.entries(techStack).map(([category, items]) => (
                            <div key={category}>
                                <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-3 font-semibold">
                                    {category}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((item) => (
                                        <span
                                            key={item}
                                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
