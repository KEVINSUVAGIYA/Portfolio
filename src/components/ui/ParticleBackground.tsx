"use client";

import { useEffect, useRef } from "react";

export const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Configuration
        const particleCount = Math.floor((width * height) / 3500);
        const gravity = 0.5;
        const windSensitivity = 0.05;

        // Pulse Config
        const pulseRadius = 180;
        const pulseFrequency = 0.005;
        const pulseAmplitude = 15;

        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            alpha: number;
            mass: number;
            baseX: number;
            baseVy: number;
            swaySpeed: number;
            swayOffset: number;
        }

        const particles: Particle[] = [];

        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles.length = 0;

            for (let i = 0; i < particleCount; i++) {
                resetParticle({}, true);
            }
        };

        const resetParticle = (p: Partial<Particle>, randomY = false) => {
            p.x = Math.random() * width;
            p.y = randomY ? Math.random() * height : -10;

            p.vx = (Math.random() - 0.5); // Minimal horizontal start

            // IRREGULARITY: Random base speeds
            // NOW EXCLUSIVE SOURCE OF GRAVITY
            // Range: 0.1 (very slow) to 0.4 (slow)
            // Reduced to make particles slower relative to current speed
            p.baseVy = Math.random() + 0.1;
            p.vy = p.baseVy;

            p.size = Math.random() + 1;
            p.alpha = Math.random() + 0.2;
            p.mass = Math.random() + 0.5;
            p.baseX = p.x;

            // IRREGULARITY: Random Sway
            // Slower sway: 0.001 to 0.004
            p.swaySpeed = Math.random() + 0.001; // Very slow sway
            p.swayOffset = Math.random() - 1;

            if (randomY) particles.push(p as Particle);
        };

        init();

        let mouseX = 0;
        let mouseY = 0;
        let lastMouseX = 0;
        let wind = 0;
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;

        // Click Bounce State
        let bounceActive = 0;
        let bounceX = 0;
        let bounceY = 0;
        let time = 0;

        const handleMouseMove = (e: MouseEvent) => {
            lastMouseX = mouseX;
            mouseX = e.clientX;
            mouseY = e.clientY;

            const diff = mouseX - lastMouseX;
            wind += diff * windSensitivity;
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY;
            scrollVelocity = delta;
            lastScrollY = currentScrollY;
        };

        const handleClick = (e: MouseEvent) => {
            bounceActive = 20;
            bounceX = e.clientX;
            bounceY = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", init);
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("click", handleClick);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            time += 1;
            wind *= 0.95;
            scrollVelocity *= 0.95;
            if (bounceActive > 0) bounceActive--;

            const scrollForce = scrollVelocity * 0.02;

            particles.forEach((p) => {
                // 1. Passive Cursor Interaction
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let interactionX = 0;
                let interactionY = 0;

                if (dist < pulseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (pulseRadius - dist) / pulseRadius;

                    // Attraction
                    // Softened strength (0.45) for gentler feel
                    const attractionStrength = 0.45 * force;
                    interactionX += Math.cos(angle) * attractionStrength;
                    interactionY += Math.sin(angle) * attractionStrength;

                    // Pulse Wave
                    const wave = Math.sin(time * 0.03 - dist * 0.05) * pulseAmplitude * force;
                    interactionX += Math.cos(angle) * wave * 0.05;
                    interactionY += Math.sin(angle) * wave * 0.05;
                }

                // 2. Click Bubble
                let bubbleForceX = 0;
                let bubbleForceY = 0;

                if (bounceActive > 0) {
                    const bdx = bounceX - p.x;
                    const bdy = bounceY - p.y;
                    const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
                    const bubbleRadius = 150;

                    if (bDist < bubbleRadius) {
                        const angle = Math.atan2(bdy, bdx);
                        const force = (bubbleRadius - bDist) / bubbleRadius;
                        const strength = force * 2 * (bounceActive / 20);

                        bubbleForceX = -Math.cos(angle) * strength;
                        bubbleForceY = -Math.sin(angle) * strength;
                    }
                }

                // 3. Irregular Wandering
                // Sine wave based on individual sway properties
                const sway = Math.sin(time * p.swaySpeed + p.swayOffset);
                const wanderX = sway * 0.1; // Reduced from 0.2
                const wanderY = Math.cos(time * p.swaySpeed) * 0.05; // Reduced from 0.1

                // Physics Application
                p.vx += interactionX + bubbleForceX + wanderX;
                p.vy += interactionY + bubbleForceY + wanderY;

                // Friction/Drag for softer movement
                p.vx *= 0.92;

                // Clamp Velocity
                p.vx = Math.max(-10, Math.min(10, p.vx));
                p.vy = Math.max(-10, Math.min(10, p.vy));

                // Movement
                p.x += p.vx + (wind * 0.01 * p.mass);

                // BUG FIX: Removed "+ gravity" from here.
                // Gravity is already inherent in p.baseVy/p.vy
                p.y += p.vy + scrollForce;

                // Recover to base speed
                const targetVy = p.baseVy; // + scrollForce is applied directly to Y now to avoid state pollution
                // Stronger damping to ensure they stay slow (0.02 -> 0.1)
                p.vy += (targetVy - p.vy) * 0.05;

                // Edges
                if (p.y > height) resetParticle(p);
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;

                // Visuals
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

                // Stretch based on speed + Scroll Stretch Effect
                // We strongly factor in scrollVelocity for the "little effect when user scroll"
                // Increased multiplier from 0.1 to 0.15 for more visibility
                const scrollStretch = Math.abs(scrollVelocity) * 0.15;
                const totalStretch = Math.max(1, Math.min(3.0, 1 + (speed - 0.5) * 0.05 + scrollStretch));

                // Spotlight Alpha
                // Calculate distance to mouse for spotlight effect
                // Reuse existing dist if available or re-calculate
                const spotlightDx = mouseX - p.x;
                const spotlightDy = mouseY - p.y;
                const distToMouse = Math.sqrt(spotlightDx * spotlightDx + spotlightDy * spotlightDy);
                const spotlightRadius = 300; // Larger area for spotlight

                // Base subtle alpha
                // Increased from 0.3 to 0.5 for better visibility in non-spotlight areas
                let dynamicAlpha = p.alpha * 0.5;

                if (distToMouse < spotlightRadius) {
                    const spotlightIntensity = (spotlightRadius - distToMouse) / spotlightRadius;
                    // Boost alpha based on proximity, up to original alpha or slightly higher
                    dynamicAlpha += spotlightIntensity * 0.5;
                }

                ctx.fillStyle = `rgba(14, 165, 233, ${Math.min(1, dynamicAlpha)})`;
                ctx.beginPath();
                if (totalStretch > 1.01) {
                    // Align stretch with movement direction
                    const moveAngle = Math.atan2(p.vy, p.vx);
                    ctx.ellipse(p.x, p.y, p.size, p.size * totalStretch, moveAngle + Math.PI / 2, 0, Math.PI * 2);
                } else {
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                }
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", init);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
};
