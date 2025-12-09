"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

export const Spotlight = ({
    className,
}: {
    className?: string;
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the cursor follower
    const springConfig = { damping: 25, stiffness: 700 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouseX.set(clientX);
            mouseY.set(clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className={cn(
                "pointer-events-none fixed inset-0 z-30 transition-opacity duration-300",
                className
            )}
            style={{
                background: useMotionTemplate`
          radial-gradient(
            650px circle at ${smoothX}px ${smoothY}px,
            rgba(14, 165, 233, 0.15),
            transparent 80%
          )
        `,
            }}
        />
    );
};
