"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAudioCtx, getMainAudioNode, setGlobalAudioPaused } from "@/lib/audio";
import { PlaygroundAudioControls } from "@/components/Playground/AudioControls";

// We now use the global audio context from @/lib/audio

const playNote = (freq: number) => {
    try {
        const ctx = getAudioCtx();
        const mainNode = getMainAudioNode();
        if (!ctx || !mainNode) return;
        if (ctx.state === "suspended") ctx.resume();
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.001, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.04);
        master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        master.connect(mainNode);
        const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = freq;
        o1.connect(master); o1.start(); o1.stop(ctx.currentTime + 2.5);
        const o2 = ctx.createOscillator(); const g2 = ctx.createGain(); g2.gain.value = 0.07;
        o2.type = "sine"; o2.frequency.value = freq * 2;
        o2.connect(g2); g2.connect(master); o2.start(); o2.stop(ctx.currentTime + 1.5);
    } catch (_) { }
};

// ----- RING CONFIG -----
const NOTES = [
    { note: 261.63, color: "#60a5fa", name: "C" },
    { note: 329.63, color: "#fbbf24", name: "E" },
    { note: 440.00, color: "#a78bfa", name: "A" },
    { note: 523.25, color: "#34d399", name: "C'" },
    { note: 659.25, color: "#fb923c", name: "E'" },
];

// Fewer rings — only 8 active at a time
const ACTIVE_RINGS = 8;
// Spread them across a long corridor
const LANE_SPACING = 35; // z units between rings

interface RingData {
    id: number;
    noteIdx: number;
    x: number; y: number; z: number;
    passed: boolean;   // true when camera has gone past
    collected: boolean; // true when actually hit
}

const makeRing = (id: number, slotZ: number): RingData => ({
    id,
    noteIdx: id % NOTES.length,
    x: (Math.random() - 0.5) * 28,
    y: (Math.random() - 0.5) * 14,
    z: slotZ,
    passed: false,
    collected: false,
});

// ----- RING MESH -----
const RingMesh = ({
    r,
    camZRef,
    onCollect,
    onPassed,
}: {
    r: RingData;
    camZRef: React.MutableRefObject<number>;
    onCollect: (id: number) => void;
    onPassed: (id: number) => void;
}) => {
    const ref = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const cfg = NOTES[r.noteIdx];
    const hit = useRef(false);
    const passedRef = useRef(false);

    useFrame((state) => {
        if (!ref.current) return;
        // Pulse scale
        const s = 1 + Math.sin(state.clock.elapsedTime * 1.8 + r.id) * 0.06;
        ref.current.scale.setScalar(s);
        ref.current.rotation.z += 0.003;

        // Collect
        if (!hit.current && camera.position.distanceTo(ref.current.position) < 2.3) {
            hit.current = true;
            onCollect(r.id);
        }

        // Passed (camera moved ahead of ring, whether collected or not)
        if (!passedRef.current && camera.position.z < r.z - 8) {
            passedRef.current = true;
            onPassed(r.id);
        }
    });

    if (r.collected || r.passed) return null;

    return (
        <group ref={ref} position={[r.x, r.y, r.z]}>
            <mesh>
                <torusGeometry args={[1.6, 0.13, 16, 80]} />
                <meshBasicMaterial color={cfg.color} toneMapped={false} />
            </mesh>
            <mesh>
                <torusGeometry args={[1.78, 0.05, 8, 80]} />
                <meshBasicMaterial color={cfg.color} toneMapped={false} transparent opacity={0.3} />
            </mesh>
            <pointLight color={cfg.color} intensity={1.5} distance={6} />
        </group>
    );
};

// ----- CONTROLLER -----
const Controller = ({ camZRef }: { camZRef: React.MutableRefObject<number> }) => {
    const { camera } = useThree();
    const keys = useRef<Record<string, boolean>>({});

    useEffect(() => {
        const d = (e: KeyboardEvent) => { keys.current[e.code] = true; };
        const u = (e: KeyboardEvent) => { keys.current[e.code] = false; };
        window.addEventListener("keydown", d); window.addEventListener("keyup", u);
        return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); };
    }, []);

    useFrame((_, delta) => {
        if (!useStore.getState().paused) {
            const s = 9 * delta;
            const k = keys.current;
            if (k["ArrowLeft"] || k["KeyA"]) camera.position.x -= s;
            if (k["ArrowRight"] || k["KeyD"]) camera.position.x += s;
            if (k["ArrowUp"] || k["KeyW"]) camera.position.y += s;
            if (k["ArrowDown"] || k["KeyS"]) camera.position.y -= s;
            camera.position.z -= 6 * delta;   // Constant forward (moderate pace)
            camera.position.x = THREE.MathUtils.clamp(camera.position.x, -20, 20);
            camera.position.y = THREE.MathUtils.clamp(camera.position.y, -12, 12);
            camZRef.current = camera.position.z;
        }
    });
    return null;
};

// ----- STORE -----
import { create } from "zustand";
const useStore = create<{ paused: boolean; togglePause: () => void }>((set) => ({
    paused: false,
    togglePause: () => set((s) => {
        setGlobalAudioPaused(!s.paused);
        return { paused: !s.paused };
    }),
}));

// ----- SCENE -----
const Scene = ({
    rings, camZRef, onCollect, onPassed,
}: {
    rings: RingData[];
    camZRef: React.MutableRefObject<number>;
    onCollect: (id: number) => void;
    onPassed: (id: number) => void;
}) => (
    <>
        <color attach="background" args={["#020009"]} />
        <fog attach="fog" args={["#020009", 50, 160]} />
        <Stars radius={200} depth={80} count={4000} factor={5} fade speed={0.15} />
        <ambientLight intensity={0.04} />
        <Controller camZRef={camZRef} />
        {rings.map((r) => (
            <RingMesh key={r.id} r={r} camZRef={camZRef} onCollect={onCollect} onPassed={onPassed} />
        ))}
        <EffectComposer>
            <Bloom luminanceThreshold={0.3} mipmapBlur intensity={2.2} radius={0.55} />
            <Vignette eskil={false} offset={0.15} darkness={1.1} />
        </EffectComposer>
    </>
);

// ----- GAME -----
export const FlightGame = () => {
    const camZRef = useRef(0);
    const nextIdRef = useRef(ACTIVE_RINGS);

    // Initial rings: evenly spaced starting FAR ahead
    const [rings, setRings] = useState<RingData[]>(() =>
        Array.from({ length: ACTIVE_RINGS }, (_, i) => makeRing(i, -(40 + i * LANE_SPACING)))
    );
    const [score, setScore] = useState(0);
    const [harmony, setHarmony] = useState(0);
    const [flash, setFlash] = useState<{ name: string; color: string } | null>(null);
    const lastNoteRef = useRef<number | null>(null);
    const paused = useStore((s) => s.paused);
    const togglePause = useStore((s) => s.togglePause);

    // Respawn a ring far ahead of camera
    const spawnAhead = useCallback(() => {
        const id = nextIdRef.current++;
        const slotZ = camZRef.current - 80 - Math.random() * LANE_SPACING;
        setRings((prev) => [...prev, makeRing(id, slotZ)]);
    }, []);

    const handleCollect = useCallback((id: number) => {
        setRings((prev) => {
            const r = prev.find((x) => x.id === id); if (!r) return prev;
            const cfg = NOTES[r.noteIdx];
            playNote(cfg.note);
            setFlash({ name: cfg.name, color: cfg.color });
            setTimeout(() => setFlash(null), 900);
            setScore((s) => s + 1);
            // Harmony check
            if (lastNoteRef.current !== null) {
                const ratio = cfg.note / lastNoteRef.current;
                if (ratio >= 1.4 && ratio <= 1.6) setHarmony((h) => h + 1);
            }
            lastNoteRef.current = cfg.note;
            return prev.map((x) => x.id === id ? { ...x, collected: true } : x);
        });
        // Remove collected ring + spawn replacement
        setTimeout(() => {
            setRings((prev) => prev.filter((x) => x.id !== id));
            spawnAhead();
        }, 400);
    }, [spawnAhead]);

    const handlePassed = useCallback((id: number) => {
        setRings((prev) => prev.map((x) => x.id === id ? { ...x, passed: true } : x));
        // Remove passed ring + spawn replacement so path always has rings
        setTimeout(() => {
            setRings((prev) => prev.filter((x) => x.id !== id));
            spawnAhead();
        }, 400);
    }, [spawnAhead]);

    return (
        <div className="relative w-full h-screen overflow-hidden" style={{ background: "#020009" }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 70 }} gl={{ antialias: false }} dpr={[1, 1.5]}>
                <Scene rings={rings} camZRef={camZRef} onCollect={handleCollect} onPassed={handlePassed} />
            </Canvas>

            {/* Top Bar: Back & Pause */}
            <div className="absolute top-5 left-5 z-50 flex items-center gap-3">
                <Link href="/#playgrounds" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/60 hover:text-white/90 border border-white/8 bg-black/20 backdrop-blur-md transition-colors">
                    <ArrowLeft size={15} /> Portfolio
                </Link>
                <button onClick={togglePause} className="px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white border border-white/8 bg-black/20 backdrop-blur-md transition-colors">
                    {paused ? "Resume Flight" : "Pause"}
                </button>
            </div>

            {/* HUD — minimal, top right */}
            <PlaygroundAudioControls theme="flight" />
            <div className="absolute top-5 right-5 z-50 flex items-center gap-2">
                {harmony > 0 && (
                    <div className="px-3 py-1.5 rounded-full bg-amber-900/30 border border-amber-500/20 backdrop-blur-md" title="Harmony Score">
                        <span className="text-amber-300/70 text-xs">⟡ Harmony x{harmony}</span>
                    </div>
                )}
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 backdrop-blur-md" title="Notes Collected">
                    <span className="text-white/50 text-xs">{score} Notes</span>
                </div>
            </div>

            {/* Note flash */}
            <AnimatePresence>
                {flash && !paused && (
                    <motion.div
                        key={flash.name + score}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                    >
                        <span
                            className="text-7xl font-thin tracking-widest select-none"
                            style={{ color: flash.color, textShadow: `0 0 60px ${flash.color}88` }}
                        >
                            Note {flash.name}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimal hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/20 text-xs tracking-widest">
                ↑ ↓ ← → to steer · fly through the rings
            </div>
        </div>
    );
};
