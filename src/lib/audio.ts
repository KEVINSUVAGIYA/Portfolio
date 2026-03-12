"use client";

// Global Audio Context and Nodes
let ctx: AudioContext | null = null;
let mainGainNode: GainNode | null = null;
let bgGainNode: GainNode | null = null;
let masterGainNode: GainNode | null = null;

// BG Music state
// BG Music state
let bgAudio: HTMLAudioElement | null = null;
let bgSource: MediaElementAudioSourceNode | null = null;
let isBgPlaying = false;

// Ambient Wave state
let waveBgAudio: HTMLAudioElement | null = null;
let waveBgSource: MediaElementAudioSourceNode | null = null;
let waveGainNode: GainNode | null = null;
let waterClickAudio: HTMLAudioElement | null = null;

// Volumes (0 to 1)
let mainVol = 0.9;
let bgVol = 0.1;
let isMuted = true;

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

export const stopGlobalAudio = () => {
    if (bgAudio) {
        bgAudio.pause();
        isBgPlaying = false;
    }
    if (waveBgAudio) {
        waveBgAudio.pause();
    }
    if (ctx && ctx.state === "running") {
        ctx.suspend();
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

// Continuous ambient wave effect
export const setWaterWaveIntensity = (intensity: number) => {
    if (typeof window === "undefined" || getIsMuted()) return;
    const c = getAudioCtx();
    if (!c || !mainGainNode) return;

    if (!waveBgAudio) {
        waveBgAudio = new window.Audio("/audio/water_wave_bg.mp3");
        waveBgAudio.loop = true;
        waveBgAudio.crossOrigin = "anonymous";

        waveGainNode = c.createGain();
        waveGainNode.gain.value = 0;
        waveGainNode.connect(mainGainNode);

        waveBgSource = c.createMediaElementSource(waveBgAudio);
        waveBgSource.connect(waveGainNode);
    }

    if (intensity > 0.01 && waveBgAudio.paused) {
        waveBgAudio.play().catch(e => console.error(e));
    }

    if (waveGainNode) {
        // Smoothly ramp volume based on intensity
        waveGainNode.gain.setTargetAtTime(Math.min(1, intensity), c.currentTime, 0.5);
    }
};

// Plop/click sound effect
export const playWaterClickSfx = () => {
    if (typeof window === "undefined" || getIsMuted()) return;
    if (!waterClickAudio) {
        waterClickAudio = new window.Audio("/audio/water_click.mp3");
    }
    const clone = waterClickAudio.cloneNode(true) as HTMLAudioElement;
    clone.volume = mainVol;
    clone.play().catch(e => console.error(e));
};
