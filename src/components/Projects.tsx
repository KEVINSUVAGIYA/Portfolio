"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

export const Projects = () => {
    return (
        <section id="projects" className="py-24 relative z-10 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Selected Works
                </h2>
                <div className="h-1 w-20 bg-sky-500 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        className="h-full"
                    >
                        <ProjectCard project={project} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
