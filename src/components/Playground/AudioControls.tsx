"use client";

import { Volume2, VolumeX, Music, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getVolumes, setVolumes, getIsMuted, toggleMute, toggleBgMusic, stopGlobalAudio } from "@/lib/audio";

export const PlaygroundAudioControls = ({ theme }: { theme: "zen" | "flight" | "world" | "lanterns" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volumes, setV] = useState({ main: 0.8, bg: 0.3 });
    const [isBgPlaying, setIsBgPlaying] = useState(false);

    useEffect(() => {
        setMuted(getIsMuted());
        setV(getVolumes());

        return () => {
            stopGlobalAudio();
        };
    }, []);

    const handleMainChange = (v: number) => {
        setV(prev => { const n = { ...prev, main: v }; setVolumes(n.main, n.bg); return n; });
    };

    const handleBgChange = (v: number) => {
        setV(prev => { const n = { ...prev, bg: v }; setVolumes(n.main, n.bg); return n; });
    };

    const handleToggleMute = () => {
        setMuted(toggleMute());
    };

    const handleToggleBg = () => {
        const playing = toggleBgMusic(theme);
        setIsBgPlaying(playing ?? false);
    };

    return (
        <div className="absolute bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleToggleBg}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border backdrop-blur-md transition-colors ${isBgPlaying ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/30' : 'bg-black/20 text-white/60 hover:text-white border-white/10'}`}
                    title="Toggle Background Ambient Drone"
                >
                    <Music size={15} /> {isBgPlaying ? 'BG Music On' : 'BG Music Off'}
                </button>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full border border-white/10 bg-black/20 text-white/80 hover:text-white backdrop-blur-md transition-colors"
                >
                    <Settings2 size={18} />
                </button>
                <button
                    onClick={handleToggleMute}
                    className="p-2 rounded-full border border-white/10 bg-black/20 text-white/80 hover:text-white backdrop-blur-md transition-colors"
                >
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>

            {isOpen && (
                <div className="w-64 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-slate-300">
                            <span>SFX Volume</span>
                            <span>{Math.round(volumes.main * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volumes.main}
                            onChange={(e) => handleMainChange(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-slate-300">
                            <span>Background Drone / Music</span>
                            <span>{Math.round(volumes.bg * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volumes.bg}
                            onChange={(e) => handleBgChange(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
