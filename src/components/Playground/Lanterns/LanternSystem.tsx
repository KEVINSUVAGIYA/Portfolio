"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { create } from "zustand";
import { setGlobalAudioPaused } from "@/lib/audio";

interface LanternState {
    currentInput: string;
    setCurrentInput: (text: string) => void;
    addLantern: (text: string) => void;
    removeLantern: (id: number) => void;
    clearLanterns: () => void;
    lanterns: { id: number; text: string; xTarget: number; zTarget: number; speed: number }[];
    paused: boolean;
    togglePause: () => void;
}

export const useLanternStore = create<LanternState>((set) => ({
    currentInput: "",
    setCurrentInput: (text) => set({ currentInput: text }),
    lanterns: [],
    paused: false,
    togglePause: () => set((state) => {
        setGlobalAudioPaused(!state.paused);
        return { paused: !state.paused };
    }),
    clearLanterns: () => set({ lanterns: [] }),
    addLantern: (text) => set((state) => ({
        lanterns: [...state.lanterns, {
            id: Date.now(),
            text,
            xTarget: (Math.random() - 0.5) * 44,
            zTarget: -(Math.random() * 30 + 8),
            speed: 0.4 + Math.random() * 0.25,   
        }]
    })),
    removeLantern: (id) => set((state) => ({
        lanterns: state.lanterns.filter((l) => l.id !== id)
    })),
}));

// ---- Ghost lanterns: ONE instanced mesh, very slow ----
const GHOST_COUNT = 25;
const ghosts = Array.from({ length: GHOST_COUNT }, (_, i) => ({
    x: (Math.random() - 0.5) * 80,
    y: Math.random() * 20,
    z: -(Math.random() * 65 + 5),
    spd: 0.05 + Math.random() * 0.12,   // Much slower
    phase: Math.random() * Math.PI * 2,
    sc: 0.25 + Math.random() * 0.55,
}));

const GhostLanterns = () => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const dummy = useRef(new THREE.Object3D());
    const paused = useLanternStore((s) => s.paused);
    useFrame((state, delta) => {
        if (!ref.current || paused) return;
        ghosts.forEach((g, i) => {
            g.y += delta * g.spd;
            if (g.y > 26) g.y = -1;
            dummy.current.position.set(
                g.x + Math.sin(state.clock.elapsedTime * 0.3 + g.phase) * 2,
                g.y,
                g.z
            );
            dummy.current.scale.setScalar(g.sc);
            dummy.current.updateMatrix();
            ref.current!.setMatrixAt(i, dummy.current.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <instancedMesh ref={ref} args={[undefined, undefined, GHOST_COUNT]}>
            <cylinderGeometry args={[0.28, 0.18, 0.65, 8]} />
            <meshBasicMaterial color="#fde68a" toneMapped={false} transparent opacity={0.22} />
        </instancedMesh>
    );
};

// ---- Preview lantern ----
const PreviewLantern = ({ text }: { text: string }) => {
    const ref = useRef<THREE.Group>(null);
    const paused = useLanternStore((s) => s.paused);
    useFrame((state) => {
        if (!ref.current || paused) return;
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12 - 0.8;
    });
    return (
        <group ref={ref} position={[0, -0.8, 0]}>
            <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.15}>
                <mesh>
                    <cylinderGeometry args={[0.28, 0.18, 0.65, 16]} />
                    <meshPhysicalMaterial
                        color="#ffcc55" emissive="#ff8800" emissiveIntensity={2.5}
                        transparent opacity={0.9} roughness={0.2} clearcoat={0.8}
                    />
                </mesh>
                <pointLight intensity={2.5} color="#ffaa44" distance={5} />
                <Text
                    position={[0, -0.58, 0.35]} fontSize={0.12} color="white"
                    anchorX="center" anchorY="top" maxWidth={1.6} textAlign="center"
                    outlineWidth={0.012} outlineColor="#000"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >{text}</Text>
            </Float>
        </group>
    );
};

// ---- Released lantern — slow, drifting ----
const ReleasedLantern = ({ id, text, xTarget, zTarget, speed }: any) => {
    const ref = useRef<THREE.Group>(null);
    const remove = useLanternStore((s) => s.removeLantern);
    const [notified, setNotified] = useState(false);

    const paused = useLanternStore((s) => s.paused);

    useFrame((state, delta) => {
        if (!ref.current || paused) return;
        // Slow, peaceful rise
        ref.current.position.y += delta * speed;
        // Very gentle drift — lerp at 0.2 so it takes ~5s to reach target x
        ref.current.position.x += (xTarget - ref.current.position.x) * delta * 0.2;
        ref.current.position.z += (zTarget - ref.current.position.z) * delta * 0.08;
        // Subtle sway like a real lantern
        ref.current.position.x += Math.sin(state.clock.elapsedTime * 0.7 + id) * delta * 0.15;

        // Fade gently starting at y=6
        const opacity = Math.max(0, 1 - Math.max(0, (ref.current.position.y - 6) / 8));
        ref.current.traverse((c: any) => {
            if (c.isMesh && c.material) { c.material.transparent = true; c.material.opacity = opacity; }
        });

        if (ref.current.position.y > 5 && !notified) {
            setNotified(true);
            window.dispatchEvent(new CustomEvent("lantern-wished", { detail: { text } }));
        }
        if (ref.current.position.y > 16) remove(id);
    });

    return (
        <group ref={ref} position={[0, -0.8, 0]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <mesh>
                    <cylinderGeometry args={[0.28, 0.18, 0.65, 16]} />
                    <meshPhysicalMaterial
                        color="#ffcc55" emissive="#ff6600" emissiveIntensity={4}
                        transparent opacity={0.9} roughness={0.12} clearcoat={1}
                    />
                </mesh>
                <pointLight intensity={3.5} color="#ff8800" distance={7} decay={2} />
                <Text
                    position={[0, -0.58, 0.35]} fontSize={0.11} color="white"
                    anchorX="center" anchorY="top" maxWidth={1.6} textAlign="center"
                    outlineWidth={0.012} outlineColor="#000"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >{text}</Text>
            </Float>
        </group>
    );
};

export const LanternSystem = () => {
    const lanterns = useLanternStore((s) => s.lanterns);
    const currentInput = useLanternStore((s) => s.currentInput);
    const clearLanterns = useLanternStore((s) => s.clearLanterns);

    useEffect(() => {
        return () => {
            clearLanterns();
        };
    }, [clearLanterns]);

    return (
        <group>
            <GhostLanterns />
            {currentInput && <PreviewLantern text={currentInput} />}
            {lanterns.map((l) => <ReleasedLantern key={l.id} {...l} />)}
        </group>
    );
};
