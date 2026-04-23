"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw, Music, Zap, Volume2 } from "lucide-react";
import Link from "next/link";

type SoundPack = "click" | "woodblock" | "digital";

function scheduleNote(ctx: AudioContext, accent: boolean, isMain: boolean, pack: SoundPack, when: number, vol: number) {
  const g = ctx.createGain();
  g.connect(ctx.destination);
  if (!isMain) {
    // subdivision tick
    const o = ctx.createOscillator();
    o.connect(g);
    o.frequency.value = 1200;
    g.gain.setValueAtTime(0.12 * vol, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.02);
    o.start(when); o.stop(when + 0.02);
    return;
  }
  if (pack === "click") {
    const o = ctx.createOscillator();
    o.connect(g);
    o.frequency.value = accent ? 1400 : 900;
    g.gain.setValueAtTime((accent ? 0.9 : 0.55) * vol, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.04);
    o.start(when); o.stop(when + 0.04);
  } else if (pack === "woodblock") {
    const o = ctx.createOscillator();
    o.type = "square";
    o.connect(g);
    o.frequency.value = accent ? 700 : 450;
    g.gain.setValueAtTime((accent ? 0.5 : 0.3) * vol, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.06);
    o.start(when); o.stop(when + 0.06);
  } else {
    const o = ctx.createOscillator();
    o.type = "square";
    o.connect(g);
    o.frequency.value = accent ? 1000 : 600;
    g.gain.setValueAtTime((accent ? 0.4 : 0.25) * vol, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.03);
    o.start(when); o.stop(when + 0.03);
  }
}

const TEMPO_LABELS: [number, string][] = [[40,"Largo"],[60,"Adagio"],[80,"Andante"],[100,"Moderato"],[120,"Allegretto"],[140,"Allegro"],[180,"Vivace"],[200,"Presto"]];
function getTempoLabel(bpm: number) {
  for (let i = TEMPO_LABELS.length - 1; i >= 0; i--) {
    if (bpm >= TEMPO_LABELS[i][0]) return TEMPO_LABELS[i][1];
  }
  return "Largo";
}

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [subdivision, setSubdivision] = useState(1);
  const [soundPack, setSoundPack] = useState<SoundPack>("click");
  const [flashMode, setFlashMode] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextBeatTimeRef = useRef(0);
  const subCounterRef = useRef(0);

  // Mutable refs to avoid stale closures in scheduler
  const bpmRef = useRef(bpm);
  const beatsPerBarRef = useRef(beatsPerBar);
  const subdivisionRef = useRef(subdivision);
  const packRef = useRef<SoundPack>(soundPack);
  const volRef = useRef(volume);
  const flashRef = useRef(flashMode);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { beatsPerBarRef.current = beatsPerBar; }, [beatsPerBar]);
  useEffect(() => { subdivisionRef.current = subdivision; }, [subdivision]);
  useEffect(() => { packRef.current = soundPack; }, [soundPack]);
  useEffect(() => { volRef.current = volume; }, [volume]);
  useEffect(() => { flashRef.current = flashMode; }, [flashMode]);

  const SCHEDULE_AHEAD = 0.1; // s
  const TICK_MS = 25; // ms

  const runScheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const subDiv = subdivisionRef.current;
    const bpb = beatsPerBarRef.current;
    const subDuration = 60 / bpmRef.current / subDiv;
    const totalSubs = bpb * subDiv;

    while (nextBeatTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD) {
      const subIdx = subCounterRef.current % totalSubs;
      const isMain = subIdx % subDiv === 0;
      const beatNum = Math.floor(subIdx / subDiv);
      const isAccent = beatNum === 0;
      scheduleNote(ctx, isAccent, isMain, packRef.current, nextBeatTimeRef.current, volRef.current);

      if (isMain) {
        const delay = Math.max(0, (nextBeatTimeRef.current - ctx.currentTime) * 1000);
        const capturedBeat = beatNum;
        setTimeout(() => {
          setBeat(capturedBeat);
          if (flashRef.current) { setIsFlashing(true); setTimeout(() => setIsFlashing(false), 80); }
        }, delay);
      }

      subCounterRef.current++;
      nextBeatTimeRef.current += subDuration;
    }
    timerRef.current = window.setTimeout(runScheduler, TICK_MS);
  }, []);

  const start = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    else if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    subCounterRef.current = 0;
    nextBeatTimeRef.current = audioCtxRef.current.currentTime + 0.05;
    runScheduler();
  }, [runScheduler]);

  const stop = useCallback(() => {
    if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    if (running) { start(); } else { stop(); }
    return stop;
  }, [running, start, stop]);

  // Restart scheduler cleanly when BPM/subdivision/beatsPerBar changes while running
  useEffect(() => {
    if (!running) return;
    stop();
    const ctx = audioCtxRef.current;
    if (ctx) {
      subCounterRef.current = 0;
      nextBeatTimeRef.current = ctx.currentTime + 0.05;
      setTimeout(runScheduler, 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, subdivision, beatsPerBar]);

  useEffect(() => () => { stop(); audioCtxRef.current?.close(); }, [stop]);

  const handleTap = () => {
    const now = Date.now();
    const newTaps = [...tapTimes.filter(t => now - t < 3000), now].slice(-8);
    setTapTimes(newTaps);
    if (newTaps.length >= 2) {
      const diffs = newTaps.slice(1).map((t, i) => t - newTaps[i]);
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      setBpm(Math.max(20, Math.min(300, Math.round(60000 / avg))));
    }
  };

  const reset = () => { setRunning(false); setBeat(0); setTapTimes([]); };

  const SUBDIV_OPTIONS = [
    { val: 1, label: "♩ Quarter" }, { val: 2, label: "♪ 8th" },
    { val: 3, label: "♪♪♪ Triplet" }, { val: 4, label: "16th" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-75 ${flashMode && isFlashing && running ? "bg-white" : "bg-slate-950"}`}>
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center"><Music className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Metronome</span>
          <button onClick={() => setFlashMode(f => !f)} className={`ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors font-semibold ${flashMode ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-white/10 text-slate-500 hover:text-white"}`}>
            <Zap className="w-3.5 h-3.5" /> Flash
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-1">Metronome</h1>
          <p className="text-slate-400 text-sm">Sample-accurate timing · Subdivisions · Flash mode · Sound packs</p>
        </motion.div>

        <div className={`rounded-3xl p-8 flex flex-col items-center gap-6 border transition-colors ${flashMode && isFlashing && running ? "bg-violet-500/20 border-violet-500/40" : "bg-slate-900 border-white/10"}`}>
          <div className="relative h-36 w-full flex items-end justify-center">
            <div className="absolute top-0 w-px h-full bg-slate-700" />
            <motion.div animate={{ x: running ? (beat % 2 === 0 ? 55 : -55) : 0 }}
              transition={{ duration: (60 / bpm) * 0.85, ease: "easeInOut" }}
              className="absolute top-0 flex flex-col items-center"
            >
              <div className="w-px h-28 bg-slate-300" />
              <motion.div animate={{ scale: flashMode && isFlashing && running ? 1.3 : 1 }}
                className={`w-10 h-10 rounded-full shadow-xl transition-colors ${running && beat === 0 ? "bg-violet-500 shadow-violet-500/50" : "bg-slate-300"}`}
              />
            </motion.div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {Array.from({ length: beatsPerBar }).map((_, bi) => (
              <div key={bi} className="flex gap-1 items-center">
                {Array.from({ length: subdivision }).map((_, si) => (
                  <motion.div key={si}
                    animate={{ scale: running && bi === beat && si === 0 ? 1.6 : 1, opacity: running && bi === beat ? 1 : 0.3 }}
                    transition={{ duration: 0.05 }}
                    className={`rounded-full ${si === 0 ? "w-4 h-4" : "w-2 h-2"} ${si === 0 ? (bi === 0 ? "bg-violet-500" : "bg-slate-400") : "bg-slate-600"}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="text-8xl font-black text-white font-mono tabular-nums leading-none">{bpm}</div>
          <div className="text-slate-500 font-semibold">{getTempoLabel(bpm)} · BPM</div>
        </div>

        <div className="space-y-3">
          <input type="range" min={20} max={300} value={bpm} onChange={e => setBpm(Number(e.target.value))} className="w-full accent-violet-500" />
          <div className="flex flex-wrap gap-2 justify-center">
            {([[60,"Adagio"],[80,"Andante"],[100,"Moderato"],[120,"Allegretto"],[140,"Allegro"],[176,"Vivace"]] as [number,string][]).map(([b,label]) => (
              <button key={b} onClick={() => setBpm(b as number)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${bpm === b ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-white/10 text-slate-500 hover:text-white"}`}
              >{label as string}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Beats per bar</label>
            <div className="flex gap-1.5 flex-wrap">
              {[2,3,4,5,6,7,8].map(b => (
                <button key={b} onClick={() => setBeatsPerBar(b)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${beatsPerBar === b ? "bg-violet-600 text-white" : "bg-slate-800 border border-white/10 text-slate-400 hover:text-white"}`}
                >{b}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Subdivision</label>
            <div className="flex flex-col gap-1.5">
              {SUBDIV_OPTIONS.map(s => (
                <button key={s.val} onClick={() => setSubdivision(s.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors text-left ${subdivision === s.val ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-white/10 text-slate-500 hover:text-white"}`}
                >{s.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Sound Pack</label>
          <div className="flex gap-2 flex-wrap">
            {(["click","woodblock","digital"] as SoundPack[]).map(s => (
              <button key={s} onClick={() => setSoundPack(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border capitalize transition-all ${soundPack === s ? "bg-violet-600 border-violet-600 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input type="range" min={0} max={1} step={0.05} value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1 accent-violet-500" />
          <span className="text-xs text-slate-500 w-8 text-right font-mono">{Math.round(volume * 100)}%</span>
        </div>

        <div className="flex gap-3">
          <button onClick={handleTap} className="flex-1 py-4 rounded-2xl bg-slate-800 border border-white/10 text-white font-bold text-lg hover:bg-slate-700 transition-colors active:scale-95">
            Tap {tapTimes.length > 1 ? `(${tapTimes.length})` : ""}
          </button>
          <button onClick={() => setRunning(!running)}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity"
          >{running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Start</>}</button>
          <button onClick={reset} className="p-4 rounded-2xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
