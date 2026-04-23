"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Keyboard, BarChart2, X } from "lucide-react";
import Link from "next/link";

const QUOTES: Record<string, string[]> = {
  quotes: [
    "The quick brown fox jumps over the lazy dog near the riverbank.",
    "Technology alone is not enough — it must marry with liberal arts.",
    "Design is not just what it looks like. Design is how it works.",
    "Innovation distinguishes between a leader and a follower.",
    "Stay hungry, stay foolish. Never let the noise of others drown your inner voice.",
    "The only way to do great work is to love what you do every single day.",
    "Simplicity is the ultimate sophistication in product design.",
    "We cannot solve problems with the same thinking that created them.",
    "The measure of intelligence is the ability to change and adapt.",
    "If you want to go fast go alone. If you want to go far go together.",
  ],
  code: [
    "const greet = (name) => `Hello, ${name}!`;",
    "function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }",
    "const doubled = [1,2,3,4,5].map(x => x * 2).filter(x => x > 4);",
    "async function fetchData(url) { const res = await fetch(url); return res.json(); }",
    "class Stack { constructor() { this.items = []; } push(x) { this.items.push(x); } }",
  ],
  common: [
    "time will tell the great and small among us all in good time",
    "be the change that you wish to see in the world around you",
    "success is not final failure is not fatal it is the courage to continue that counts",
    "all our dreams can come true if we have the courage to pursue them each day",
    "it does not matter how slowly you go as long as you do not stop",
  ],
};

type Mode = "time" | "words";
type Category = "quotes" | "code" | "common";

export default function TypingTestPage() {
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [mode, setMode] = useState<Mode>("time");
  const [category, setCategory] = useState<Category>("quotes");
  const [quote, setQuote] = useState("");
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [zenMode, setZenMode] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastQuoteRef = useRef("");
  const doneRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("typing-best-wpm");
    if (saved) setBestWpm(Number(saved));
  }, []);

  const buildQuote = useCallback((cat: Category, m: Mode, wl: number) => {
    const pool = QUOTES[cat].filter(q => q !== lastQuoteRef.current);
    const base = pool[Math.floor(Math.random() * pool.length)];
    lastQuoteRef.current = base;
    if (m === "time") return (base + " ").repeat(6).trim();
    const words = (base + " " + base).split(/\s+/).filter(Boolean).slice(0, wl);
    return words.join(" ");
  }, []);

  const newQuote = useCallback((cat = category, m = mode, wl = wordLimit) => {
    setQuote(buildQuote(cat as Category, m as Mode, wl));
    setInput(""); setStarted(false); setDone(false); doneRef.current = false;
    setWpm(0); setAccuracy(100); setErrorCount(0); setWpmHistory([]);
    setTimeLeft(timeLimit);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [category, mode, wordLimit, timeLimit, buildQuote]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { newQuote(); }, []);

  // Timer
  useEffect(() => {
    if (started && mode === "time" && !done) {
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const left = Math.max(0, timeLimit - elapsed);
        setTimeLeft(Math.ceil(left));
        setInput(prev => {
          const correctChars = [...prev].filter((c, i) => c === quote[i]).length;
          const elapsedMin = elapsed / 60;
          const cur = elapsedMin > 0.001 ? Math.round((correctChars / 5) / elapsedMin) : 0;
          setWpm(cur);
          setWpmHistory(h => [...h.slice(-119), cur]);
          return prev;
        });
        if (left <= 0) { clearInterval(intervalRef.current!); }
      }, 500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, mode, done, timeLimit]);

  // Separate effect: finish when timeLeft hits 0
  useEffect(() => {
    if (started && mode === "time" && timeLeft === 0 && !doneRef.current) {
      doneRef.current = true;
      setDone(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setInput(prev => {
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        const correctChars = [...prev].filter((c, i) => c === quote[i]).length;
        const finalWpm = elapsed > 0.001 ? Math.round((correctChars / 5) / elapsed) : 0;
        const errors = [...prev].filter((c, i) => c !== quote[i]).length;
        const acc = prev.length > 0 ? Math.round(((prev.length - errors) / prev.length) * 100) : 100;
        setWpm(finalWpm); setAccuracy(acc); setErrorCount(errors);
        const prevBest = Number(localStorage.getItem("typing-best-wpm") || "0");
        localStorage.setItem("typing-prev-best", String(prevBest));
        localStorage.setItem("typing-best-wpm", String(Math.max(prevBest, finalWpm)));
        setBestWpm(Math.max(prevBest, finalWpm));
        return prev;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const finishTest = useCallback((val: string) => {
    if (doneRef.current) return;
    doneRef.current = true; setDone(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsed = (Date.now() - startTimeRef.current) / 60000;
    const correctChars = [...val].filter((c, i) => c === quote[i]).length;
    const finalWpm = elapsed > 0.001 ? Math.round((correctChars / 5) / elapsed) : 0;
    const errors = [...val].filter((c, i) => c !== quote[i]).length;
    const acc = val.length > 0 ? Math.round(((val.length - errors) / val.length) * 100) : 100;
    setWpm(finalWpm); setAccuracy(acc); setErrorCount(errors);
    const prevBest = Number(localStorage.getItem("typing-best-wpm") || "0");
    localStorage.setItem("typing-prev-best", String(prevBest));
    localStorage.setItem("typing-best-wpm", String(Math.max(prevBest, finalWpm)));
    setBestWpm(Math.max(prevBest, finalWpm));
  }, [quote]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (done) return;
    const val = e.target.value;
    if (!started && val.length > 0) { setStarted(true); startTimeRef.current = Date.now(); }
    setInput(val);
    const errors = [...val].filter((c, i) => c !== quote[i]).length;
    setErrorCount(errors);
    setAccuracy(val.length > 0 ? Math.round(((val.length - errors) / val.length) * 100) : 100);
    if (mode === "words") {
      const target = quote.trim().split(/\s+/).slice(0, wordLimit).join(" ");
      if (val.trimEnd() === target) finishTest(val);
    }
  };

  // Auto-scroll display to cursor
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [input]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setZenMode(false); }
      if (e.key === "Tab" && !["INPUT","TEXTAREA"].includes((e.target as Element).tagName)) {
        e.preventDefault(); newQuote();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [newQuote]);

  const displayQuote = useMemo(() =>
    mode === "words" ? quote.trim().split(/\s+/).slice(0, wordLimit).join(" ") : quote,
    [mode, quote, wordLimit]
  );

  const chars = useMemo(() => displayQuote.split("").map((char, i) => {
    if (i < input.length) return { char, state: input[i] === char ? "correct" : "error" };
    if (i === input.length) return { char, state: "cursor" };
    return { char, state: "pending" };
  }), [displayQuote, input]);

  const wordCount = mode === "words" ? input.trim().split(/\s+/).filter(Boolean).length : 0;
  const progress = mode === "time"
    ? ((timeLimit - timeLeft) / timeLimit) * 100
    : (wordCount / wordLimit) * 100;

  const prevBest = typeof window !== "undefined" ? Number(localStorage.getItem("typing-prev-best") || "0") : 0;
  const isNewBest = done && wpm > prevBest && wpm > 0;

  const chartMax = Math.max(...wpmHistory, 20);
  const W = 100; const H = 48;
  const chartPoints = wpmHistory.map((v, i) =>
    `${(i / Math.max(wpmHistory.length - 1, 1)) * W},${H - (v / chartMax) * H * 0.88}`
  ).join(" ");

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className={`border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 transition-all duration-300 ${zenMode && started && !done ? "opacity-0 pointer-events-none" : ""}`}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><Keyboard className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Typing Speed Test</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-600 hidden sm:block">Tab = new</span>
            <button onClick={() => setZenMode(z => !z)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-semibold ${zenMode ? "border-green-500/40 bg-green-500/10 text-green-300" : "border-white/10 text-slate-500 hover:text-white"}`}
            >Zen</button>
          </div>
        </div>
      </div>

      {/* Zen exit — hover top-right */}
      {zenMode && started && !done && (
        <button onClick={() => setZenMode(false)}
          className="fixed top-4 right-4 z-50 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity bg-slate-800/90 border border-white/20 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 backdrop-blur"
        ><X className="w-3.5 h-3.5" /> Exit Zen (Esc)</button>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Mode controls — only when not mid-test */}
        {(!started || done) && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Typing Speed Test</h1>
              <p className="text-slate-500 text-sm">Click the text box below and start typing · Tab = new quote · Esc = exit Zen</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1">
                {(["time","words"] as Mode[]).map(m => (
                  <button key={m} onClick={() => { setMode(m); newQuote(category, m, wordLimit); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === m ? "bg-green-600 text-white" : "text-slate-500 hover:text-white"}`}
                  >{m === "time" ? "⏱ Time" : "📝 Words"}</button>
                ))}
              </div>
              {mode === "time" && [15,30,60,120].map(t => (
                <button key={t} onClick={() => { setTimeLimit(t); setTimeLeft(t); newQuote(category, mode, wordLimit); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${timeLimit === t ? "bg-green-600 border-green-600 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                >{t}s</button>
              ))}
              {mode === "words" && [10,25,50,100].map(w => (
                <button key={w} onClick={() => { setWordLimit(w); newQuote(category, mode, w); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${wordLimit === w ? "bg-green-600 border-green-600 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                >{w}w</button>
              ))}
              <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1 ml-auto">
                {(["quotes","code","common"] as Category[]).map(c => (
                  <button key={c} onClick={() => { setCategory(c); newQuote(c, mode, wordLimit); }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${category === c ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}
                  >{{quotes:"Quotes",code:"Code",common:"Common"}[c]}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className={`grid grid-cols-4 gap-3 transition-opacity ${zenMode && started && !done ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {[
            { label: mode === "time" ? "Time" : "Words", value: mode === "time" ? `${timeLeft}s` : `${Math.min(wordCount,wordLimit)}/${wordLimit}`, color: mode==="time" && timeLeft<=5 && started ? "text-red-400" : "text-white" },
            { label: "WPM", value: started ? wpm : "—", color: "text-green-400" },
            { label: "Accuracy", value: started ? `${accuracy}%` : "—", color: accuracy>=95?"text-emerald-400":accuracy>=80?"text-amber-400":"text-red-400" },
            { label: "Best", value: bestWpm || "—", color: "text-violet-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-black ${color} mb-1 tabular-nums`}>{value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {started && !done && (
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${mode==="time" && timeLeft<=5 ? "bg-red-500" : "bg-green-500"}`}
              animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* ── Text display ── */}
        <div ref={displayRef}
          className="bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 max-h-48 overflow-y-auto scroll-smooth cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Legend */}
          {!started && (
            <div className="flex gap-4 text-[10px] mb-3 pb-2 border-b border-white/5">
              <span className="text-slate-500">✔ <span className="text-slate-500">Typed correctly</span></span>
              <span className="text-red-400">✘ Wrong character</span>
              <span className="text-slate-100 font-bold">| Cursor (type this next)</span>
              <span className="text-slate-400">Remaining</span>
            </div>
          )}
          <p className="font-mono text-lg leading-loose select-none tracking-wide break-words">
            {chars.map(({ char, state }, i) => {
              switch (state) {
                case "correct":
                  return <span key={i} className="text-slate-500">{char}</span>;
                case "error":
                  return <span key={i} className={`text-red-400 ${char===" " ? "bg-red-500/40 rounded-sm" : "bg-red-500/20 rounded-sm"}`}>
                    {char === " " ? "·" : char}
                  </span>;
                case "cursor":
                  return (
                    <span key={i} className="relative inline">
                      <span ref={cursorRef} className="absolute -left-px inset-y-0 w-0.5 bg-green-400 rounded-full"
                        style={{ animation: "blink 1s step-end infinite" }} />
                      <span className="text-slate-100 font-bold">{char}</span>
                    </span>
                  );
                default:
                  return <span key={i} className="text-slate-400">{char}</span>;
              }
            })}
          </p>
        </div>

        {/* ── Input box ── */}
        <div>
          <textarea ref={inputRef} value={input} onChange={handleChange} disabled={done}
            placeholder="Click here and start typing — the text above will highlight in real-time"
            className="w-full bg-slate-900 border border-white/10 text-slate-200 rounded-2xl px-5 py-4 font-mono text-base resize-none h-24 outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-700 disabled:opacity-50 leading-relaxed"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          />
          <p className="text-xs text-slate-600 mt-1 px-1">Characters you type here are matched against the text above in real-time · Tab = new quote</p>
        </div>

        {/* Live WPM chart */}
        {wpmHistory.length > 3 && !done && (
          <div className="bg-slate-900 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Live WPM</span>
              </div>
              <span className="text-xs text-green-400 font-mono font-bold">{wpm} wpm</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H}>
              <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              {/* Area */}
              <polyline
                points={`0,${H} ${chartPoints} ${W},${H}`}
                fill="rgba(34,197,94,0.08)" stroke="none"
              />
              {/* Line */}
              <polyline points={chartPoints} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
            >
              <div className="text-4xl mb-2">{isNewBest ? "🏆" : "🎉"}</div>
              <h2 className="text-4xl font-black text-white mb-1 tabular-nums">
                {wpm} <span className="text-xl font-semibold text-slate-400">WPM</span>
              </h2>
              <div className="flex flex-wrap gap-4 text-sm mb-5">
                <span className={accuracy>=95?"text-emerald-400":"text-amber-400"}>{accuracy}% accuracy</span>
                {errorCount>0 && <span className="text-red-400">{errorCount} error{errorCount!==1?"s":""}</span>}
                {isNewBest && <span className="text-yellow-400 font-bold">🏆 New personal best!</span>}
              </div>
              {wpmHistory.length > 3 && (
                <div className="mb-5 bg-slate-950/60 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-2 font-semibold">WPM over time</p>
                  <svg viewBox={`0 0 ${W} 56`} preserveAspectRatio="none" width="100%" height="56">
                    <polyline
                      points={wpmHistory.map((v, i) => `${(i/Math.max(wpmHistory.length-1,1))*W},${56-(v/chartMax)*50}`).join(" ")}
                      fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => newQuote()} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors">
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <button onClick={() => { newQuote(); setZenMode(true); }} className="px-5 py-3 bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-xl font-semibold transition-colors text-sm">
                  Zen Mode
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!done && (
          <button onClick={() => newQuote()} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
            <RotateCcw className="w-4 h-4" /> New Quote (Tab)
          </button>
        )}
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
