"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, RotateCcw, Shuffle, Settings2 } from "lucide-react";
import Link from "next/link";

const SPIN_COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#f43f5e","#f97316","#eab308","#22c55e","#14b8a6","#06b6d4","#3b82f6",
];

function spinWheel(ctx: CanvasRenderingContext2D, items: string[], angle: number, size: number) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  const arc = (2 * Math.PI) / items.length;
  ctx.clearRect(0, 0, size, size);
  items.forEach((item, i) => {
    const start = angle + i * arc, end = start + arc;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end);
    ctx.fillStyle = SPIN_COLORS[i % SPIN_COLORS.length]; ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + arc / 2);
    ctx.textAlign = "right"; ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.max(10, Math.min(16, 110 / items.length))}px Inter, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 4;
    const label = item.length > 18 ? item.slice(0, 17) + "…" : item;
    ctx.fillText(label, r - 14, 5); ctx.restore();
  });
  // Center hub
  ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(15,23,42,0.95)"; ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 2; ctx.stroke();
  // Needle (pointing RIGHT / east)
  const nx = cx + r - 4;
  ctx.beginPath(); ctx.moveTo(nx, cy); ctx.lineTo(nx + 22, cy - 11); ctx.lineTo(nx + 22, cy + 11);
  ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 6; ctx.fill();
  ctx.shadowBlur = 0;
}

// Confetti burst via DOM
function launchConfetti() {
  const colors = ["#6366f1","#ec4899","#f97316","#22c55e","#eab308","#06b6d4"];
  const container = document.getElementById("confetti-root");
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = 40 + Math.random() * 20; // percent from left of container
    const vy = -8 - Math.random() * 10;
    const vx = (Math.random() - 0.5) * 14;
    el.style.cssText = `position:absolute;width:8px;height:8px;background:${color};border-radius:2px;top:50%;left:${x}%;transform:translate(-50%,-50%);pointer-events:none;z-index:100;`;
    container.appendChild(el);
    let gy = vy, t = 0;
    const frame = () => {
      t++; gy += 0.5;
      el.style.top = `calc(50% + ${vy * t + 0.25 * t * t * 0.5}px)`;
      el.style.left = `calc(${x}% + ${vx * t}px)`;
      el.style.opacity = String(Math.max(0, 1 - t / 60));
      if (t < 60) requestAnimationFrame(frame); else el.remove();
    };
    requestAnimationFrame(frame);
  }
}

// Click sound via Web Audio
function playClick() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 800 + Math.random() * 400;
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    o.start(); o.stop(ctx.currentTime + 0.08);
    setTimeout(() => ctx.close(), 200);
  } catch {}
}

export default function SpinnerPage() {
  const [items, setItems] = useState(["Option 1","Option 2","Option 3","Option 4","Option 5"]);
  const [newItem, setNewItem] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [autoRemove, setAutoRemove] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [size, setSize] = useState(360);
  const audioCtxRef = useRef<AudioContext | null>(null);


  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setSize(Math.min(w - 16, 400));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    spinWheel(ctx, items, angleRef.current, size);
  }, [items, size]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // Reuse a single AudioContext for all tick sounds
  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 600;
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.04);
    } catch {}
  }, [soundEnabled]);

  const spin = () => {
    if (spinning || items.length < 2) return;
    setSpinning(true); setWinner(null);
    const extraSpins = 5 + Math.random() * 5;
    const targetAngle = angleRef.current + extraSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 2000;
    const start = performance.now();
    const startAngle = angleRef.current;
    let lastTickAngle = startAngle;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      angleRef.current = startAngle + (targetAngle - startAngle) * easeOut(t);
      draw();

      // Tick sound at segment boundaries
      const arc = (2 * Math.PI) / items.length;
      const segmentsPassed = Math.floor((angleRef.current - lastTickAngle) / arc);
      if (segmentsPassed > 0) { playTick(); lastTickAngle += segmentsPassed * arc; }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        const finalAngle = targetAngle % (2 * Math.PI);
        angleRef.current = finalAngle;
        const arc2 = (2 * Math.PI) / items.length;
        // Needle points East (right). Normalize angle so segment 0 starts at needle.
        const normalizedAngle = ((finalAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        // The segment under the needle is whichever segment's start angle wraps around
        const winnerIdx = Math.floor(((2 * Math.PI - normalizedAngle) % (2 * Math.PI)) / arc2) % items.length;
        const w = items[winnerIdx];
        setWinner(w);
        setHistory(h => [w, ...h.slice(0, 14)]);
        setSpinning(false);
        draw();
        if (soundEnabled) launchConfetti();
        if (autoRemove) {
          setTimeout(() => {
            setItems(prev => {
              const next = prev.filter((_, j) => j !== winnerIdx);
              return next.length >= 1 ? next : prev;
            });
            setWinner(null);
          }, 2000);
        }
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed || items.length >= 20 || items.includes(trimmed)) { setNewItem(""); return; }
    setItems(i => [...i, trimmed]); setNewItem(""); setWinner(null);
  };

  const importCSV = () => {
    const parsed = csvInput.split(",").map(s => s.trim()).filter(s => s && !items.includes(s));
    if (!parsed.length) return;
    setItems(prev => [...prev, ...parsed].slice(0, 20));
    setCsvInput(""); setWinner(null);
  };

  const removeItem = (idx: number) => { setItems(i => i.filter((_, j) => j !== idx)); setWinner(null); };
  const shuffle = () => setItems(i => [...i].sort(() => Math.random() - 0.5));
  const reset = () => { setItems(["Option 1","Option 2","Option 3","Option 4","Option 5"]); setWinner(null); setHistory([]); };

  return (
    <div className="min-h-screen bg-slate-950">
      <div id="confetti-root" className="fixed inset-0 pointer-events-none overflow-hidden z-50" />
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-700 flex items-center justify-center text-base">🎲</div>
          <span className="text-white font-bold">Decision Spinner</span>
          <button onClick={() => setShowSettings(s => !s)} className={`ml-auto p-2 rounded-lg border transition-colors ${showSettings ? "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300" : "border-white/10 text-slate-500 hover:text-white"}`}>
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Wheel */}
          <div ref={containerRef} className="flex flex-col items-center gap-5">
            <div className="relative w-full flex justify-center">
              <canvas ref={canvasRef} width={size} height={size} className="rounded-full shadow-2xl shadow-violet-900/40 drop-shadow-2xl" />
            </div>

            <AnimatePresence>
              {winner && (
                <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-2xl px-8 py-5 w-full"
                >
                  <div className="text-3xl mb-2">🎉</div>
                  <div className="text-2xl font-black text-white">{winner}</div>
                  <div className="text-xs text-violet-400 mt-1 font-semibold">Winner!{autoRemove ? " (removing in 2s…)" : ""}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              <button onClick={spin} disabled={spinning || items.length < 2}
                className="px-10 py-4 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >{spinning ? "Spinning…" : "Spin!"}</button>
              <button onClick={() => { setWinner(null); draw(); }} className="p-4 rounded-2xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors" title="Reset result">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Settings panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 space-y-3 overflow-hidden"
                >
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Settings</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={autoRemove} onChange={e => setAutoRemove(e.target.checked)} className="accent-fuchsia-500 w-4 h-4" />
                    <span className="text-sm text-slate-300">Auto-remove winner from list</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} className="accent-fuchsia-500 w-4 h-4" />
                    <span className="text-sm text-slate-300">Sound effects (ticking + confetti)</span>
                  </label>
                  <button onClick={reset} className="text-xs text-red-400 hover:text-red-300 transition-colors font-semibold">Reset all options</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Options list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold">Options <span className="text-slate-500 text-sm font-normal">({items.length}/20)</span></h2>
              <button onClick={shuffle} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg">
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
            </div>

            {/* Add single */}
            <div className="flex gap-2">
              <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()}
                placeholder="Add option... (Enter)"
                className="flex-1 bg-slate-900 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-violet-500/50 transition-colors placeholder:text-slate-600"
              />
              <button onClick={addItem} className="p-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-colors"><Plus className="w-5 h-5" /></button>
            </div>

            {/* CSV import */}
            <div className="flex gap-2">
              <input value={csvInput} onChange={e => setCsvInput(e.target.value)}
                placeholder="Paste CSV: Apple, Banana, Cherry..."
                className="flex-1 bg-slate-900 border border-dashed border-white/10 text-white px-4 py-2 rounded-xl text-xs outline-none focus:border-violet-500/30 transition-colors placeholder:text-slate-700"
              />
              <button onClick={importCSV} disabled={!csvInput.trim()} className="px-3 py-2 bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors">Import</button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {items.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 border rounded-xl px-4 py-2.5 transition-colors ${winner === item ? "bg-violet-500/10 border-violet-500/30" : "bg-slate-900 border-white/10"}`}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: SPIN_COLORS[i % SPIN_COLORS.length] }} />
                  <span className="flex-1 text-sm text-slate-200 truncate">{item}</span>
                  <button onClick={() => removeItem(i)} className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="pt-3 border-t border-white/5">
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-2">Spin History</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((h, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-lg bg-slate-800 border border-white/5 text-slate-400">{i === 0 && "🏆 "}{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
