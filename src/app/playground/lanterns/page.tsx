"use client";


import { LanternScene } from "@/components/Playground/Lanterns/Scene";
import { LanternInput } from "@/components/Playground/Lanterns/LanternInput";

export default function LanternsPage() {
    return (
        <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-white">

            <LanternScene />
            <LanternInput />
        </div>
    );
}
