"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Float, MeshReflectorMaterial, useTexture, Text } from "@react-three/drei";
import { CanvasTexture, RepeatWrapping } from "three";
import { useFrame } from "@react-three/fiber";
import { useWorldStore } from "./store/worldStore";
import * as THREE from "three";
import { setWaterWaveIntensity } from "@/lib/audio";

export const Environment = () => {
    // Collectible Orbs logic
    const [orbs, setOrbs] = useState(() => {
        const arr = [];
        for (let i = 0; i < 40; i++) {
            const x = (Math.random() - 0.5) * 300;
            const z = (Math.random() - 0.5) * 300;
            if (Math.abs(x) < 20 && Math.abs(z) < 20) continue; // Not in immediate start
            arr.push({ id: i, x, y: 1 + Math.random() * 2, z, collected: false });
        }
        return arr;
    });

    // Shrines logic
    const shrines = useMemo(() => [
        { id: 1, pos: [80, 0, -80] as [number, number, number], color: "#38bdf8", name: "Shrine of Water" },
        { id: 2, pos: [-120, 0, 60] as [number, number, number], color: "#fbbf24", name: "Shrine of Light" },
        { id: 3, pos: [60, 0, 140] as [number, number, number], color: "#a78bfa", name: "Shrine of Void" },
    ], []);

    // Ponds logic
    const ponds = useMemo(() => {
        return [
            { id: 1, x: 30, z: 30, r: 24 },
            { id: 2, x: -40, z: -20, r: 28 },
            { id: 3, x: -80, z: -100, r: 20 }
        ].map(pond => {
            // Pre-calculate permanent lilypads for this pond
            const pads = Array.from({ length: 8 }).map((_, j) => {
                const angle = Math.random() * Math.PI * 2;
                const dist = 3 + Math.random() * (pond.r - 5);
                return {
                    id: j,
                    x: Math.cos(angle) * dist,
                    z: Math.sin(angle) * dist,
                    size: 0.6 + Math.random() * 0.6,
                    rot: Math.random() * Math.PI * 2
                };
            });
            return { ...pond, pads };
        });
    }, []);

    const [splashes, setSplashes] = useState<{ id: number, x: number, z: number, time: number }[]>([]);
    const nextSplashId = useRef(0);
    const lastSplashTime = useRef(0);

    const { addScore, foundShrine, shrinesFound } = useWorldStore();

    useFrame(() => {
        const playerPos = (window as any).__PLAYER_POS;
        if (!playerPos) return;

        // Check Orb Collisions
        let orbsToAdd = 0;
        setOrbs(prev => {
            let changed = false;
            const next = prev.map(orb => {
                if (orb.collected) return orb;
                const dist = Math.sqrt(Math.pow(orb.x - playerPos.x, 2) + Math.pow(orb.z - playerPos.z, 2));
                if (dist < 3) {
                    orbsToAdd += 1;
                    changed = true;
                    return { ...orb, collected: true };
                }
                return orb;
            });
            return changed ? next : prev;
        });

        if (orbsToAdd > 0) {
            addScore(orbsToAdd * 10);
        }

        // Check Shrine Collisions
        shrines.forEach((shrine) => {
            if (useWorldStore.getState().shrinesFound.includes(shrine.id)) return;
            const dist = Math.sqrt(Math.pow(shrine.pos[0] - playerPos.x, 2) + Math.pow(shrine.pos[2] - playerPos.z, 2));
            if (dist < 10) {
                foundShrine(shrine.id);
            }
        });

        // Check if player is moving in water to spawn ripples
        const t = performance.now() / 1000;
        let touchingWater = false;
        for (const pond of ponds) {
            const dx = playerPos.x - pond.x;
            const dz = playerPos.z - pond.z;
            if (Math.sqrt(dx * dx + dz * dz) < pond.r) {
                touchingWater = true;
                break;
            }
        }

        const isMoving = Math.abs(playerPos.x - ((window as any).__lastPx || playerPos.x)) > 0.05
            || Math.abs(playerPos.z - ((window as any).__lastPz || playerPos.z)) > 0.05;

        const speed = Math.sqrt(Math.pow(playerPos.x - ((window as any).__lastPx || playerPos.x), 2) + Math.pow(playerPos.z - ((window as any).__lastPz || playerPos.z), 2));

        // Modulate physical moving-in-water sound effect via speed
        if (touchingWater && playerPos.y < 0.3) {
            setWaterWaveIntensity(Math.min(1, speed * 2.5));
        } else {
            setWaterWaveIntensity(0);
        }

        (window as any).__lastPx = playerPos.x;
        (window as any).__lastPz = playerPos.z;

        if (touchingWater && isMoving && t - lastSplashTime.current > 0.15 && playerPos.y < 0.3) {
            lastSplashTime.current = t;
            setSplashes(prev => [...prev.slice(-15), { id: nextSplashId.current++, x: playerPos.x, z: playerPos.z, time: t }]);
        }
    });

    const treeData = useMemo(() => {
        const trees = [];
        for (let i = 0; i < 150; i++) {
            const x = (Math.random() - 0.5) * 250;
            const z = (Math.random() - 0.5) * 250;
            const distToCenter = Math.sqrt(x * x + z * z);
            if (distToCenter < 20) continue;
            trees.push({ x, z, scale: 0.8 + Math.random() * 1.2, type: Math.random() > 0.6 ? 'pine' : 'broadleaf' });
        }
        return trees;
    }, []);

    const [waterTexture] = useMemo(() => {
        const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 20000; i++) {
            ctx.beginPath(); ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 30 + 10, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`; ctx.fill();
        }
        const tex = new CanvasTexture(canvas); tex.wrapS = tex.wrapT = RepeatWrapping; tex.repeat.set(4, 4);
        return [tex];
    }, []);

    useFrame((_, delta) => { if (waterTexture) { waterTexture.offset.x += 0.1 * delta; waterTexture.offset.y += 0.05 * delta; } });

    return (
        <group>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[1000, 1000, 16, 16]} />
                <meshStandardMaterial color="#052e16" roughness={1} />
            </mesh>

            {/* Ponds */}
            {ponds.map((pond) => (
                <group key={pond.id} position={[pond.x, 0.1, pond.z]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[pond.r, 64]} />
                        <MeshReflectorMaterial
                            blur={[150, 50]} resolution={256} mixBlur={1} mixStrength={15} roughness={0.3} depthScale={1}
                            minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#111" metalness={0.2} mirror={0.4}
                            transparent opacity={0.6} distortion={0.8} distortionMap={waterTexture}
                        />
                    </mesh>
                    {/* Shore edge to blend into terrain nicely */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                        <ringGeometry args={[pond.r - 0.5, pond.r + 2, 64]} />
                        <meshStandardMaterial color="#022c22" roughness={1} />
                    </mesh>
                    {/* Organic Lilypads */}
                    {pond.pads.map(pad => (
                        <mesh key={pad.id} rotation={[-Math.PI / 2, 0, pad.rot]} position={[pad.x, 0.02, pad.z]}>
                            <circleGeometry args={[pad.size, 16, 0, Math.PI * 1.8]} />
                            <meshStandardMaterial color="#22c55e" roughness={0.8} />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* Splashes */}
            {splashes.map(r => (
                <WaterSplash key={r.id} x={r.x} z={r.z} spawnTime={r.time} />
            ))}

            {/* Trees */}
            <InstancedForest />

            {/* Orbs */}
            {orbs.filter(o => !o.collected).map(o => (
                <Float key={o.id} speed={4} rotationIntensity={1} floatIntensity={1} position={[o.x, o.y, o.z]}>
                    <mesh>
                        <octahedronGeometry args={[0.4, 0]} />
                        <meshStandardMaterial color="#f0abfc" emissive="#f0abfc" emissiveIntensity={1.5} toneMapped={false} />
                    </mesh>
                    <pointLight color="#f0abfc" intensity={2} distance={5} />
                </Float>
            ))}

            {/* Shrines */}
            {shrines.map(s => (
                <Shrine key={s.id} id={s.id} pos={s.pos} color={s.color} name={s.name} />
            ))}
        </group>
    );
};

const WaterSplash = ({ x, z, spawnTime }: { x: number, z: number, spawnTime: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const particles = useRef(Array.from({ length: 5 }).map(() => ({
        vx: (Math.random() - 0.5) * 3,
        vy: 1.5 + Math.random() * 2,
        vz: (Math.random() - 0.5) * 3,
        x: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.4,
        y: 0
    })));

    useFrame((_, delta) => {
        const t = performance.now() / 1000;
        const age = t - spawnTime;
        if (age > 1) return;

        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const p = particles.current[i];
                p.vy -= 9.8 * delta; // gravity
                p.x += p.vx * delta;
                p.y += p.vy * delta;
                p.z += p.vz * delta;
                if (p.y < 0) { p.y = 0; p.vy = 0; p.vx = 0; p.vz = 0; }
                child.position.set(p.x, p.y, p.z);
                const scale = Math.max(0, 1 - age);
                child.scale.set(scale, scale, scale);
            });
        }
    });

    return (
        <group ref={groupRef} position={[x, 0.1, z]}>
            {particles.current.map((_, i) => (
                <mesh key={i}>
                    <boxGeometry args={[0.12, 0.12, 0.12]} />
                    <meshStandardMaterial color="#7dd3fc" roughness={0.0} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    );
};

const Shrine = ({ id, pos, color, name }: { id: number, pos: [number, number, number], color: string, name: string }) => {
    const isFound = useWorldStore(s => s.shrinesFound.includes(id));
    const activeColor = isFound ? color : "#334155";

    return (
        <group position={pos}>
            {/* Base */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[3, 4, 1, 8]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Pillars */}
            {[[-2, -2], [2, -2], [-2, 2], [2, 2]].map((p, i) => (
                <mesh key={i} position={[p[0], 2.5, p[1]]} castShadow>
                    <cylinderGeometry args={[0.3, 0.4, 4, 6]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
            ))}
            {/* Top */}
            <mesh position={[0, 5, 0]} castShadow>
                <cylinderGeometry args={[3.5, 3, 1, 8]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Glowing Core */}
            <Float speed={2} rotationIntensity={1}>
                <mesh position={[0, 3, 0]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isFound ? 2 : 0} />
                </mesh>
                {isFound && <pointLight color={activeColor} intensity={3} distance={20} position={[0, 3, 0]} />}
            </Float>
            {/* Name label when found */}
            {isFound && (
                <Text position={[0, 7, 0]} fontSize={1} color={color} outlineWidth={0.05} outlineColor="#000">
                    {name} Discovered!
                </Text>
            )}
        </group>
    );
}

// Generate an ultra-dense, ultra-fast InstancedForest.
const InstancedForest = () => {
    const TREE_COUNT = 120; // Reduced for performance, still plenty
    const LEAVES_PER_TREE = 8; // Less but puffier overlapping spheres per tree

    const { trunkMatrices, leafMatrices, leafColors, colliders } = useMemo(() => {
        const tMats = new Float32Array(TREE_COUNT * 16);
        const lMats = new Float32Array(TREE_COUNT * LEAVES_PER_TREE * 16);
        const lCols = new Float32Array(TREE_COUNT * LEAVES_PER_TREE * 3);

        const dummy = new THREE.Object3D();
        const colorObj = new THREE.Color();
        const baseColors = ["#047857", "#059669", "#10b981", "#064e3b", "#34d399"]; // Lush real greens

        let leafIdx = 0;
        const treeColliders: { x: number, z: number, r: number }[] = [];

        for (let i = 0; i < TREE_COUNT; i++) {
            // Find valid position
            let x = 0, z = 0, dist = 0;
            while (true) {
                x = (Math.random() - 0.5) * 400;
                z = (Math.random() - 0.5) * 400;
                dist = Math.sqrt(x * x + z * z);
                if (dist > 25) break; // Avoid spawn area
            }

            const scale = 0.7 + Math.random() * 0.8;
            const treeHeight = 2.5 * scale;
            const isPine = Math.random() > 0.5;

            // Trunk
            dummy.position.set(x, treeHeight / 2, z);
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(0, Math.random() * Math.PI, 0);
            dummy.updateMatrix();
            dummy.matrix.toArray(tMats, i * 16);

            // Create a wide invisible collision cylinder that encompasses the low-hanging leaf canopy, not just the trunk!
            treeColliders.push({ x, z, r: 2.8 * scale });

            // Leaves
            const treeColor = baseColors[Math.floor(Math.random() * baseColors.length)];
            colorObj.set(treeColor);

            for (let j = 0; j < LEAVES_PER_TREE; j++) {
                if (isPine) {
                    // Pine shape: cluster tight to center, going up
                    const h = Math.random() * 3 * scale;
                    const rad = (3 * scale - h) * 0.6; // Wider at bottom
                    dummy.position.set(
                        x + (Math.random() - 0.5) * rad,
                        treeHeight * 0.5 + h,
                        z + (Math.random() - 0.5) * rad
                    );
                    const sz = 1.0 + Math.random() * 0.8;
                    dummy.scale.set(scale * sz, scale * sz, scale * sz);
                } else {
                    // Oak shape: cluster into a large round canopy
                    const hOffset = Math.random() * 2 * scale;
                    const rad = 2.5 * scale;
                    // point in sphere
                    const u = Math.random();
                    const v = Math.random();
                    const theta = u * 2.0 * Math.PI;
                    const phi = Math.acos(2.0 * v - 1.0);
                    const r = Math.cbrt(Math.random()) * rad;

                    dummy.position.set(
                        x + r * Math.sin(phi) * Math.cos(theta),
                        treeHeight * 1.5 + r * Math.sin(phi) * Math.sin(theta) + hOffset,
                        z + r * Math.cos(phi)
                    );
                    const sz = 1.5 + Math.random() * 1.0; // Large puffy leaves
                    dummy.scale.set(scale * sz, scale * sz, scale * sz);
                }

                dummy.rotation.set(Math.random(), Math.random(), Math.random());
                dummy.updateMatrix();
                dummy.matrix.toArray(lMats, leafIdx * 16);

                // Add slight color variation
                const lCol = colorObj.clone();
                lCol.offsetHSL(0, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);
                lCol.toArray(lCols, leafIdx * 3);

                leafIdx++;
            }
        }
        return { trunkMatrices: tMats, leafMatrices: lMats, leafColors: lCols, colliders: treeColliders };
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).__TREES_POS = colliders;
        }
    }, [colliders]);

    const leafMeshRef = useRef<THREE.InstancedMesh>(null);
    const trunkMeshRef = useRef<THREE.InstancedMesh>(null);

    useMemo(() => {
        if (!leafMeshRef.current || !trunkMeshRef.current) return;
        leafMeshRef.current.instanceMatrix.needsUpdate = true;
        if (leafMeshRef.current.instanceColor) leafMeshRef.current.instanceColor.needsUpdate = true;
        trunkMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [trunkMatrices]);

    return (
        <group>
            <instancedMesh ref={trunkMeshRef as any} args={[undefined, undefined, TREE_COUNT]} castShadow receiveShadow>
                <instancedBufferAttribute attach="instanceMatrix" count={TREE_COUNT} args={[trunkMatrices, 16]} />
                <cylinderGeometry args={[0.3, 0.4, 2.5, 6]} />
                <meshStandardMaterial color="#451a03" roughness={1} />
            </instancedMesh>
            <instancedMesh ref={leafMeshRef as any} args={[undefined, undefined, TREE_COUNT * LEAVES_PER_TREE]} castShadow receiveShadow>
                <instancedBufferAttribute attach="instanceMatrix" count={TREE_COUNT * LEAVES_PER_TREE} args={[leafMatrices, 16]} />
                <instancedBufferAttribute attach="instanceColor" count={TREE_COUNT * LEAVES_PER_TREE} args={[leafColors, 3]} />
                {/* Smooth Sphere geometry instead of faceted icosahedrons for beautiful organic feel */}
                <sphereGeometry args={[1.2, 8, 8]} />
                <meshStandardMaterial roughness={0.8} vertexColors />
            </instancedMesh>
        </group>
    );
};
