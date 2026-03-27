"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Settings2, Palette } from "lucide-react";

// ---- CONFIG ----
interface WaveConfig {
    waveSpeed: number;
    wavePersistence: number;
    colorScheme: string;
}

const DEFAULT_CONFIG: WaveConfig = {
    waveSpeed: 0.15,
    wavePersistence: 0.85,
    colorScheme: "ocean",
};

// Color schemes
const COLOR_SCHEMES: Record<string, {
    name: string;
    bg: string;
    cellBase: string;
    waveColors: string[];
    glowColor: string;
}> = {
    ocean: {
        name: "Ocean",
        bg: "#060d1a",
        cellBase: "rgba(20, 40, 70, 0.6)",
        waveColors: ["#0ea5e9", "#06b6d4", "#22d3ee", "#67e8f9", "#a5f3fc"],
        glowColor: "rgba(14, 165, 233, 0.3)",
    },
    lavender: {
        name: "Lavender",
        bg: "#0d0a1a",
        cellBase: "rgba(40, 20, 70, 0.6)",
        waveColors: ["#a78bfa", "#8b5cf6", "#c4b5fd", "#ddd6fe", "#ede9fe"],
        glowColor: "rgba(167, 139, 250, 0.3)",
    },
    forest: {
        name: "Forest",
        bg: "#060f0a",
        cellBase: "rgba(15, 50, 30, 0.6)",
        waveColors: ["#34d399", "#10b981", "#6ee7b7", "#a7f3d0", "#d1fae5"],
        glowColor: "rgba(52, 211, 153, 0.3)",
    },
    sunset: {
        name: "Sunset",
        bg: "#1a0a06",
        cellBase: "rgba(70, 25, 15, 0.6)",
        waveColors: ["#fb923c", "#f97316", "#fdba74", "#fed7aa", "#ffedd5"],
        glowColor: "rgba(251, 146, 60, 0.3)",
    },
    rose: {
        name: "Rose",
        bg: "#1a060d",
        cellBase: "rgba(70, 15, 35, 0.6)",
        waveColors: ["#fb7185", "#f43f5e", "#fda4af", "#fecdd3", "#ffe4e6"],
        glowColor: "rgba(251, 113, 133, 0.3)",
    },
    mono: {
        name: "Mono",
        bg: "#0a0a0a",
        cellBase: "rgba(30, 30, 30, 0.6)",
        waveColors: ["#d4d4d4", "#a3a3a3", "#e5e5e5", "#f5f5f5", "#fafafa"],
        glowColor: "rgba(212, 212, 212, 0.2)",
    },
};

// Fixed grid constants
const COLS = 32;
const ROWS = 20;
const GAP = 4;
const CORNER_R = 4;
const ELASTICITY = 0.25;
const MAX_AMP = 1;

export const WaveFieldCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Double-buffer for wave simulation — pre-allocated typed arrays
    const ampA = useRef<Float32Array>(new Float32Array(COLS * ROWS));
    const ampB = useRef<Float32Array>(new Float32Array(COLS * ROWS));
    const velRef = useRef<Float32Array>(new Float32Array(COLS * ROWS));
    const animRef = useRef(0);
    const configRef = useRef<WaveConfig>({ ...DEFAULT_CONFIG });
    const mouseRef = useRef({ x: -1, y: -1 });
    const lastWaveTimeRef = useRef(0);

    const [config, setConfig] = useState<WaveConfig>({ ...DEFAULT_CONFIG });
    const [showSettings, setShowSettings] = useState(false);
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    // Trigger wave at grid position
    const triggerWave = useCallback((col: number, row: number, strength: number = 1) => {
        if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
            velRef.current[row * COLS + col] += strength * MAX_AMP * 15;
            setShowHint(false);
        }
    }, []);

    // Simple soft click sound
    const playClickSound = useCallback((col: number, row: number) => {
        try {
            const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();

            const baseFreq = 220;
            const freq = baseFreq + (col / COLS) * 200 + (row / ROWS) * 100;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            gain.connect(ctx.destination);

            const osc = ctx.createOscillator();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.5);

            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(600, ctx.currentTime);
            osc.connect(filter);
            filter.connect(gain);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.6);
        } catch (_) { /* no audio */ }
    }, []);

    // Get cell from pixel
    const getCellFromPixel = useCallback((px: number, py: number, cw: number, ch: number) => {
        const cellW = (cw - (COLS + 1) * GAP) / COLS;
        const cellH = (ch - (ROWS + 1) * GAP) / ROWS;
        const col = Math.floor((px - GAP) / (cellW + GAP));
        const row = Math.floor((py - GAP) / (cellH + GAP));
        if (col >= 0 && col < COLS && row >= 0 && row < ROWS) return { col, row };
        return null;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Reset buffers
        ampA.current.fill(0);
        ampB.current.fill(0);
        velRef.current.fill(0);

        // Reusable path for rounded rect
        const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        };

        const animate = () => {
            const cfg = configRef.current;
            const scheme = COLOR_SCHEMES[cfg.colorScheme] || COLOR_SCHEMES.ocean;
            const amp = ampA.current;
            const vel = velRef.current;

            const cw = canvas.width;
            const ch = canvas.height;
            const cellW = (cw - (COLS + 1) * GAP) / COLS;
            const cellH = (ch - (ROWS + 1) * GAP) / ROWS;

            // Background
            ctx.fillStyle = scheme.bg;
            ctx.fillRect(0, 0, cw, ch);

            // Wave physics — in-place with velocity array
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const idx = row * COLS + col;

                    // Average of orthogonal + diagonal neighbors
                    let neighborSum = 0;
                    let neighborCount = 0;

                    if (col > 0) { neighborSum += amp[idx - 1]; neighborCount++; }
                    if (col < COLS - 1) { neighborSum += amp[idx + 1]; neighborCount++; }
                    if (row > 0) { neighborSum += amp[idx - COLS]; neighborCount++; }
                    if (row < ROWS - 1) { neighborSum += amp[idx + COLS]; neighborCount++; }
                    // Diagonal (half weight)
                    if (col > 0 && row > 0) { neighborSum += amp[idx - COLS - 1] * 0.5; neighborCount += 0.5; }
                    if (col < COLS - 1 && row > 0) { neighborSum += amp[idx - COLS + 1] * 0.5; neighborCount += 0.5; }
                    if (col > 0 && row < ROWS - 1) { neighborSum += amp[idx + COLS - 1] * 0.5; neighborCount += 0.5; }
                    if (col < COLS - 1 && row < ROWS - 1) { neighborSum += amp[idx + COLS + 1] * 0.5; neighborCount += 0.5; }

                    const avg = neighborCount > 0 ? neighborSum / neighborCount : 0;
                    vel[idx] += (avg - amp[idx]) * ELASTICITY;
                    vel[idx] *= cfg.wavePersistence;
                    amp[idx] += vel[idx] * cfg.waveSpeed;
                    amp[idx] = Math.max(-MAX_AMP, Math.min(MAX_AMP, amp[idx]));

                    // Zero out tiny values — aggressive threshold for snappy clearing
                    if (Math.abs(amp[idx]) < 0.005 && Math.abs(vel[idx]) < 0.005) {
                        amp[idx] = 0;
                        vel[idx] = 0;
                    }
                }
            }

            // Draw cells
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const idx = row * COLS + col;
                    const a = amp[idx];
                    const absAmp = Math.abs(a);
                    const normAmp = Math.min(1, absAmp / MAX_AMP);

                    const x = GAP + col * (cellW + GAP);
                    const y = GAP + row * (cellH + GAP);

                    const scale = 1 - normAmp * 0.15;
                    const sw = cellW * scale;
                    const sh = cellH * scale;
                    const ox = (cellW - sw) / 2;
                    const oy = (cellH - sh) / 2;

                    const colorIdx = Math.min(scheme.waveColors.length - 1, Math.floor(normAmp * (scheme.waveColors.length - 1)));

                    // Glow for active cells
                    if (normAmp > 0.05) {
                        ctx.save();
                        ctx.shadowColor = scheme.glowColor;
                        ctx.shadowBlur = normAmp * 20;
                        ctx.fillStyle = scheme.waveColors[colorIdx];
                        ctx.globalAlpha = normAmp * 0.5;
                        drawRoundedRect(x + ox - 1, y + oy - 1, sw + 2, sh + 2, CORNER_R);
                        ctx.fill();
                        ctx.restore();
                    }

                    // Cell fill
                    ctx.save();
                    if (normAmp > 0.01) {
                        ctx.fillStyle = scheme.waveColors[colorIdx];
                        ctx.globalAlpha = 0.3 + normAmp * 0.7;
                    } else {
                        ctx.fillStyle = scheme.cellBase;
                        ctx.globalAlpha = 1;
                    }
                    drawRoundedRect(x + ox, y + oy, sw, sh, CORNER_R);
                    ctx.fill();

                    // Border
                    ctx.strokeStyle = normAmp > 0.05
                        ? `rgba(255,255,255,${0.05 + normAmp * 0.12})`
                        : "rgba(255,255,255,0.03)";
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Hover highlight
            const mouse = mouseRef.current;
            if (mouse.x >= 0 && mouse.y >= 0) {
                const pos = getCellFromPixel(mouse.x, mouse.y, cw, ch);
                if (pos) {
                    const hx = GAP + pos.col * (cellW + GAP);
                    const hy = GAP + pos.row * (cellH + GAP);
                    ctx.save();
                    ctx.strokeStyle = "rgba(255,255,255,0.12)";
                    ctx.lineWidth = 1;
                    drawRoundedRect(hx, hy, cellW, cellH, CORNER_R);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [getCellFromPixel]);

    // Handlers
    const handleClick = useCallback((e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const pos = getCellFromPixel(e.clientX, e.clientY, canvas.width, canvas.height);
        if (pos) {
            triggerWave(pos.col, pos.row, 1);
            playClickSound(pos.col, pos.row);
        }
    }, [getCellFromPixel, triggerWave, playClickSound]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        if (e.buttons > 0) {
            const now = performance.now();
            if (now - lastWaveTimeRef.current > 60) {
                lastWaveTimeRef.current = now;
                const canvas = canvasRef.current;
                if (!canvas) return;
                const pos = getCellFromPixel(e.clientX, e.clientY, canvas.width, canvas.height);
                if (pos) triggerWave(pos.col, pos.row, 0.5);
            }
        }
    }, [getCellFromPixel, triggerWave]);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = { x: -1, y: -1 };
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length > 0) {
            const t = e.touches[0];
            const canvas = canvasRef.current;
            if (!canvas) return;
            const pos = getCellFromPixel(t.clientX, t.clientY, canvas.width, canvas.height);
            if (pos) {
                triggerWave(pos.col, pos.row, 1);
                playClickSound(pos.col, pos.row);
            }
        }
    }, [getCellFromPixel, triggerWave, playClickSound]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length > 0) {
            const t = e.touches[0];
            const now = performance.now();
            if (now - lastWaveTimeRef.current > 80) {
                lastWaveTimeRef.current = now;
                const canvas = canvasRef.current;
                if (!canvas) return;
                const pos = getCellFromPixel(t.clientX, t.clientY, canvas.width, canvas.height);
                if (pos) triggerWave(pos.col, pos.row, 0.4);
            }
        }
    }, [getCellFromPixel, triggerWave]);

    const updateConfig = (key: keyof WaveConfig, value: number | string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const scheme = COLOR_SCHEMES[config.colorScheme] || COLOR_SCHEMES.ocean;

    return (
        <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: scheme.bg }}>
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
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

            {/* Bottom controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl">
                    {/* Quick color scheme switcher */}
                    {Object.entries(COLOR_SCHEMES).map(([key, s]) => (
                        <button
                            key={key}
                            onClick={() => updateConfig("colorScheme", key)}
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${config.colorScheme === key ? "scale-110 border-white/60" : "border-white/15 hover:border-white/40"}`}
                            style={{ background: s.waveColors[0] }}
                            title={s.name}
                        />
                    ))}
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-300 ${showSettings ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/10 text-white/60 hover:text-white"}`}
                    >
                        <Settings2 size={15} />
                    </button>
                </div>
            </div>

            {/* Simplified Settings Panel — only 2 sliders */}
            {showSettings && (
                <div className="absolute bottom-24 right-6 z-50 w-72 p-5 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col gap-5">
                    <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                        <Palette size={14} style={{ color: scheme.waveColors[0] }} />
                        Customize
                    </div>

                    {/* Wave Speed */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-white/50">
                            <span>Wave Speed</span>
                            <span>{config.waveSpeed < 0.1 ? "Slow" : config.waveSpeed < 0.2 ? "Normal" : "Fast"}</span>
                        </div>
                        <input type="range" min="0.02" max="0.3" step="0.01" value={config.waveSpeed}
                            onChange={e => updateConfig("waveSpeed", parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>

                    {/* Wave Persistence */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-white/50">
                            <span>Ripple Duration</span>
                            <span>{config.wavePersistence < 0.83 ? "Short" : config.wavePersistence < 0.92 ? "Normal" : "Long"}</span>
                        </div>
                        <input type="range" min="0.8" max="0.99" step="0.005" value={config.wavePersistence}
                            onChange={e => updateConfig("wavePersistence", parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>
                </div>
            )}

            {/* Hint */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-40 transition-opacity duration-1500 ${showHint ? "opacity-100" : "opacity-0"}`}>
                <div className="flex flex-col items-center gap-3">
                    <p className="text-white/40 text-lg sm:text-xl tracking-wide font-light">
                        click anywhere to create waves
                    </p>
                    <p className="text-white/20 text-sm tracking-wider">
                        drag to paint with ripples
                    </p>
                </div>
            </div>
        </div>
    );
};
