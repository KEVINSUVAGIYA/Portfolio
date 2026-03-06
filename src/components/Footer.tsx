"use client";

import { Github, Linkedin, Mail, Twitter, Instagram, ArrowUp, Mountain } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="py-12 border-t border-slate-800 bg-slate-950">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Copyright */}
                <div className="text-slate-500 text-sm">
                    &copy; {currentYear} Kevin Suvagiya. All rights reserved.
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/KEVINSUVAGIYA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <Github size={20} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/kevin-suvagiya/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-sky-400 transition-colors"
                    >
                        <Linkedin size={20} />
                    </a>
                    <a
                        href="https://www.instagram.com/kevin_suvagiya02/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                    >
                        <Instagram size={20} />
                    </a>
                    <a
                        href="https://kevinsuvagiya.medium.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.salesforce.com/trailblazer/kevinsuvagiya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                    >
                        {/* Custom Rounded Mountain Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M8 3l4 8 5-5 5 15H2L8 3z" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>

                {/* Back to Top */}
                <button
                    onClick={scrollToTop}
                    className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                    Back to Top
                    <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </footer>
    );
};
