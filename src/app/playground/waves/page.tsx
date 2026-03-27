"use client";

import { WaveFieldCanvas } from "@/components/Playground/WaveField/WaveFieldCanvas";

export default function WavesPage() {
    return (
        <main className="w-full h-screen overflow-hidden bg-[#060d1a]">
            <WaveFieldCanvas />
        </main>
    );
}
