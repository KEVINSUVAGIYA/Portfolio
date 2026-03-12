"use client";

import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useState, useEffect } from "react";
import { Player } from "./Player";
import { Environment } from "./Environment";
import { Atmosphere } from "./Atmosphere";
import { useWorldStore } from "./store/worldStore";
import { PlaygroundAudioControls } from "@/components/Playground/AudioControls";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Cloud, Sun, Snowflake, Moon } from "lucide-react";

export const Scene = () => {
    const { score, stamina, weather, shrinesFound, setWeather } = useWorldStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <div className="h-screen w-full relative bg-slate-950 overflow-hidden">
            <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <Atmosphere />
                    <Player />
                    <Environment />

                    <EffectComposer>
                        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={1.5} radius={0.6} />
                        <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* ----- HUD OVERLAY ----- */}
            {mounted && (
                <>
                    {/* Top Left: Controls & Back */}
                    <div className="absolute top-4 left-4 z-50 flex flex-col gap-3">
                        <Link href="/#playgrounds" className="flex items-center gap-2 px-4 py-2 w-max bg-black/40 backdrop-blur-md rounded-full text-sm font-medium text-white hover:bg-black/60 border border-white/10 transition-colors">
                            <ArrowLeft size={16} /> Portfolio
                        </Link>

                        <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white w-64">
                            <h1 className="text-xl font-bold mb-1 text-purple-400">Spirit World</h1>
                            <p className="text-xs text-slate-300 mb-4 tracking-wider uppercase font-semibold">Gamified Prototype</p>

                            <div className="flex flex-col gap-2 text-sm text-slate-200">
                                <span className="flex items-center gap-2">➔ <span className="text-white/50">WASD / Arrows to Move</span></span>
                                <span className="flex items-center gap-2">➔ <span className="text-white/50">Shift to Dash Fast</span></span>
                                <span className="flex items-center gap-2">➔ <span className="text-white/50">Space to Jump</span></span>
                            </div>
                        </div>

                        {/* Weather Controls */}
                        <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 w-max">
                            <button onClick={() => setWeather('clear')} className={`p-2 rounded-lg transition-colors ${weather === 'clear' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-400 hover:text-white'}`}><Sun size={18} /></button>
                            <button onClick={() => setWeather('rain')} className={`p-2 rounded-lg transition-colors ${weather === 'rain' ? 'bg-blue-500/30 text-blue-300' : 'text-slate-400 hover:text-white'}`}><Cloud size={18} /></button>
                            <button onClick={() => setWeather('snow')} className={`p-2 rounded-lg transition-colors ${weather === 'snow' ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400 hover:text-white'}`}><Snowflake size={18} /></button>
                            <button onClick={() => setWeather('midnight')} className={`p-2 rounded-lg transition-colors ${weather === 'midnight' ? 'bg-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-white'}`}><Moon size={18} /></button>
                        </div>
                    </div>

                    <PlaygroundAudioControls theme="world" />
                    {/* Top Right: Score & Objectives */}
                    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-3 mt-12">
                        {/* Score Board */}
                        <div className="px-5 py-3 bg-black/40 backdrop-blur-md rounded-2xl border border-fuchsia-500/30 flex items-center gap-3">
                            <span className="text-fuchsia-400 font-bold text-lg">Orbs Collected</span>
                            <span className="text-2xl font-black text-white">{score}</span>
                        </div>

                        {/* Shrines Objectives */}
                        <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 w-52">
                            <h2 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">Secret Shrines</h2>
                            <div className="flex flex-col gap-2">
                                {[1, 2, 3].map(id => {
                                    const isFound = shrinesFound.includes(id);
                                    return (
                                        <div key={id} className={`flex items-center gap-2 text-sm ${isFound ? 'text-amber-300' : 'text-slate-500'}`}>
                                            <div className={`w-2 h-2 rounded-full ${isFound ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-slate-700'}`} />
                                            {isFound ? `Shrine ${id} Discovered` : 'Unknown Shrine'}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Center: Stamina Bar */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-72">
                        <span className="text-xs font-bold text-purple-300 tracking-widest uppercase">Spirit Dash</span>
                        <div className="w-full h-3 bg-black/60 rounded-full border border-white/10 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-400 transition-all duration-75"
                                style={{ width: `${stamina}%` }}
                            />
                        </div>
                    </div>
                </>
            )}

            <Loader
                containerStyles={{ background: '#020617' }}
                innerStyles={{ width: '50vw', height: '6px', background: '#1e293b', borderRadius: '10px' }}
                barStyles={{ background: 'linear-gradient(90deg, #c084fc, #f472b6)', height: '100%', borderRadius: '10px' }}
                dataInterpolation={(p) => `Summoning World ${p.toFixed(0)}%`}
                dataStyles={{ color: '#f472b6', fontSize: '1rem', fontFamily: 'sans-serif', fontWeight: 'bold' }}
            />
        </div>
    );
};
