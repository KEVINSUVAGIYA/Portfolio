"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Camera, Droplets } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAudioCtx, getMainAudioNode, setGlobalAudioPaused } from "@/lib/audio";
import { PlaygroundAudioControls } from "@/components/Playground/AudioControls";

// ---- THEMES ----
const PRESET_THEMES = [
    { name: "Emerald Lake", water: "#1b5e4a", rippleRGB: [100, 220, 180], sky: "#0a2a1e", bottom: "#12402e" },
    { name: "Sapphire Pool", water: "#0e3a5c", rippleRGB: [80, 180, 255], sky: "#061a2e", bottom: "#0a2a45" },
];

const generateTheme = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    const darken = (val: number, f: number) => Math.floor(val * f).toString(16).padStart(2, '0');
    return {
        name: "Custom",
        water: hex,
        rippleRGB: [Math.min(255, r + 120), Math.min(255, g + 120), Math.min(255, b + 120)],
        sky: `#${darken(r, 0.4)}${darken(g, 0.4)}${darken(b, 0.4)}`,
        bottom: `#${darken(r, 0.7)}${darken(g, 0.7)}${darken(b, 0.7)}`
    };
};

// We now use the global audio context from @/lib/audio

const playDrop = () => {
    try {
        const ctx = getAudioCtx();
        const mainNode = getMainAudioNode();
        if (!ctx || !mainNode) return;
        if (ctx.state === "suspended") ctx.resume();
        const freq = 400 + Math.random() * 200; // Lower fundamental for 'plop'

        // Master Gain
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.001, ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.8, ctx.currentTime + 0.015);
        master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        master.connect(mainNode);

        // Core plop oscillator (rapid downward frequency sweep)
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.05);
        osc.connect(master);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);

        // High frequency transient "click"
        const clickOsc = ctx.createOscillator();
        clickOsc.type = "sine";
        clickOsc.frequency.setValueAtTime(freq * 3, ctx.currentTime);
        clickOsc.frequency.exponentialRampToValueAtTime(freq * 1.2, ctx.currentTime + 0.02);

        const clickGain = ctx.createGain();
        clickGain.gain.setValueAtTime(0, ctx.currentTime);
        clickGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.005);
        clickGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.03);
        clickOsc.connect(clickGain);
        clickGain.connect(master);
        clickOsc.start(ctx.currentTime);
        clickOsc.stop(ctx.currentTime + 0.05);

    } catch (_) { }
};

const playLeafDrop = () => {
    try {
        const ctx = getAudioCtx();
        const mainNode = getMainAudioNode();
        if (!ctx || !mainNode) return;
        if (ctx.state === "suspended") ctx.resume();

        // Very subtle high pitch soft impact
        const freq = 800 + Math.random() * 200;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.001, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
        master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        master.connect(mainNode);

        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, ctx.currentTime + 0.1);
        osc.connect(master);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } catch (_) { }
};

// ---- LEAF ANIMATION ----
interface Leaf { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; size: number; opacity: number; color: string; hasHitWater: boolean; }

const LEAF_COLORS = ["#3d7a3d", "#5a9e3a", "#7bc47a", "#a2d86e", "#c8e8a0"];

const spawnLeaf = (canvW: number): Leaf => ({
    x: Math.random() * canvW * 0.8 + canvW * 0.1,
    y: -20,
    vx: (Math.random() - 0.5) * 1.2,
    vy: 0.6 + Math.random() * 0.8,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.06,
    size: 8 + Math.random() * 10,
    opacity: 0.7 + Math.random() * 0.3,
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    hasHitWater: false
});

const drawLeaf = (ctx2d: CanvasRenderingContext2D, l: Leaf) => {
    ctx2d.save();
    ctx2d.translate(l.x, l.y);
    ctx2d.rotate(l.rot);
    ctx2d.globalAlpha = l.opacity;
    ctx2d.fillStyle = l.color;
    ctx2d.beginPath();
    // Start at top tip
    ctx2d.moveTo(0, -l.size);
    // Draw right curve
    ctx2d.quadraticCurveTo(l.size * 0.8, 0, 0, l.size);
    // Draw left curve back to top tip
    ctx2d.quadraticCurveTo(-l.size * 0.8, 0, 0, -l.size);
    ctx2d.fill();
    // Leaf vein
    ctx2d.strokeStyle = "rgba(255,255,255,0.15)";
    ctx2d.lineWidth = 0.5;
    ctx2d.beginPath();
    ctx2d.moveTo(0, -l.size); ctx2d.lineTo(0, l.size);
    ctx2d.stroke();
    ctx2d.restore();
};

export const RippleCanvas = () => {
    const waterCanvasRef = useRef<HTMLCanvasElement>(null); // Simulation
    const uiCanvasRef = useRef<HTMLCanvasElement>(null); // Leaves + UI
    const curBuf = useRef<Float32Array | null>(null);
    const prevBuf = useRef<Float32Array | null>(null);
    const simW = useRef(0); const simH = useRef(0);

    const waterAnimId = useRef(0);
    const uiAnimId = useRef(0);
    const leavesRef = useRef<Leaf[]>([]);
    const nextLeafTimer = useRef(0);
    const tapCountRef = useRef(0);

    const [themeIndex, setThemeIndex] = useState(0);
    const [customColor, setCustomColor] = useState("#0f5e9c");
    const activeThemeRef = useRef(PRESET_THEMES[0]);

    // Update ref when theme selection changes
    useEffect(() => {
        activeThemeRef.current = themeIndex < PRESET_THEMES.length ? PRESET_THEMES[themeIndex] : generateTheme(customColor);
    }, [themeIndex, customColor]);

    const [tapCount, setTapCount] = useState(0);
    const [captured, setCaptured] = useState(false);
    const [streakDays, setStreakDays] = useState(0);
    const [paused, setPaused] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const pausedRef = useRef(false); // Ref for requestAnimationFrame sync

    const togglePause = () => {
        setPaused(p => {
            const nextP = !p;
            pausedRef.current = nextP;
            setGlobalAudioPaused(nextP);
            return nextP;
        });
    };

    useEffect(() => {
        const last = localStorage.getItem("ripple_last_day");
        const today = new Date().toDateString();

        // Also load initial tap count here to prevent SSR hydration errors
        const savedTaps = parseInt(localStorage.getItem("ripple_taps") || "0");
        setTapCount(savedTaps);
        tapCountRef.current = savedTaps;
        const streak = parseInt(localStorage.getItem("ripple_streak") || "0");
        if (last !== today) {
            const yest = new Date(Date.now() - 86400000).toDateString();
            const ns = last === yest ? streak + 1 : 1;
            localStorage.setItem("ripple_streak", String(ns));
            localStorage.setItem("ripple_last_day", today);
            setStreakDays(ns);
        } else setStreakDays(streak);
    }, []);

    const initBuffers = useCallback((w: number, h: number) => {
        simW.current = w; simH.current = h;
        curBuf.current = new Float32Array(w * h);
        prevBuf.current = new Float32Array(w * h);
    }, []);

    const drop = useCallback((px: number, py: number, radius = 9, strength = 200) => {
        const w = simW.current; const h = simH.current;
        if (!curBuf.current) return;
        const cx = Math.floor(px / window.innerWidth * w);
        const cy = Math.floor(py / window.innerHeight * h);
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const dist2 = dx * dx + dy * dy;
                if (dist2 <= radius * radius) {
                    const nx = cx + dx; const ny = cy + dy;
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                        const dist = Math.sqrt(dist2);
                        // Smooth cosine falloff for droplet impact
                        const falloff = (Math.cos((dist / radius) * Math.PI) + 1) * 0.5;
                        curBuf.current[ny * w + nx] += strength * falloff;
                    }
                }
            }
        }
    }, []);

    // Water simulation loop
    useEffect(() => {
        const canvas = waterCanvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const SIM = 3;
        const sw = Math.floor(window.innerWidth / SIM);
        const sh = Math.floor(window.innerHeight / SIM);
        initBuffers(sw, sh);
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;

        const render = () => {
            const w = sw; const h = sh;
            const cur = curBuf.current!;
            const prev = prevBuf.current!;
            const theme = activeThemeRef.current;
            const [tr, tg, tb] = theme.rippleRGB;
            // Parse water base colour
            const wR = parseInt(theme.water.slice(1, 3), 16);
            const wG = parseInt(theme.water.slice(3, 5), 16);
            const wB = parseInt(theme.water.slice(5, 7), 16);
            // Parse bottom colour (slightly lighter for depth)
            const bR = parseInt(theme.bottom.slice(1, 3), 16);
            const bG = parseInt(theme.bottom.slice(3, 5), 16);
            const bB = parseInt(theme.bottom.slice(5, 7), 16);

            // Sim step
            if (!pausedRef.current) {
                for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
                    const i = y * w + x;
                    cur[i] = ((prev[(y - 1) * w + x] + prev[(y + 1) * w + x] + prev[y * w + x - 1] + prev[y * w + x + 1]) / 2 - cur[i]) * 0.984;
                }
                const tmp = curBuf.current!; curBuf.current = prevBuf.current!; prevBuf.current = tmp;
            }

            const img = ctx.createImageData(canvas.width, canvas.height);
            for (let y = 0; y < canvas.height; y++) {
                // depth gradient: top row = deeper (darker bottom showing), bottom row = surface
                const depthT = 1 - y / canvas.height; // 1 at top, 0 at bottom
                const baseR = wR + (bR - wR) * depthT;
                const baseG = wG + (bG - wG) * depthT;
                const baseB = wB + (bB - wB) * depthT;

                for (let x = 0; x < canvas.width; x++) {
                    const sx = Math.min(sw - 1, Math.floor(x / SIM));
                    const sy = Math.min(sh - 1, Math.floor(y / SIM));
                    const v = prevBuf.current![sy * sw + sx];
                    // Gentle ripple: max brightness bump ~0.6 (not full white)
                    const t2 = Math.max(0, Math.min(0.65, Math.abs(v) / 160));
                    const i = (y * canvas.width + x) * 4;
                    img.data[i] = Math.min(255, baseR + (tr - baseR) * t2);
                    img.data[i + 1] = Math.min(255, baseG + (tg - baseG) * t2);
                    img.data[i + 2] = Math.min(255, baseB + (tb - baseB) * t2);
                    img.data[i + 3] = 245; // Slightly transparent so CSS bg shows through
                }
            }
            ctx.putImageData(img, 0, 0);
            waterAnimId.current = requestAnimationFrame(render);
        };
        waterAnimId.current = requestAnimationFrame(render);
        return () => { cancelAnimationFrame(waterAnimId.current); };
    }, [initBuffers, drop]);

    // Leaf + UI animation loop
    useEffect(() => {
        const canvas = uiCanvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;

        let last = performance.now();
        const animate = (now: number) => {
            if (pausedRef.current) {
                // If paused, just shift the 'last' clock so when we resume, leaves don't jump ahead in time
                last = now;
            } else {
                const dt = (now - last) / 1000; last = now;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Spawn leaves randomly every 2–6 s
                nextLeafTimer.current -= dt;
                if (nextLeafTimer.current <= 0) {
                    leavesRef.current.push(spawnLeaf(canvas.width));
                    nextLeafTimer.current = 2 + Math.random() * 4;
                }

                // Update + draw leaves
                leavesRef.current = leavesRef.current.filter((l) => {
                    l.x += l.vx + Math.sin(l.rot) * 0.5;
                    l.y += l.vy;
                    l.rot += l.vrot;
                    // Leaf hits water: create a ripple
                    if (l.y > window.innerHeight * 0.55 && l.vy > 0 && !l.hasHitWater) {
                        l.hasHitWater = true;
                        drop(l.x, l.y, 4, 80);
                        playLeafDrop();
                        l.vy = -l.vy * 0.05; // settle
                        l.vx *= 0.5;
                    }
                    if (l.hasHitWater) {
                        l.opacity *= 0.95;
                    }
                    drawLeaf(ctx, l);
                    return l.y < window.innerHeight + 30 && l.opacity > 0.05;
                });
            }

            uiAnimId.current = requestAnimationFrame(animate);
        };

        uiAnimId.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(uiAnimId.current);
    }, [drop]);

    const handlePointer = useCallback((e: React.PointerEvent) => {
        if (pausedRef.current) return;
        const r = e.type === "pointermove" ? 5 : 8;
        // Significantly reduced strength for a softer, more fluid click sound & ripple
        drop(e.clientX, e.clientY, r, e.type === "pointermove" ? 80 : 120);
        if (e.type === "pointerdown") {
            if (!hasStarted) setHasStarted(true);
            playDrop();
            const n = tapCountRef.current + 1;
            tapCountRef.current = n;
            setTapCount(n);
            localStorage.setItem("ripple_taps", String(n));
        }
    }, [drop]);

    const handleTheme = (i: number) => { setThemeIndex(i); };

    const handleCapture = () => {
        // Composite both canvases
        const w = waterCanvasRef.current; if (!w) return;
        const tmp = document.createElement("canvas");
        tmp.width = w.width; tmp.height = w.height;
        const c = tmp.getContext("2d")!;
        c.drawImage(w, 0, 0);
        if (uiCanvasRef.current) c.drawImage(uiCanvasRef.current, 0, 0);
        const a = document.createElement("a");
        a.download = `ripple-zen-${Date.now()}.png`; a.href = tmp.toDataURL(); a.click();
        setCaptured(true); setTimeout(() => setCaptured(false), 2000);
    };

    const theme = themeIndex < PRESET_THEMES.length ? PRESET_THEMES[themeIndex] : generateTheme(customColor);

    return (
        <div
            className="relative w-full h-screen overflow-hidden select-none"
            style={{ background: `linear-gradient(to bottom, ${theme.sky} 0%, ${theme.water} 60%, ${theme.bottom} 100%)` }}
        >
            {/* Water simulation canvas — main surface */}
            <canvas
                ref={waterCanvasRef}
                onPointerMove={(e) => e.buttons && handlePointer(e)}
                onPointerDown={handlePointer}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
            />

            {/* Leaf + UI canvas — drawn on top, pointer-events through */}
            <canvas ref={uiCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />


            <div className="absolute top-5 left-5 z-50 flex items-center gap-3">
                <Link href="/#playgrounds" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors border border-white/10 bg-black/20 backdrop-blur-md">
                    <ArrowLeft size={15} /> Back
                </Link>
                <button onClick={togglePause} className="px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white border border-white/10 bg-black/20 backdrop-blur-md transition-colors">
                    {paused ? "Resume" : "Pause"}
                </button>
            </div>

            <PlaygroundAudioControls theme="zen" />

            {/* Stats - soft and minimal */}
            <div className="absolute top-5 right-5 z-50 flex items-center gap-2">
                {streakDays >= 2 && (
                    <div className="px-3 py-1.5 rounded-full bg-amber-900/40 border border-amber-500/20 backdrop-blur-md">
                        <span className="text-amber-300/80 text-xs">🔥 {streakDays}d streak</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 border border-white/8 backdrop-blur-md">
                    <Droplets size={12} className="text-white/40" />
                    <span className="text-white/50 text-xs">{tapCount.toLocaleString()}</span>
                </div>
            </div>

            {/* Theme + Capture — soft pill at bottom */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/8">
                {PRESET_THEMES.map((t, i) => (
                    <button
                        key={t.name} onClick={() => handleTheme(i)} title={t.name}
                        className={`w-6 h-6 rounded-full border transition-all duration-300 ${i === themeIndex ? "scale-125 border-white/60" : "border-white/15 hover:border-white/40"}`}
                        style={{ background: t.water }}
                    />
                ))}
                {/* Custom Color Picker */}
                <button
                    onClick={() => handleTheme(PRESET_THEMES.length)}
                    className={`relative flex-shrink-0 w-6 h-6 rounded-full border transition-all duration-300 overflow-hidden ${themeIndex === PRESET_THEMES.length ? "scale-125 border-white/60" : "border-white/15 hover:border-white/40"}`}
                    style={{ background: customColor }}
                >
                    <input
                        type="color"
                        value={customColor}
                        onChange={(e) => { setCustomColor(e.target.value); handleTheme(PRESET_THEMES.length); }}
                        className="absolute inset-[-10px] w-12 h-12 opacity-0 cursor-pointer object-cover"
                    />
                </button>

                <div className="w-px h-4 bg-white/10 ml-2 mr-2" />
                <button onClick={handleCapture} className="flex items-center gap-1.5 text-white/40 text-xs hover:text-white/70 transition-colors">
                    <Camera size={13} />{captured ? "✓ Saved" : "Capture"}
                </button>
            </div>

            {/* Initial Hint */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-40 transition-opacity duration-1000 ${hasStarted ? "opacity-0" : "opacity-100"}`}>
                <p className="flex gap-[2px] text-white/40 text-sm tracking-widest font-light">
                    {"Click to create your first wave...".split("").map((c, i) => (
                        <span key={i} className="animate-wave" style={{ animationDelay: `${i * 0.05}s` }}>
                            {c === " " ? "\u00A0" : c}
                        </span>
                    ))}
                </p>
            </div>

            <style jsx>{`
                @keyframes wave {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-wave {
                    display: inline-block;
                    animation: wave 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};
