"use client";

// Global Audio Context and Nodes
let ctx: AudioContext | null = null;
let mainGainNode: GainNode | null = null;
let bgGainNode: GainNode | null = null;
let masterGainNode: GainNode | null = null;

// BG Music state
let bgOscillators: OscillatorNode[] = [];
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

// Procedural Drone Background Music
export const toggleBgMusic = (theme: "zen" | "flight" | "world" | "lanterns") => {
    const c = getAudioCtx();
    if (!c || !bgGainNode) return;

    if (isBgPlaying) {
        bgOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) { }
        });
        bgOscillators = [];
        isBgPlaying = false;
        return false;
    }

    if (c.state === "suspended") c.resume();

    // Cinematic Ambient Generative Engine
    const rootNotes = {
        zen: 65.41,     // C2 (Very deep, calming)
        lanterns: 87.31,// F2 (Hopeful, warm)
        world: 73.42,   // D2 (Mysterious)
        flight: 98.00   // G2 (Airy, uplifting)
    };

    const root = rootNotes[theme] || 65.41;

    // Create a massive reverb/delay network to wash out the synths into a cinematic pad
    const delayL = c.createDelay(2.0); delayL.delayTime.value = 0.43;
    const delayR = c.createDelay(2.0); delayR.delayTime.value = 0.65;
    const fbL = c.createGain(); fbL.gain.value = 0.6;
    const fbR = c.createGain(); fbR.gain.value = 0.6;
    const filterDelay = c.createBiquadFilter();
    filterDelay.type = "lowpass"; filterDelay.frequency.value = 1200;

    delayL.connect(fbL); fbL.connect(filterDelay); filterDelay.connect(delayR);
    delayR.connect(fbR); fbR.connect(delayL);

    // Stereo spread
    const panL = c.createStereoPanner(); panL.pan.value = -0.8;
    const panR = c.createStereoPanner(); panR.pan.value = 0.8;
    delayL.connect(panL); delayR.connect(panR);
    panL.connect(bgGainNode); panR.connect(bgGainNode);

    // Main Filter
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 1.0;
    filter.connect(bgGainNode);
    filter.connect(delayL); // Feed dry signal into reverb network

    // Sweeping LFO for the breathing cinematic effect
    const lfo = c.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.03; // Extremely slow 33-second breath
    const lfoGain = c.createGain();
    lfoGain.gain.value = 350; // Sweep width
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    bgOscillators.push(lfo);

    // Build the "Hans Zimmer" Pad chord structure
    // Root, Sub-octave, Perfect Fifth, Major/Minor Third based on theme
    const ratio3rd = theme === "flight" || theme === "lanterns" ? 1.25 : 1.189; // Major or Minor
    const ratios = [0.5, 1, 1.002, 0.998, 1.5, ratio3rd, 2];

    ratios.forEach((ratio, i) => {
        const osc = c.createOscillator();
        // Mix saw and triangle for rich harmonics
        osc.type = i % 3 === 0 ? "sawtooth" : (i % 2 === 0 ? "sine" : "triangle");
        osc.frequency.value = root * ratio;

        const oscGain = c.createGain();
        oscGain.gain.value = 0;

        // Massive 5-second fade in per oscillator, varying slightly so chord evolves
        const fadeTime = 4 + (i * 1.5);
        // Reduce volume for harsher waveforms
        const maxVol = osc.type === "sawtooth" ? 0.03 : 0.06;
        oscGain.gain.linearRampToValueAtTime(maxVol, c.currentTime + fadeTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        bgOscillators.push(osc);
    });

    isBgPlaying = true;
    return true;
};
