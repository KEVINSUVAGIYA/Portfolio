"use client";

// Global Audio Context and Nodes
let ctx: AudioContext | null = null;
let mainGainNode: GainNode | null = null;
let bgGainNode: GainNode | null = null;
let masterGainNode: GainNode | null = null;

// BG Music state
let bgAudio: HTMLAudioElement | null = null;
let bgSource: MediaElementAudioSourceNode | null = null;
let isBgPlaying = false;

// Volumes (0 to 1)
let mainVol = 0.8;
let bgVol = 0.3;
let isMuted = false;

export const getAudioCtx = () => {
    if (typeof window === "undefined") return null;
    if (!ctx) {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

        masterGainNode = ctx.createGain();
        masterGainNode.gain.value = isMuted ? 0 : 1;
        masterGainNode.connect(ctx.destination);

        mainGainNode = ctx.createGain();
        mainGainNode.gain.value = mainVol;
        mainGainNode.connect(masterGainNode);

        bgGainNode = ctx.createGain();
        bgGainNode.gain.value = bgVol;
        bgGainNode.connect(masterGainNode);
    }
    return ctx;
};

// You must connect any sound effect you want controllable to this node:
export const getMainAudioNode = () => {
    getAudioCtx();
    return mainGainNode;
};

// Sets
export const setVolumes = (main: number, bg: number) => {
    mainVol = Math.max(0, Math.min(1, main));
    bgVol = Math.max(0, Math.min(1, bg));
    if (mainGainNode && ctx) mainGainNode.gain.setTargetAtTime(mainVol, ctx.currentTime, 0.1);
    if (bgGainNode && ctx) bgGainNode.gain.setTargetAtTime(bgVol, ctx.currentTime, 0.1);
};

export const getVolumes = () => {
    return { main: mainVol, bg: bgVol };
};

export const toggleMute = () => {
    isMuted = !isMuted;
    if (masterGainNode && ctx) {
        masterGainNode.gain.setTargetAtTime(isMuted ? 0 : 1, ctx.currentTime, 0.1);
    }
    return isMuted;
};

export const getIsMuted = () => isMuted;

export const setGlobalAudioPaused = (isPaused: boolean) => {
    if (ctx) {
        if (isPaused) {
            ctx.suspend();
        } else {
            ctx.resume();
        }
    }
};

// MP3 Background Music Engine
export const toggleBgMusic = (theme: "zen" | "flight" | "world" | "lanterns") => {
    const c = getAudioCtx();
    if (!c || !bgGainNode) return;

    if (isBgPlaying && bgAudio) {
        bgAudio.pause();
        isBgPlaying = false;
        return false;
    }

    if (c.state === "suspended") c.resume();

    if (!bgAudio) {
        bgAudio = new window.Audio("/audio/Celestial_Bloom.mp3");
        bgAudio.loop = true;
        bgAudio.crossOrigin = "anonymous";

        // Route through the WebAudio graph for volume/mute controls
        bgSource = c.createMediaElementSource(bgAudio);
        bgSource.connect(bgGainNode);
    }

    bgAudio.play().catch(e => console.error("Audio playback error:", e));
    isBgPlaying = true;
    return true;
};
