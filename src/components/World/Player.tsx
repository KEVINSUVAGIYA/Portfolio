"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { Vector3, Group } from "three";
import { OrbitControls } from "@react-three/drei";
import { useWorldStore } from "./store/worldStore";

export const Player = () => {
    const ref = useRef<Group>(null);
    const controlsRef = useRef<any>(null);
    const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

    // Physics state
    const velocity = useRef(new Vector3(0, 0, 0));
    const rotation = useRef(0);
    const isJumping = useRef(false);

    // Constants
    const WALK_SPEED = 0.08;
    const DASH_SPEED = 0.35;
    const ROTATION_SPEED = 0.06;
    const JUMP_FORCE = 0.6;
    const GRAVITY = 0.03;
    const FRICTION = 0.85;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: true }));
        const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: false }));
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => { window.removeEventListener("keydown", handleKeyDown); window.removeEventListener("keyup", handleKeyUp); };
    }, []);

    const isMoving = keys["ArrowUp"] || keys["KeyW"] || keys["ArrowDown"] || keys["KeyS"];
    const [dashing, setDashing] = useState(false);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // 1. Rotation (Steering)
        if (keys["ArrowLeft"] || keys["KeyA"]) rotation.current += ROTATION_SPEED;
        if (keys["ArrowRight"] || keys["KeyD"]) rotation.current -= ROTATION_SPEED;

        // 2. Dash & Stamina
        const { stamina, useStamina, recoverStamina } = useWorldStore.getState();
        const wantsToDash = (keys["ShiftLeft"] || keys["ShiftRight"]) && isMoving;
        const isDashing = wantsToDash && stamina > 0;
        setDashing(isDashing);

        if (isDashing) useStamina(0.8);
        else if (!wantsToDash) recoverStamina(0.4);

        // 3. Movement
        const currentSpeed = isDashing ? DASH_SPEED : WALK_SPEED;
        const forward = new Vector3(Math.sin(rotation.current), 0, Math.cos(rotation.current));

        if (keys["ArrowUp"] || keys["KeyW"]) {
            velocity.current.x += forward.x * currentSpeed;
            velocity.current.z += forward.z * currentSpeed;
        }
        if (keys["ArrowDown"] || keys["KeyS"]) {
            velocity.current.x -= forward.x * currentSpeed * 0.5;
            velocity.current.z -= forward.z * currentSpeed * 0.5;
        }

        // 4. Jumping
        if ((keys["Space"]) && !isJumping.current) {
            velocity.current.y = JUMP_FORCE;
            isJumping.current = true;
        }

        // 5. Physics Update
        velocity.current.y -= GRAVITY;
        velocity.current.x *= FRICTION;
        velocity.current.z *= FRICTION;

        let nextX = ref.current.position.x + velocity.current.x;
        let nextZ = ref.current.position.z + velocity.current.z;

        // Tree Collision Physics
        const trees = (window as any).__TREES_POS || [];
        const PLAYER_RADIUS = 1.4; // Increased to match the 2.0 length blocky body!

        for (const tree of trees) {
            const dx = nextX - tree.x;
            const dz = nextZ - tree.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const minDist = tree.r + PLAYER_RADIUS;
            if (dist < minDist && dist > 0.0001) {
                // Collide and slide! Push player smoothly out of the tree along the normal
                const overlap = minDist - dist;
                nextX += (dx / dist) * overlap;
                nextZ += (dz / dist) * overlap;

                // Bleed off velocity in the normal direction to prevent jitter
                const nx = dx / dist;
                const nz = dz / dist;
                const vDotN = velocity.current.x * nx + velocity.current.z * nz;
                if (vDotN < 0) {
                    velocity.current.x -= vDotN * nx;
                    velocity.current.z -= vDotN * nz;
                }
            }
        }

        ref.current.position.x = nextX;
        ref.current.position.z = nextZ;
        ref.current.position.y += velocity.current.y;
        ref.current.rotation.y = rotation.current;

        // Ground Collision
        if (ref.current.position.y < 0) {
            ref.current.position.y = 0;
            velocity.current.y = 0;
            isJumping.current = false;
        }

        // Boundary
        const LIMIT = 400;
        if (Math.abs(ref.current.position.x) > LIMIT) { ref.current.position.x = Math.sign(ref.current.position.x) * LIMIT; velocity.current.x = 0; }
        if (Math.abs(ref.current.position.z) > LIMIT) { ref.current.position.z = Math.sign(ref.current.position.z) * LIMIT; velocity.current.z = 0; }

        // Camera Logic
        if (isMoving) {
            // Further camera when dashing
            const zDist = isDashing ? -14 : -10;
            const yDist = isDashing ? 4 : 5;
            const cameraOffset = new Vector3(0, yDist, zDist);
            cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), rotation.current);
            const targetCameraPos = ref.current.position.clone().add(cameraOffset);

            state.camera.position.lerp(targetCameraPos, 0.08);
            state.camera.lookAt(ref.current.position.clone().add(new Vector3(0, 2, 0)));
        } else if (controlsRef.current) {
            controlsRef.current.target.copy(ref.current.position.clone().add(new Vector3(0, 2, 0)));
            controlsRef.current.update();
        }

        // Optional: Expose player position to window for global access/orbs collision
        (window as any).__PLAYER_POS = ref.current.position;
    });

    return (
        <group ref={ref}>
            <OrbitControls
                ref={controlsRef} enableZoom={false} enablePan={false}
                enabled={!isMoving} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2}
            />
            {/* Player Character */}
            <HorseModel isMoving={isMoving} isDashing={dashing} />
        </group>
    );
};

const HorseModel = ({ isMoving, isDashing }: { isMoving: boolean, isDashing: boolean }) => {
    const legRef = useRef<Group>(null);
    const bodyRef = useRef<Group>(null);
    const neckRef = useRef<Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (bodyRef.current) {
            // Subtle bounce while moving
            bodyRef.current.position.y = Math.sin(t * 8) * (isMoving ? 0.08 : 0) + 1.2;
            bodyRef.current.rotation.z = isMoving ? Math.sin(t * 16) * 0.02 : 0;

            // Neck animates slightly while moving
            if (neckRef.current) {
                neckRef.current.rotation.x = isMoving ? Math.sin(t * 8) * 0.05 + 0.3 : 0.3;
            }
        }
        if (legRef.current && isMoving) {
            const speedMultiplier = isDashing ? 20 : 12;
            const trotAmount = isDashing ? 0.7 : 0.4;
            legRef.current.children.forEach((child, i) => {
                // Diagonal leg movement (0 and 3 together, 1 and 2 together)
                const phase = (i === 0 || i === 3) ? 0 : Math.PI;
                child.rotation.x = Math.sin(t * speedMultiplier + phase) * trotAmount;
            });
        } else if (legRef.current && !isMoving) {
            // Reset leg rotations smoothly
            legRef.current.children.forEach((child) => {
                child.rotation.x *= 0.8;
            });
        }
    });

    const bodyColor = isDashing ? "#f472b6" : "#a855f7";
    const emissiveColor = isDashing ? "#f472b6" : "#c084fc";
    const emissiveInt = isDashing ? 0.8 : 0.3;

    return (
        <group position={[0, 0, 0]}>
            <group ref={bodyRef}>
                {/* Main Body */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.7, 0.8, 2.0]} />
                    <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} roughness={0.4} metalness={0.3} />
                </mesh>

                {/* Neck and Head Group */}
                <group ref={neckRef} position={[0, 0.3, 0.8]}>
                    {/* Neck */}
                    <mesh castShadow receiveShadow position={[0, 0.5, 0.2]}>
                        <boxGeometry args={[0.35, 1.0, 0.4]} />
                        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
                    </mesh>
                    {/* Head */}
                    <mesh castShadow receiveShadow position={[0, 1.0, 0.5]}>
                        <boxGeometry args={[0.4, 0.4, 0.9]} />
                        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
                    </mesh>
                    {/* Ears */}
                    <mesh castShadow position={[0.15, 1.3, 0.2]} rotation={[-0.2, 0, -0.2]}>
                        <boxGeometry args={[0.08, 0.3, 0.1]} />
                        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
                    </mesh>
                    <mesh castShadow position={[-0.15, 1.3, 0.2]} rotation={[-0.2, 0, 0.2]}>
                        <boxGeometry args={[0.08, 0.3, 0.1]} />
                        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
                    </mesh>
                </group>

                {/* Tail */}
                <mesh castShadow position={[0, 0.2, -1.0]} rotation={[0.4, 0, 0]}>
                    <boxGeometry args={[0.1, 0.8, 0.15]} />
                    <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
                </mesh>
            </group>

            {/* Legs - Positioned from the top joints to act as shoulder/hip pivot points */}
            <group ref={legRef} position={[0, 0.8, 0]}>
                {/* Front Left */}
                <group position={[0.3, 0, 0.6]}>
                    <mesh castShadow receiveShadow position={[0, -0.6, 0]}><boxGeometry args={[0.2, 1.2, 0.2]} /><meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} /></mesh>
                </group>
                {/* Front Right */}
                <group position={[-0.3, 0, 0.6]}>
                    <mesh castShadow receiveShadow position={[0, -0.6, 0]}><boxGeometry args={[0.2, 1.2, 0.2]} /><meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} /></mesh>
                </group>
                {/* Back Left */}
                <group position={[0.3, 0, -0.7]}>
                    <mesh castShadow receiveShadow position={[0, -0.6, 0]}><boxGeometry args={[0.2, 1.2, 0.25]} /><meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} /></mesh>
                </group>
                {/* Back Right */}
                <group position={[-0.3, 0, -0.7]}>
                    <mesh castShadow receiveShadow position={[0, -0.6, 0]}><boxGeometry args={[0.2, 1.2, 0.25]} /><meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} /></mesh>
                </group>
            </group>
        </group>
    );
};
