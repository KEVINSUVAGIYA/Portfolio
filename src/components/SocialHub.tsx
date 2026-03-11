"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useAnimationFrame } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./ui/SectionHeader";

const MediumIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
);

const TrailheadIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="13.5 11.5 73 73" fill="currentColor">
        <g>
            <polygon points="32.7,63.8 29.5,67.5 35.9,67.5 " />
            <polygon points="35.7,71.4 42.1,71.4 38.9,67.7 " />
            <polygon points="61.3,68.8 64.5,65.1 67.7,68.8 " />
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

const XIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const socials = [
    {
        name: "Trailhead",
        handle: "kevinsuvagiya",
        hook: "My Salesforce journey",
        url: "https://www.salesforce.com/trailblazer/kevinsuvagiya",
        icon: TrailheadIcon,
        color: "#00A1E0",
    },
    {
        name: "LinkedIn",
        handle: "kevin-suvagiya",
        hook: "Let's connect professionally",
        url: "https://www.linkedin.com/in/kevin-suvagiya/",
        icon: Linkedin,
        color: "#0A66C2",
    },
    {
        name: "Medium",
        handle: "kevinsuvagiya",
        hook: "Read my technical articles",
        url: "https://kevinsuvagiya.medium.com/",
        icon: MediumIcon,
        color: "#ffffff",
        textColor: "#000000",
    },
    {
        name: "Instagram",
        handle: "kevin_suvagiya02",
        hook: "Life beyond the code",
        url: "https://www.instagram.com/kevin_suvagiya02/",
        icon: Instagram,
        color: "#E1306C",
    },
    {
        name: "GitHub",
        handle: "KEVINSUVAGIYA",
        hook: "Check out my open-source work",
        url: "https://github.com/KEVINSUVAGIYA",
        icon: Github,
        color: "#6e7681",
    },
    {
        name: "X",
        handle: "@kevin__suvagiya",
        hook: "Thoughts on Salesforce & tech",
        url: "https://x.com/kevin__suvagiya",
        icon: XIcon,
        color: "#ffffff",
        textColor: "#000000",
    }
];

const Highlight = ({ word, hovered, setHovered }: { word: string, hovered: string | null, setHovered: (w: string | null) => void }) => {
    const social = socials.find(s => s.name === word);
    if (!social) return <span>{word}</span>;
    const isHovered = hovered === word;

    return (
        <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(word)}
            onMouseLeave={() => setHovered(null)}
            className="relative cursor-pointer transition-colors duration-300 inline-flex items-end group z-50 text-slate-200"
        >
            <span className={`relative z-10 border-b-4 transition-all duration-300 ${isHovered ? 'border-transparent text-white' : 'border-slate-800'}`}>
                {word}
            </span>
        </a>
    );
};

const getRoundedRectPosInfo = (progress: number, w: number, h: number, r: number) => {
    r = Math.min(r, w / 2, h / 2);
    const straightW = Math.max(0, w - 2 * r);
    const straightH = Math.max(0, h - 2 * r);
    const arcLen = (Math.PI / 2) * r;

    const perimeter = 2 * straightW + 2 * straightH + 4 * arcLen;
    let dist = (progress % 1) * perimeter;
    if (dist < 0) dist += perimeter;

    if (dist <= straightW) return { x: r + dist, y: 0, edge: 'top' as const };
    dist -= straightW;
    if (dist <= arcLen) {
        const angle = -Math.PI / 2 + (dist / arcLen) * (Math.PI / 2);
        return { x: w - r + Math.cos(angle) * r, y: r + Math.sin(angle) * r, edge: 'top' as const };
    }
    dist -= arcLen;
    if (dist <= straightH) return { x: w, y: r + dist, edge: 'right' as const };
    dist -= straightH;
    if (dist <= arcLen) {
        const angle = (dist / arcLen) * (Math.PI / 2);
        return { x: w - r + Math.cos(angle) * r, y: h - r + Math.sin(angle) * r, edge: 'right' as const };
    }
    dist -= arcLen;
    if (dist <= straightW) return { x: w - r - dist, y: h, edge: 'bottom' as const };
    dist -= straightW;
    if (dist <= arcLen) {
        const angle = Math.PI / 2 + (dist / arcLen) * (Math.PI / 2);
        return { x: r + Math.cos(angle) * r, y: h - r + Math.sin(angle) * r, edge: 'bottom' as const };
    }
    dist -= arcLen;
    if (dist <= straightH) return { x: 0, y: h - r - dist, edge: 'left' as const };
    dist -= straightH;
    const angle = Math.PI + (dist / arcLen) * (Math.PI / 2);
    return { x: r + Math.cos(angle) * r, y: r + Math.sin(angle) * r, edge: 'left' as const };
};

const SocialNode = ({ social, index, total, dimensions, hovered, setHovered }: any) => {
    const progress = useMotionValue(index / total);

    useAnimationFrame((t, delta) => {
        if (!hovered) {
            let newProgress = progress.get() + delta / 30000;
            if (newProgress >= 1) newProgress -= 1;
            progress.set(newProgress);
        }
    });

    const isHovered = hovered === social.name;
    const Icon = social.icon;

    const [tooltipStyle, setTooltipStyle] = useState<any>({});
    const [arrowStyle, setArrowStyle] = useState<any>({});

    useEffect(() => {
        if (isHovered) {
            const padding = 60;
            const radius = 60;
            const w = Math.max(0, dimensions.width - padding * 2);
            const h = Math.max(0, dimensions.height - padding * 2);
            const pos = getRoundedRectPosInfo(progress.get(), w, h, radius);
            const edge = pos.edge;

            // cx and cy are the exact center coordinates of the orb relative to the container
            const cx = pos.x + padding;
            const cy = pos.y + padding;

            let tStyle: any = { position: 'absolute' };
            let aStyle: any = {
                width: 16, height: 16,
                position: 'absolute',
                backgroundColor: '#0f172a',
                zIndex: -1
            };

            const cardWidth = 224;  // 14rem
            const cardHeight = 150; // Approximated content height
            const limitX = cardWidth / 2 + 20;
            const limitY = cardHeight / 2 + 20;

            if (edge === 'top') {
                tStyle.top = '130%';
                aStyle.top = '-8px';
                aStyle.borderTop = `1px solid ${social.color}`;
                aStyle.borderLeft = `1px solid ${social.color}`;
                tStyle.borderTop = `4px solid ${social.color}`;

                if (cx < limitX) {
                    tStyle.left = '0%';
                    aStyle.left = '20px';
                } else if (cx > dimensions.width - limitX) {
                    tStyle.right = '0%';
                    aStyle.right = '20px';
                } else {
                    tStyle.left = '50%';
                    tStyle.marginLeft = '-112px';
                    aStyle.left = '104px';
                }
                aStyle.transform = 'rotate(45deg)';
            } else if (edge === 'bottom') {
                tStyle.bottom = '130%';
                aStyle.bottom = '-8px';
                aStyle.borderBottom = `1px solid ${social.color}`;
                aStyle.borderRight = `1px solid ${social.color}`;
                tStyle.borderBottom = `4px solid ${social.color}`;

                if (cx < limitX) {
                    tStyle.left = '0%';
                    aStyle.left = '20px';
                } else if (cx > dimensions.width - limitX) {
                    tStyle.right = '0%';
                    aStyle.right = '20px';
                } else {
                    tStyle.left = '50%';
                    tStyle.marginLeft = '-112px';
                    aStyle.left = '104px';
                }
                aStyle.transform = 'rotate(45deg)';
            } else if (edge === 'left') {
                tStyle.left = '130%';
                aStyle.left = '-8px';
                aStyle.borderBottom = `1px solid ${social.color}`;
                aStyle.borderLeft = `1px solid ${social.color}`;
                tStyle.borderLeft = `4px solid ${social.color}`;

                if (cy < limitY) {
                    tStyle.top = '0%';
                    aStyle.top = '20px';
                } else if (cy > dimensions.height - limitY) {
                    tStyle.bottom = '0%';
                    aStyle.bottom = '20px';
                } else {
                    tStyle.top = '50%';
                    tStyle.marginTop = '-75px';
                    aStyle.top = '67px';
                }
                aStyle.transform = 'rotate(45deg)';
            } else if (edge === 'right') {
                tStyle.right = '130%';
                aStyle.right = '-8px';
                aStyle.borderTop = `1px solid ${social.color}`;
                aStyle.borderRight = `1px solid ${social.color}`;
                tStyle.borderRight = `4px solid ${social.color}`;

                if (cy < limitY) {
                    tStyle.top = '0%';
                    aStyle.top = '20px';
                } else if (cy > dimensions.height - limitY) {
                    tStyle.bottom = '0%';
                    aStyle.bottom = '20px';
                } else {
                    tStyle.top = '50%';
                    tStyle.marginTop = '-75px';
                    aStyle.top = '67px';
                }
                aStyle.transform = 'rotate(45deg)';
            }

            setTooltipStyle(tStyle);
            setArrowStyle(aStyle);
        }
    }, [isHovered, dimensions, progress, social.color]);

    const x = useTransform(progress, p => {
        const padding = 60;
        const radius = 60;
        const w = Math.max(0, dimensions.width - padding * 2);
        const h = Math.max(0, dimensions.height - padding * 2);
        return getRoundedRectPosInfo(p, w, h, radius).x + padding;
    });

    const y = useTransform(progress, p => {
        const padding = 60;
        const radius = 60;
        const w = Math.max(0, dimensions.width - padding * 2);
        const h = Math.max(0, dimensions.height - padding * 2);
        return getRoundedRectPosInfo(p, w, h, radius).y + padding;
    });

    return (
        <motion.div
            className="absolute pointer-events-auto"
            style={{ x, y }}
        >
            <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                onMouseEnter={() => setHovered(social.name)}
                onMouseLeave={() => setHovered(null)}
            >
                <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 border-2 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer"
                    style={{
                        borderColor: isHovered ? social.color : 'rgba(255,255,255,0.05)',
                        boxShadow: isHovered ? `0 0 40px ${social.color}70` : '0 0 10px rgba(0,0,0,0.5)',
                        backgroundColor: isHovered ? social.color : '#0f172a',
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        zIndex: isHovered ? 50 : 10
                    }}
                >
                    <div className="transition-colors duration-300" style={{ color: isHovered ? (social.textColor || '#fff') : '#64748b' }}>
                        <Icon size={26} />
                    </div>

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`bg-slate-900 border border-slate-700/50 rounded-xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col items-center text-center cursor-pointer z-[100]`}
                                style={{ ...tooltipStyle, width: '224px' }}
                            >
                                <div style={arrowStyle} />

                                <Icon size={28} color={social.color} className="mb-3" />
                                <span className="text-white font-bold text-lg mb-1 leading-none">{social.name}</span>
                                <span className="text-xs text-sky-400 font-mono mb-3 bg-sky-950/50 px-2 py-1 rounded w-full line-clamp-1">{social.handle}</span>
                                <span className="text-sm text-slate-300 leading-snug">{social.hook}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </a>
            </div>
        </motion.div>
    );
};

export const SocialHub = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [hovered, setHovered] = useState<string | null>(null);

    const mouseX = useMotionValue(400);
    const mouseY = useMotionValue(300);
    const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });
    const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 100 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
                mouseX.set(width / 2);
                mouseY.set(height / 2);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [mouseX, mouseY]);

    return (
        <section className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto" id="socials">
            <SectionHeader title="Where I Hang Out" watermark="CONNECT" alignment="center" />

            {/* Mobile Layout */}
            <div className="flex flex-col gap-4 md:hidden w-full max-w-md mx-auto relative z-10">
                {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-5 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg"
                            style={{ borderLeftWidth: 4, borderLeftColor: social.color }}
                        >
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner"
                                style={{ backgroundColor: social.color, color: social.textColor || '#fff' }}
                            >
                                <Icon size={26} color={social.textColor || '#fff'} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-white font-bold text-xl leading-none mb-1.5">{social.name}</span>
                                <span className="text-sky-400 font-mono text-xs mb-1.5 line-clamp-1">{social.handle}</span>
                                <span className="text-slate-300 text-sm leading-tight">{social.hook}</span>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Desktop Layout */}
            <div
                ref={containerRef}
                className="hidden md:flex relative w-full h-[600px] bg-slate-900/20 backdrop-blur-sm rounded-3xl border border-slate-800 items-center justify-center group shadow-2xl"
                onMouseMove={(e) => {
                    if (!containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    mouseX.set(e.clientX - rect.left);
                    mouseY.set(e.clientY - rect.top);
                }}
                onMouseLeave={() => {
                    const center = { x: dimensions.width / 2, y: dimensions.height / 2 };
                    mouseX.set(center.x);
                    mouseY.set(center.y);
                }}
            >
                {/* Background stars removed to blend completely with original theme */}

                {/* Ambient Hover Glow behind text */}
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.12, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center -translate-y-[5%]"
                        >
                            {(() => {
                                const sc = socials.find(s => s.name === hovered);
                                const Icon = sc?.icon;
                                return Icon ? <Icon size={350} color={sc?.color} /> : null;
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* The Bold Sentence Parallax Centerpiece */}
                <motion.div
                    className="absolute z-30 pointer-events-none max-w-4xl mx-auto px-4 px-12 text-center"
                    style={{
                        x: useTransform(smoothMouseX, [0, dimensions.width], [-15, 15]),
                        y: useTransform(smoothMouseY, [0, dimensions.height], [-15, 15]),
                    }}
                >
                    <div className="text-3xl md:text-5xl lg:text-5xl font-black text-slate-500 leading-[1.6] tracking-tight pointer-events-auto">
                        I grow my skills on{" "}
                        <Highlight word="Trailhead" hovered={hovered} setHovered={setHovered} />
                        {", "} network on{" "}
                        <Highlight word="LinkedIn" hovered={hovered} setHovered={setHovered} />
                        {", "} write deep-dives on{" "}
                        <Highlight word="Medium" hovered={hovered} setHovered={setHovered} />
                        {", "} share life on{" "}
                        <Highlight word="Instagram" hovered={hovered} setHovered={setHovered} />
                        {", "} push open-source code on{" "}
                        <Highlight word="GitHub" hovered={hovered} setHovered={setHovered} />
                        {", and sometimes talk on "}
                        <Highlight word="X" hovered={hovered} setHovered={setHovered} />
                        .
                    </div>
                </motion.div>

                {/* Border-tracking Social Nodes */}
                <div className="absolute inset-0 z-40 pointer-events-none">
                    {socials.map((social, i) => (
                        <SocialNode
                            key={social.name}
                            social={social}
                            index={i}
                            total={socials.length}
                            dimensions={dimensions}
                            hovered={hovered}
                            setHovered={setHovered}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
