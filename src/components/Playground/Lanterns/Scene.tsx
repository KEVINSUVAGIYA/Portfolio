"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import { Suspense } from "react";
import { LanternSystem } from "./LanternSystem";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export const LanternScene = () => {
    return (
        <div
            className="w-full h-full relative"
            // CSS gradient sky behind the 3D canvas — warm dusk
            style={{ background: "radial-gradient(ellipse at 50% 80%, #3d1a6d 0%, #1a0533 40%, #0a0118 100%)" }}
        >
            <Canvas
                shadows={false}
                camera={{ position: [0, 1, 9], fov: 55 }}
                gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
                dpr={[1, 1]}
                style={{ background: "transparent" }}
            >
                {/* Transparent bg — CSS gradient shows through */}
                <color attach="background" args={["#0a0118"]} />

                <Suspense fallback={null}>
                    {/* Deep fog so platform edges dissolve immediately into the night */}
                    <fog attach="fog" args={["#0d0220", 6, 35]} />

                    {/* Warm stars — saturated for a heavenly feel */}
                    <Stars radius={80} depth={40} count={3000} factor={4} saturation={1} fade speed={0.2} />

                    {/* Ambient — soft lavender glow like moonlight */}
                    <ambientLight intensity={0.35} color="#9f7aea" />
                    {/* Warm candle-like glow from slightly below */}
                    <pointLight position={[0, -1, 2]} intensity={2} color="#f97316" distance={15} />
                    {/* Cool blue highlight from high up */}
                    <pointLight position={[0, 15, -10]} intensity={0.8} color="#818cf8" distance={40} />

                    {/* Ground — very dark, almost invisible, swallowed by fog */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                        <planeGeometry args={[300, 300]} />
                        <meshBasicMaterial color="#1a0a2e" />
                    </mesh>

                    {/* Very subtle central platform — just a dark disc with faint gold rim */}
                    <mesh position={[0, -1.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[0, 5, 64]} />
                        <meshBasicMaterial color="#12062a" transparent opacity={0.7} />
                    </mesh>
                    {/* Faint gold edge ring */}
                    <mesh position={[0, -1.47, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[4.8, 5.0, 64]} />
                        <meshBasicMaterial color="#fbbf24" toneMapped={false} transparent opacity={0.25} />
                    </mesh>

                    {/* Warm golden fireflies — the main "decoration"  */}
                    <Sparkles count={60} scale={[30, 20, 30]} size={3} speed={0.1} opacity={0.4} color="#fde68a" position={[0, 4, 0]} />
                    {/* Soft indigo sparkles higher */}
                    <Sparkles count={30} scale={[40, 15, 40]} size={5} speed={0.05} opacity={0.15} color="#c4b5fd" position={[0, 10, 0]} />

                    <LanternSystem />

                    <EffectComposer>
                        <Bloom luminanceThreshold={0.35} mipmapBlur intensity={1.8} radius={0.6} />
                        <Vignette eskil={false} offset={0.1} darkness={0.7} />
                    </EffectComposer>

                    <OrbitControls enabled={false} target={[0, 3, 0]} />
                </Suspense>
            </Canvas>
        </div>
    );
};
