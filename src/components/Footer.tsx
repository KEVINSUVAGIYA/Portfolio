"use client";

import { Github, Linkedin, Mail, Instagram, ArrowUp, Mountain } from "lucide-react";

const TrailheadIcon = ({ size = 20 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="13.5 11.5 73 73" fill="currentColor">
        <g>
            <polygon points="32.7,63.8 29.5,67.5 35.9,67.5 \t" />
            <polygon points="35.7,71.4 42.1,71.4 38.9,67.7 \t" />
            <polygon points="61.3,68.8 64.5,65.1 67.7,68.8 \t" />
            <g>
                <path d="M50.9,20.2c-0.5-0.3-1.2-0.3-1.7,0C31.3,27.8,19.8,45.5,20.1,65v4.3c0,0.7,0.3,1.3,0.9,1.7
                    c8.6,5.7,18.8,8.9,29.1,9h1h0.1c9.9-0.4,19.6-3.4,27.8-9c0.5-0.4,0.9-1,0.9-1.7V65C80.4,45.5,68.9,27.8,50.9,20.2z M34.7,36
                    c7.3-8.6,15.4-11.5,15.4-11.5c1.7,0.8,21.2,8.4,25.2,33h-5.1l-9.8-14.1c-0.7-0.9-2-1.2-3-0.5c-0.3,0.1-0.4,0.4-0.5,0.5L54.4,47
                    l-6.9-9.9c-0.7-0.9-2-1.2-3-0.5c-0.3,0.1-0.4,0.4-0.5,0.5L30.1,57.4L25,57.6C26.5,48.2,30.4,41.2,34.7,36z M65,57.6h-5.9h-6.8
                    l3.3-4.7l3-4.4L65,57.6z M47,43.6L47,43.6L47,43.6l5,7.2l-4.7,6.7h-1.3H35.2l5.1-7.6l5.4-8l0,0L47,43.6z M51.8,72.6L51.8,72.6
                    L50,75.8c-3.7,0-7.1-0.5-11-1.4l0,0c-5.1-1.3-10.1-3.4-14.5-6.1v-3.1c0-1,0-2.1,0.1-3.3H34h12.7c-1.7,2.6-0.9,6.1,1.8,7.7
                    c0.3,0.1,0.5,0.3,0.7,0.4l2,0.9C51.8,71.1,52,71.9,51.8,72.6z M75.8,68.1c-3.3,2-6.7,3.7-10.2,4.8c0,0-0.7,0.3-0.9,0.3
                    c-2,0.7-4,1.2-6.1,1.6c-1.2,0.3-2.4,0.4-3.5,0.5l0.4-0.7c1.6-2.7,0.7-6.1-2.1-7.7c-0.1-0.1-0.4-0.1-0.5-0.3l-2-0.9
                    c-0.7-0.3-1-1-0.7-1.7c0-0.1,0.1-0.3,0.1-0.3l1.8-2.1h3.9h19.6c0,1,0.1,2.1,0.1,3.3V68.1z"/>
            </g>
        </g>
    </svg>
);

const XIcon = ({ size = 20 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

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
                        href="https://x.com/kevin__suvagiya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <XIcon size={20} />
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
                        <TrailheadIcon size={20} />
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
