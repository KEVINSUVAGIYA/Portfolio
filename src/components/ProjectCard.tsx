"use client";

interface ProjectCardProps {
    project: {
        id: number;
        title: string;
        problem: string;
        solution: string;
        bestLearning: string;
        tech: string[];
    };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <div className="group relative h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col">
            <div className="p-8 flex flex-col h-full">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-sky-400 transition-colors">
                        {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t) => (
                            <span
                                key={t}
                                className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 rounded-full"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 flex-grow">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            The Challenge
                        </h4>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            {project.problem}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Solution
                        </h4>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            {project.solution}
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_2px_rgba(234,179,8,0.5)] animate-pulse" />
                        Best Learning
                    </h4>
                    <p className="text-slate-200 text-sm font-medium italic relative pl-4 border-l-2 border-slate-700">
                        "{project.bestLearning}"
                    </p>
                </div>
            </div>
        </div>
    );
};
