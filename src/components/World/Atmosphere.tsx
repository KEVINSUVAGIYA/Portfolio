"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Color, Mesh } from "three";
import { Cloud, Sky, Stars } from "@react-three/drei";
import { useWorldStore } from "./store/worldStore";

export const Atmosphere = () => {
    const weather = useWorldStore((s) => s.weather);

    // Weather particles config
    const particleCount = 2000;
    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const speeds = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 150;     // x
            positions[i * 3 + 1] = Math.random() * 80;          // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 150; // z
            speeds[i] = 0.5 + Math.random() * 1.5;
        }
        return { positions, speeds };
    }, []);

    const ptRef = useRef<any>(null);

    useFrame((state, delta) => {
        if (!ptRef.current) return;
        const positions = ptRef.current.geometry.attributes.position.array;

        // Snow falls slow and drifts, rain falls fast and goes straight down
        const isSnow = weather === 'snow';
        const isRain = weather === 'rain';

        if (isSnow || isRain) {
            for (let i = 0; i < particleCount; i++) {
                const yIdx = i * 3 + 1;
                const xIdx = i * 3;

                positions[yIdx] -= delta * (isRain ? 40 : 8) * particles.speeds[i];
                if (isSnow) {
                    positions[xIdx] += Math.sin(state.clock.elapsedTime * 0.5 + i) * delta * 2;
                }

                if (positions[yIdx] < -2) {
                    positions[yIdx] = 80;
                    positions[xIdx] = ((window as any).__PLAYER_POS?.x || 0) + (Math.random() - 0.5) * 150;
                    positions[i * 3 + 2] = ((window as any).__PLAYER_POS?.z || 0) + (Math.random() - 0.5) * 150;
                }
            }
            ptRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    const isMidnight = weather === 'midnight';
    const isRain = weather === 'rain';

    return (
        <group>
            {/* Sky Settings based on Weather */}
            {isMidnight ? (
                <>
                    <color attach="background" args={['#020617']} />
                    <Stars radius={150} depth={50} count={3000} factor={6} saturation={1} fade speed={0.4} />
                    <ambientLight intensity={0.1} color="#312e81" />
                    <directionalLight position={[20, 50, -20]} intensity={0.5} color="#818cf8" />
                </>
            ) : isRain ? (
                <>
                    <color attach="background" args={['#64748b']} />
                    <ambientLight intensity={0.4} color="#94a3b8" />
                    <directionalLight position={[0, 50, 0]} intensity={0.6} color="#cbd5e1" />
                </>
            ) : (
                <>
                    <color attach="background" args={['#dbeafe']} />
                    <ambientLight intensity={1.2} color="#ffffff" />
                    <directionalLight position={[20, 100, 50]} intensity={2.5} castShadow shadow-mapSize={[4096, 4096]} color="#ffffff" shadow-bias={-0.0001} />
                    <Sky sunPosition={[20, 100, 50]} turbidity={0.3} rayleigh={0.8} mieCoefficient={0.005} mieDirectionalG={0.8} />
                </>
            )}

            {/* Weather Clouds */}
            {(isRain || isMidnight) && (
                <group position={[0, 30, 0]}>
                    <Cloud opacity={0.8} speed={0.4} bounds={[60, 2, 60]} segments={40} color={isRain ? "#475569" : "#1e1b4b"} />
                </group>
            )}

            {/* Precipitation Particles */}
            {(weather === 'rain' || weather === 'snow') && (
                <points ref={ptRef}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={particleCount} args={[particles.positions, 3]} />
                    </bufferGeometry>
                    <pointsMaterial
                        color={weather === 'snow' ? "#ffffff" : "#a5f3fc"}
                        size={weather === 'snow' ? 0.8 : 0.2}
                        transparent
                        opacity={weather === 'snow' ? 0.8 : 0.5}
                        sizeAttenuation
                    />
                </points>
            )}

            <fog attach="fog" args={[
                isMidnight ? '#020617' : isRain ? '#64748b' : '#dbeafe',
                30,
                isMidnight ? 200 : isRain ? 150 : 300
            ]} />
        </group>
    );
};
