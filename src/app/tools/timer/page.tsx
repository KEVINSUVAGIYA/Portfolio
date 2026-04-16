"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw, Copy, CheckCheck, Timer } from "lucide-react";
import Link from "next/link";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { ref, set, onValue, off } from "firebase/database";
import { copyToClipboard } from "@/lib/utils";

interface TimerState {
  endsAt: number;    // epoch ms when timer reaches 0 (if running)
  paused: boolean;
  remaining: number; // ms remaining when paused
  label: string;
  totalMs: number;
  ownerId: string;
  updatedAt: number;
}


function NotConfigured() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-6 text-3xl">🔧</div>
        <h2 className="text-xl font-bold text-white mb-2">Firebase Not Configured</h2>
        <p className="text-slate-400 text-sm mb-4">
          Copy <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local.example</code> to{" "}
          <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local</code> and add your Firebase credentials, then restart the dev server.
        </p>
        <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition-all">
          Open Firebase Console →
        </a>
      </div>
    </div>
  );
}

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function TimerSetup({ onStart }: { onStart: (id: string) => void }) {
  const router = useRouter();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [label, setLabel] = useState("");
  const [customId, setCustomId] = useState("");

  const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

  const create = async () => {
    if (totalMs <= 0) return;
    const cleanId = customId.trim().replace(/\s+/g, "-").toLowerCase();
    const id = cleanId || `timer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const ownerId = `owner-${Date.now()}`;
    sessionStorage.setItem(`timer-owner-${id}`, ownerId);

    const db = getFirebaseDb();
    const state: TimerState = {
      endsAt: Date.now() + totalMs,
      paused: false,
      remaining: totalMs,
      label: label.trim() || "Shared Timer",
      totalMs,
      ownerId,
      updatedAt: Date.now(),
    };
    await set(ref(db, `tools/timers/${id}`), state);
    router.push(`/tools/timer?id=${id}`);
  };

  const NumInput = ({ label: lbl, value, onChange, max }: { label: string; value: number; onChange: (n: number) => void; max: number }) => (
    <div className="flex flex-col items-center">
      <button onClick={() => onChange(Math.min(max, value + 1))} className="w-10 h-8 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-lg font-bold">+</button>
      <div className="w-16 h-14 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center">
        <span className="text-2xl font-black text-white font-mono">{String(value).padStart(2, "0")}</span>
      </div>
      <button onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-8 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-lg font-bold">−</button>
      <span className="text-xs text-slate-500 mt-1">{lbl}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-sky-500/30">
            <Timer className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Shared Timer</h1>
          <p className="text-slate-400 mb-8">Set a timer and share the link. Everyone sees the same countdown in real time.</p>

          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-center gap-4">
              <NumInput label="Hours" value={hours} onChange={setHours} max={23} />
              <span className="text-3xl font-black text-slate-600 mb-2">:</span>
              <NumInput label="Min" value={minutes} onChange={setMinutes} max={59} />
              <span className="text-3xl font-black text-slate-600 mb-2">:</span>
              <NumInput label="Sec" value={seconds} onChange={setSeconds} max={59} />
            </div>

            <div className="space-y-3">
              <input value={label} onChange={(e) => setLabel(e.target.value)}
                placeholder="Label (optional, e.g. 'Stand-up meeting')"
                className="w-full bg-slate-800 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-600"
              />
              <input value={customId} onChange={(e) => setCustomId(e.target.value)}
                placeholder="Custom Timer ID (optional, e.g. 'team-sync')"
                className="w-full bg-slate-800 border border-white/10 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-600 font-mono"
              />
            </div>

            <button onClick={create} disabled={totalMs <= 0}
              className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Start Shared Timer
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-4 text-center">Powered by Firebase · Anyone with the link sees the same time</p>
        </motion.div>
      </div>
    </div>
  );
}

function SharedTimerView({ id }: { id: string }) {
  const [state, setState] = useState<TimerState | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const rafRef = useRef<number>(0);
  const circleRef = useRef<SVGCircleElement>(null);
  const timeTextRef = useRef<HTMLParagraphElement>(null);

  // Check ownership client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOwner = sessionStorage.getItem(`timer-owner-${id}`);
      setState((s) => {
        if (s && storedOwner === s.ownerId) setIsOwner(true);
        return s;
      });
      setIsOwner(!!storedOwner);
    }
  }, [id]);

  // Subscribe to Firebase timer state
  useEffect(() => {
    const db = getFirebaseDb();
    const timerRef = ref(db, `tools/timers/${id}`);
    const unsub = onValue(timerRef, (snap) => {
      const data: TimerState | null = snap.val();
      if (!data) return;
      setState(data);
      // Check if user is the owner
      if (typeof window !== "undefined") {
        const storedOwner = sessionStorage.getItem(`timer-owner-${id}`);
        if (storedOwner === data.ownerId) setIsOwner(true);
      }
    });
    return () => { off(timerRef); unsub(); };
  }, [id]);

  // Animation loop for smooth countdown
  useEffect(() => {
    const tick = () => {
      if (!state) return;
      let ms: number;
      if (state.paused) {
        ms = state.remaining;
      } else {
        ms = Math.max(0, state.endsAt - Date.now());
      }
      
      const done = ms === 0 && !state.paused;
      const progress = ms / state.totalMs;
      const circumference = 2 * Math.PI * 110;

      // Update DOM directly to avoid 60FPS React renders
      if (timeTextRef.current) timeTextRef.current.textContent = done ? "Done!" : fmt(ms);
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(circumference * (1 - progress));
        circleRef.current.style.stroke = done ? "#ef4444" : state.paused ? "#f59e0b" : "#06b6d4";
      }

      if (ms > 0 && !state.paused) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state]);

  const pushState = (patch: Partial<TimerState>) => {
    if (!state) return;
    const db = getFirebaseDb();
    set(ref(db, `tools/timers/${id}`), { ...state, ...patch, updatedAt: Date.now() });
  };

  const handlePause = () => {
    if (!state || !isOwner) return;
    const remaining = Math.max(0, state.endsAt - Date.now());
    pushState({ paused: true, remaining });
  };

  const handleResume = () => {
    if (!state || !isOwner) return;
    pushState({ paused: false, endsAt: Date.now() + state.remaining });
  };

  const handleReset = () => {
    if (!state || !isOwner) return;
    pushState({ paused: true, remaining: state.totalMs, endsAt: Date.now() + state.totalMs });
  };

  const copyLink = async () => { await copyToClipboard(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const circumference = 2 * Math.PI * 110;

  if (!state) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading timer…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center">
              <Timer className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold truncate">{state.label}</span>
          </div>
          <button onClick={copyLink} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs text-slate-300">
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Share
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8">
          {/* Circular progress */}
          <div className="relative">
            <svg width="260" height="260" className="-rotate-90">
              <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle
                ref={circleRef}
                cx="130" cy="130" r="110" fill="none"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                style={{ transition: "stroke 0.3s" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p ref={timeTextRef} className="text-5xl font-black text-white font-mono tabular-nums">--:--</p>
              <p className="text-slate-500 text-sm mt-1">{state.paused ? "Paused" : "Running"}</p>
            </div>
          </div>

          {/* Controls (owner only) */}
          {isOwner ? (
            <div className="flex items-center gap-3">
              {state.paused ? (
                <button onClick={handleResume} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-sky-500/30">
                  <Play className="w-4 h-4" /> Resume
                </button>
              ) : (
                <button onClick={handlePause} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/30">
                  <Pause className="w-4 h-4" /> Pause
                </button>
              )}
              <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Only the creator can control this timer.</p>
          )}

          <Link href="/tools/timer" className="text-sky-500 hover:text-sky-400 text-sm transition-colors">+ Create a new timer</Link>
        </motion.div>
      </div>
    </div>
  );
}

function TimerPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!isFirebaseConfigured()) return <NotConfigured />;
  if (!id) return <TimerSetup onStart={() => {}} />;
  return <SharedTimerView id={id} />;
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <TimerPageInner />
    </Suspense>
  );
}
