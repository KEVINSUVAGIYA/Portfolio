"use client";

import { motion } from "framer-motion";
import { Calendar, Building2, Briefcase } from "lucide-react";

const experience = [
    {
        id: 1,
        role: "Salesforce Developer",
        company: "MV Clouds",
        period: "Feb 2024 - Present",
        description: "Currently working as a Salesforce Developer, delivering scalable and customized solutions to enhance business processes and user experience.",
        skills: ["Lightning Web Components", "Apex Programming"]
    },
    {
        id: 2,
        role: "Salesforce Developer (Trainee)",
        company: "MV Clouds",
        period: "Aug 2023 - Jan 2024",
        description: "As a Salesforce Trainee, I built strong foundational knowledge of the Salesforce ecosystem and gained hands-on experience with its core features and customization.",
        skills: ["Lightning Web Components", "Flows"]
    },
    {
        id: 3,
        role: "Graphic Designer",
        company: "E-cell ignite",
        period: "Jul 2022 - Mar 2023",
        description: "Basically, E-cell is nothing but an entrepreneurship cell in which we help the startups to grow and also try to help them getting funds/ investments.",
        skills: ["Marketing Strategy", "CSS"]
    },
];

export const Experience = () => {
    return (
        <section id="experience" className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Experience
                </h2>
                <div className="h-1 w-20 bg-sky-500 rounded-full" />
            </motion.div>

            <div className="relative border-l border-slate-800 ml-3 md:ml-12 space-y-12">
                {experience.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="relative pl-8 md:pl-12"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute -left-[5px] top-2 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-slate-900" />

                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-colors w-full">
                                <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Briefcase size={18} className="text-sky-400" />
                                            {item.role}
                                        </h3>
                                        <p className="text-slate-400 flex items-center gap-2 mt-1">
                                            <Building2 size={16} />
                                            {item.company}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium px-4 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {item.period}
                                    </span>
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    {item.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {item.skills.map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
