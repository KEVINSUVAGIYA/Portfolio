"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Type, Settings2, Sparkles } from "lucide-react";

// ---- CONFIGURATION ----
interface ParticleConfig {
    particleSize: number;
    movementIntensity: number;
    color: string;
    mouseRepelRadius: number;
}

const DEFAULT_CONFIG: ParticleConfig = {
    particleSize: 2,
    movementIntensity: 0.6,
    color: "#4aeadc",
    mouseRepelRadius: 100,
};

// ---- PARTICLE ----
interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    targetX: number;
    targetY: number;
    size: number;
    vx: number;
    vy: number;
    life: number;
    hasTarget: boolean;
}

// ---- COLOR PRESETS ----
const COLOR_PRESETS = [
    { name: "Cyan", color: "#4aeadc" },
    { name: "Emerald", color: "#34d399" },
    { name: "Violet", color: "#a78bfa" },
    { name: "Rose", color: "#fb7185" },
    { name: "Amber", color: "#fbbf24" },
    { name: "Sky", color: "#38bdf8" },
];

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// ---- AUDIO ----
let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext {
    if (!audioCtx) {
        const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
}

// Shimmer sound when text forms — a rising arpeggio of soft sine tones
function playFormSound() {
    try {
        const ctx = getAudioContext();
        const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.08 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);

            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(2000, ctx.currentTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.5);
        });
    } catch (_) { /* no audio */ }
}

// Soft hover/repel tone — subtle whisper when cursor pushes particles
let lastRepelSoundTime = 0;
function playRepelSound(intensity: number) {
    const now = performance.now();
    if (now - lastRepelSoundTime < 150) return; // Throttle to ~6 sounds/sec max
    lastRepelSoundTime = now;

    try {
        const ctx = getAudioContext();
        const vol = Math.min(0.04, intensity * 0.03); // Very subtle

        const osc = ctx.createOscillator();
        osc.type = "sine";
        const freq = 300 + intensity * 400;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + 0.15);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } catch (_) { /* no audio */ }
}

// Clear/scatter sound when text is cleared
function playClearSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
    } catch (_) { /* no audio */ }
}

export const ParticleVerseCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef(0);
    const mouseRef = useRef({ x: -9999, y: -9999, active: false });
    const configRef = useRef<ParticleConfig>({ ...DEFAULT_CONFIG });
    const textRef = useRef("");
    const textBitmapRef = useRef<boolean[]>([]);
    const textWidthRef = useRef(0);
    const hasTextRef = useRef(false);

    const [config, setConfig] = useState<ParticleConfig>({ ...DEFAULT_CONFIG });
    const [text, setText] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [showHint, setShowHint] = useState(true);

    // Sync config ref
    useEffect(() => {
        configRef.current = config;
    }, [config]);

    // Sample text to bitmap
    const sampleText = useCallback((inputText: string, canvasWidth: number, canvasHeight: number) => {
        if (!inputText.trim()) {
            hasTextRef.current = false;
            textBitmapRef.current = [];
            particlesRef.current.forEach(p => { p.hasTarget = false; });
            return;
        }

        const offscreen = document.createElement("canvas");
        const ctx = offscreen.getContext("2d")!;

        const maxWidth = canvasWidth * 0.8;
        const maxHeight = canvasHeight * 0.4;
        let fontSize = Math.min(maxWidth / (inputText.length * 0.55), maxHeight);
        fontSize = Math.max(40, Math.min(fontSize, 200));

        offscreen.width = canvasWidth;
        offscreen.height = canvasHeight;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.font = `bold ${fontSize}px 'Inter', 'Segoe UI', sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(inputText, canvasWidth / 2, canvasHeight / 2);

        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const bitmap: boolean[] = [];
        const step = 3;

        const sampledW = Math.ceil(canvasWidth / step);

        for (let y = 0; y < canvasHeight; y += step) {
            for (let x = 0; x < canvasWidth; x += step) {
                const idx = (y * canvasWidth + x) * 4;
                bitmap.push(imageData.data[idx] > 128);
            }
        }

        textBitmapRef.current = bitmap;
        textWidthRef.current = sampledW;
        hasTextRef.current = true;

        // Assign targets to particles
        const targetPositions: { x: number; y: number }[] = [];
        for (let i = 0; i < bitmap.length; i++) {
            if (bitmap[i]) {
                const x = (i % sampledW) * step;
                const y = Math.floor(i / sampledW) * step;
                targetPositions.push({ x, y });
            }
        }

        // Shuffle targets
        for (let i = targetPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [targetPositions[i], targetPositions[j]] = [targetPositions[j], targetPositions[i]];
        }

        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
            if (i < targetPositions.length) {
                particles[i].targetX = targetPositions[i].x;
                particles[i].targetY = targetPositions[i].y;
                particles[i].hasTarget = true;
            } else {
                particles[i].hasTarget = false;
            }
        }
    }, []);

    // Handle text submit
    const handleTextSubmit = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        textRef.current = text;
        sampleText(text, canvas.width, canvas.height);
        if (text.trim()) {
            setShowHint(false);
            playFormSound();
        } else {
            playClearSound();
        }
    }, [text, sampleText]);

    // Initialize particles + animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (textRef.current) {
                sampleText(textRef.current, canvas.width, canvas.height);
            }
        };
        resize();
        window.addEventListener("resize", resize);

        // Initialize particles
        const PARTICLE_COUNT = 6000;
        const particles: Particle[] = [];
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const spread = Math.min(canvas.width, canvas.height) * 0.35;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * spread;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            const baseSize = 0.5 + Math.random() * 2.5;

            particles.push({
                x, y,
                baseX: x, baseY: y,
                targetX: x, targetY: y,
                size: baseSize,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                life: Math.random(),
                hasTarget: false,
            });
        }
        particlesRef.current = particles;

        // Animation
        const animate = () => {
            const cfg = configRef.current;
            const { r, g, b } = hexToRgb(cfg.color);
            const mouse = mouseRef.current;
            const pts = particlesRef.current;
            const sizeMultiplier = cfg.particleSize / 2; // 2 is default

            // Clear with slight trail
            ctx.fillStyle = "rgba(5, 5, 15, 0.88)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                p.life += 0.003;

                if (p.hasTarget) {
                    const dx = p.targetX - p.x;
                    const dy = p.targetY - p.y;
                    p.vx += dx * 0.03;
                    p.vy += dy * 0.03;
                } else {
                    const ccx = canvas.width / 2;
                    const ccy = canvas.height / 2;
                    const dx = ccx - p.x;
                    const dy = ccy - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = Math.min(canvas.width, canvas.height) * 0.35;

                    if (dist > maxDist) {
                        p.vx += dx * 0.001;
                        p.vy += dy * 0.001;
                    }

                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle + Math.PI / 2) * 0.02 * cfg.movementIntensity;
                    p.vy += Math.sin(angle + Math.PI / 2) * 0.02 * cfg.movementIntensity;

                    p.vx += (Math.sin(p.life * 3 + i * 0.01) * 0.1) * cfg.movementIntensity;
                    p.vy += (Math.cos(p.life * 2.5 + i * 0.013) * 0.1) * cfg.movementIntensity;
                }

                // Mouse repulsion
                if (mouse.active) {
                    const mdx = p.x - mouse.x;
                    const mdy = p.y - mouse.y;
                    const md = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (md < cfg.mouseRepelRadius) {
                        const force = (1 - md / cfg.mouseRepelRadius) * 8;
                        p.vx += (mdx / md) * force;
                        p.vy += (mdy / md) * force;
                        // Trigger subtle sound for first particle in range (throttled internally)
                        if (i === 0 || i % 200 === 0) {
                            playRepelSound(1 - md / cfg.mouseRepelRadius);
                        }
                    }
                }

                // Damping
                p.vx *= 0.92;
                p.vy *= 0.92;
                p.x += p.vx;
                p.y += p.vy;

                // Draw
                const pulse = 0.6 + Math.sin(p.life * 4 + i * 0.02) * 0.4;
                const alpha = pulse * 0.8;
                const drawSize = p.size * sizeMultiplier;

                // Soft glow
                const glowSize = drawSize * 2.5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fill();
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [sampleText]);

    // Mouse handlers
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = { ...mouseRef.current, active: false };
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length > 0) {
            mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        mouseRef.current = { ...mouseRef.current, active: false };
    }, []);

    const updateConfig = (key: keyof ParticleConfig, value: number | string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="relative w-full h-screen overflow-hidden select-none bg-[#05050f]">
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="absolute inset-0 w-full h-full z-10"
                style={{ cursor: "crosshair" }}
            />

            {/* Back button */}
            <div className="absolute top-5 left-5 z-50 flex items-center gap-3">
                <Link
                    href="/#playgrounds"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors border border-white/10 bg-black/20 backdrop-blur-md"
                >
                    <ArrowLeft size={15} /> Portfolio
                </Link>
            </div>

            {/* Text Input Bar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
                    <Type size={16} className="text-white/40 flex-shrink-0" />
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleTextSubmit(); }}
                        placeholder="Type anything..."
                        className="bg-transparent border-none outline-none text-white/90 text-sm placeholder:text-white/25 w-48 sm:w-64 font-medium"
                        maxLength={20}
                    />
                    <button
                        onClick={handleTextSubmit}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300"
                        style={{
                            background: `linear-gradient(135deg, ${config.color}20, ${config.color}10)`,
                            borderColor: `${config.color}30`,
                            border: `1px solid ${config.color}30`,
                            color: config.color,
                        }}
                    >
                        Form
                    </button>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${showSettings ? "bg-white/10 border-white/20 text-white" : "bg-black/30 border-white/10 text-white/60 hover:text-white"}`}
                >
                    <Settings2 size={16} />
                </button>
            </div>

            {/* Simplified Settings Panel */}
            {showSettings && (
                <div className="absolute bottom-24 right-6 z-50 w-72 p-5 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col gap-5">
                    <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                        <Sparkles size={14} style={{ color: config.color }} />
                        Customize
                    </div>

                    {/* Particle Size — single intuitive slider */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-white/50">
                            <span>Particle Size</span>
                            <span>{config.particleSize < 1.5 ? "Tiny" : config.particleSize < 3 ? "Normal" : "Large"}</span>
                        </div>
                        <input type="range" min="0.5" max="5" step="0.1" value={config.particleSize}
                            onChange={e => updateConfig("particleSize", parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Movement — how alive particles feel */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-white/50">
                            <span>Movement</span>
                            <span>{config.movementIntensity < 0.3 ? "Calm" : config.movementIntensity < 1 ? "Gentle" : "Energetic"}</span>
                        </div>
                        <input type="range" min="0" max="2" step="0.05" value={config.movementIntensity}
                            onChange={e => updateConfig("movementIntensity", parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Cursor Influence — how much cursor pushes particles */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-white/50">
                            <span>Cursor Influence</span>
                            <span>{config.mouseRepelRadius < 60 ? "Subtle" : config.mouseRepelRadius < 150 ? "Medium" : "Strong"}</span>
                        </div>
                        <input type="range" min="30" max="250" step="5" value={config.mouseRepelRadius}
                            onChange={e => updateConfig("mouseRepelRadius", parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Color Presets */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-white/50">Color</span>
                        <div className="flex items-center gap-2 flex-wrap">
                            {COLOR_PRESETS.map(preset => (
                                <button
                                    key={preset.name}
                                    onClick={() => updateConfig("color", preset.color)}
                                    className={`w-7 h-7 rounded-full border-2 transition-all duration-300 ${config.color === preset.color ? "scale-110 border-white/70" : "border-white/15 hover:border-white/40"}`}
                                    style={{ background: preset.color }}
                                    title={preset.name}
                                />
                            ))}
                            <div className="relative w-7 h-7 rounded-full border-2 border-white/15 hover:border-white/40 overflow-hidden transition-all">
                                <input
                                    type="color"
                                    value={config.color}
                                    onChange={e => updateConfig("color", e.target.value)}
                                    className="absolute inset-[-10px] w-12 h-12 opacity-0 cursor-pointer"
                                />
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 via-green-400 to-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hint overlay — much more visible */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 transition-opacity duration-1000 ${showHint ? "opacity-100" : "opacity-0"}`}>
                <div className="flex flex-col items-center gap-5">
                    <p className="text-white/50 text-lg sm:text-xl tracking-wide font-light text-center px-4">
                        Type something below and press <span className="font-medium text-white/70">Form</span>
                    </p>
                    <p className="text-white/25 text-sm tracking-wider">move your cursor to push particles apart</p>
                </div>
            </div>
        </div>
    );
};
